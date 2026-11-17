import { pick, randInt } from '../../../shared/math.js';
import { buildCrossPuzzleHTML } from '../../../shared/manipulatives.js';

export const CROSS_SLOT_META = {
  center: { id: 'center', label: 'Middle Square', shortLabel: 'Middle', maxDigits: 3 },
  top:    { id: 'top',    label: 'Top (−10)',     shortLabel: 'Top',    maxDigits: 3 },
  bottom: { id: 'bottom', label: 'Bottom (+10)',  shortLabel: 'Bottom', maxDigits: 3 },
  left:   { id: 'left',   label: 'Left (−1)',     shortLabel: 'Left',   maxDigits: 3 },
  right:  { id: 'right',  label: 'Right (+1)',    shortLabel: 'Right',  maxDigits: 3 }
};

export function pickCrossCenter(minRow = 1, maxRow = 8, allowedCols = null) {
  const row = randInt(minRow, maxRow);
  const col = Array.isArray(allowedCols) && allowedCols.length > 0
    ? pick(allowedCols)
    : randInt(2, 9);
  return row * 10 + col;
}

export function getCrossValues(center) {
  return {
    top: center - 10,
    left: center - 1,
    center,
    right: center + 1,
    bottom: center + 10
  };
}

export function buildCrossMultiSlotQuestion({
  dedupeKey,
  domainId,
  skillKey,
  skillLabel,
  topicLabel,
  center,
  givenPositions,
  blankSlots,
  fluencySeconds = 30,
  chartMax = 100,
  showDirectionBadges = false,
  highlightCenterFirst = false,
  prompt,
  helperText,
  mistakeSummary,
  explanationHTML
}) {
  const trueVals = getCrossValues(center);
  const slots = blankSlots.map(pos => CROSS_SLOT_META[pos]);
  const answer = {};
  blankSlots.forEach(pos => {
    answer[pos] = trueVals[pos];
  });
  const chartClues = givenPositions.map(pos => trueVals[pos]);

  return {
    dedupeKey,
    domainId,
    skillKey,
    skillLabel,
    topicLabel,
    inputType: 'multi_slot',
    slots,
    fluencySeconds,
    enableHundredsChart: true,
    chartMax,
    chartClues,
    prompt,
    stageHTML: buildCrossPuzzleHTML({
      center,
      givenPositions,
      blankSlots,
      showDirectionBadges,
      highlightCenterFirst
    }),
    helperText,
    mistakeSummary,
    answer,
    explanationHTML
  };
}
