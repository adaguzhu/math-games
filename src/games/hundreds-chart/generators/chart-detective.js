import { pick, randInt, shuffle } from '../../../shared/math.js';
import { buildCrossPuzzleHTML, buildMiniWindow3x3HTML } from '../../../shared/manipulatives.js';
import { getCrossValues, pickCrossCenter } from './helpers.js';

const POS_NAMES = {
  top: 'Top',
  bottom: 'Bottom',
  left: 'Left',
  right: 'Right'
};

function pickWrongOuterValue(pos, center, trueVal) {
  const rawCandidates = {
    top: [center - 3, center - 1, center + 10, center - 2, trueVal + 1, trueVal - 1],
    bottom: [center + 3, center - 10, center + 1, trueVal + 1, trueVal - 1],
    left: [center - 10, trueVal - 1, center + 1, center - 2, trueVal + 10],
    right: [center + 10, trueVal + 1, center - 1, center + 2, trueVal - 10]
  }[pos];

  const valid = rawCandidates.filter(v => v >= 1 && v <= 100 && v !== trueVal);
  return valid[0] || (trueVal > 10 ? trueVal - 1 : trueVal + 1);
}

export function genChartDetective() {
  const roll = Math.random();

  // 5A: "Spot the Oops!" (40%, choice)
  if (roll < 0.40) {
    const center = pickCrossCenter(1, 8);
    const trueVals = getCrossValues(center);
    const badPos = Math.random() < 0.50 ? 'top' : pick(['bottom', 'left', 'right']);
    const wrongVal = pickWrongOuterValue(badPos, center, trueVals[badPos]);

    let correctLabel = '';
    const choices = ['top', 'bottom', 'left', 'right'].map(pos => {
      if (pos === badPos) {
        correctLabel = `${POS_NAMES[pos]}: ${wrongVal} → ${trueVals[pos]}`;
        return {
          id: correctLabel,
          label: correctLabel
        };
      }
      const shown = trueVals[pos];
      const fakeFix = shown + 10 <= 100 ? shown + 10 : shown - 10;
      const lbl = `${POS_NAMES[pos]}: ${shown} → ${fakeFix}`;
      return {
        id: lbl,
        label: lbl
      };
    });

    const reasonText = (badPos === 'top' || badPos === 'bottom')
      ? `In a vertical column around <strong>${center}</strong>, the ones digit must stay <strong>${center % 10}</strong>!`
      : `In a horizontal row around <strong>${center}</strong>, neighbors change by only <strong>1</strong>!`;

    return {
      dedupeKey: `det_oops_${center}_${badPos}_${wrongVal}`,
      domainId: 'chart_detective',
      skillKey: 'spot_the_oops',
      skillLabel: 'Spot the Oops! Cross Check',
      topicLabel: 'Spot the Oops!',
      inputType: 'choice',
      fluencySeconds: 24,
      enableHundredsChart: true,
      chartMax: 100,
      chartClues: [center],
      prompt: `One outer number in this cross does NOT belong! Which square needs fixing?`,
      stageHTML: buildCrossPuzzleHTML({
        center,
        givenPositions: ['top', 'left', 'center', 'right', 'bottom'],
        overrideValues: { [badPos]: wrongVal }
      }),
      helperText: `Check all 4 directions from ${center}: ↑ −10, ↓ +10, ← −1, → +1!`,
      mistakeSummary: `Oops check on center ${center}`,
      answer: correctLabel,
      choices: shuffle(choices),
      explanationHTML: `
        ${reasonText} From <strong>${center}</strong>, the <strong>${POS_NAMES[badPos]}</strong> square was ${wrongVal}, so it should be <strong>${trueVals[badPos]}</strong>!
      `
    };
  }

  // 5B: Mini 3x3 Chart Window (35%, numpad)
  if (roll < 0.75) {
    const topRow = randInt(0, 7);
    const topCol = randInt(1, 8);
    const topLeft = topRow * 10 + topCol;
    const all9 = [];
    for (let dr = 0; dr < 3; dr++) {
      for (let dc = 0; dc < 3; dc++) {
        all9.push(topLeft + dr * 10 + dc);
      }
    }
    const mysteryNum = pick(all9);
    const givenNums = all9.filter(n => n !== mysteryNum);
    const ones = mysteryNum % 10;

    return {
      dedupeKey: `det_win3_${topLeft}_${mysteryNum}`,
      domainId: 'chart_detective',
      skillKey: 'mini_chart_window',
      skillLabel: '3×3 Chart Window Detective',
      topicLabel: '3×3 Chart Window',
      inputType: 'numpad',
      fluencySeconds: 20,
      enableHundredsChart: true,
      chartMax: 100,
      chartClues: givenNums,
      prompt: 'A piece of the 100-chart is missing a square! What number goes in the ? box?',
      stageHTML: buildMiniWindow3x3HTML({
        topLeft,
        givenNums,
        mysteryNum
      }),
      helperText: `Look across the row (+1 / −1) AND down the column (+10 / −10) — every number in that column ends in ${ones}!`,
      mistakeSummary: `3×3 window missing ${mysteryNum}`,
      answer: mysteryNum,
      explanationHTML: `
        Checking the row and column in the 3×3 chart window shows the missing square is <strong>${mysteryNum}</strong>!
      `
    };
  }

  // 5C: Two-Hop Chart Compass Riddle (25%, numpad)
  const start = pickCrossCenter(1, 8);
  const dy = pick([-1, 1]);
  const dx = pick([-1, 1]);
  const vText = dy < 0 ? 'UP 1 row (−10)' : 'DOWN 1 row (+10)';
  const hText = dx < 0 ? 'LEFT 1 square (−1)' : 'RIGHT 1 square (+1)';
  const verticalFirst = Math.random() < 0.5;
  const firstStep = verticalFirst ? vText : hText;
  const secondStep = verticalFirst ? hText : vText;
  const midVal = verticalFirst ? start + dy * 10 : start + dx;
  const ans = start + dy * 10 + dx;

  return {
    dedupeKey: `det_hop2_${start}_${dy}_${dx}_${verticalFirst ? 'v' : 'h'}`,
    domainId: 'chart_detective',
    skillKey: 'compass_riddle_2hop',
    skillLabel: 'Two-Hop Chart Compass Riddle',
    topicLabel: '2-Hop Compass Riddle',
    inputType: 'numpad',
    fluencySeconds: 24,
    enableHundredsChart: true,
    chartMax: 100,
    chartClues: [start],
    prompt: `Start at ${start} on the 100-chart. Move ${firstStep}, then move ${secondStep}. What number do you land on?`,
    stageHTML: `
      <div class="iready-visual-stack">
        <div class="slide-caption">🧭 Start at <strong>${start}</strong> → ${firstStep} → ${secondStep}</div>
        <div class="equation-hero">
          <span>Landing square =</span>
          <span id="slot-main" class="answer-slot active">?</span>
        </div>
      </div>
    `,
    helperText: `Take one hop at a time: ${start} → ${midVal}, then take the second hop!`,
    mistakeSummary: `Start ${start}: ${firstStep}, then ${secondStep}`,
    answer: ans,
    explanationHTML: `
      Start at <strong>${start}</strong>: first move (${firstStep}) lands on <strong>${midVal}</strong>, then second move (${secondStep}) lands on <strong>${ans}</strong>!
    `
  };
}
