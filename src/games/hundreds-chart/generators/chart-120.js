import { randInt } from '../../../shared/math.js';
import { buildChartStripHTML } from '../../../shared/manipulatives.js';
import { CROSS_SLOT_META, buildCrossMultiSlotQuestion, getCrossValues, pickCrossCenter } from './helpers.js';

export function genChart120() {
  const roll = Math.random();

  // 6A: Vertical Column Trio bridging 100 (35%)
  if (roll < 0.35) {
    const n = randInt(91, 110);
    const top = n - 10;
    const bottom = n + 10;
    const ones = n % 10;
    return {
      dedupeKey: `c120_trio_${n}`,
      domainId: 'chart_120',
      skillKey: 'chart120_column_bridge',
      skillLabel: '120-Chart Column Bridging 100',
      topicLabel: '120-Chart Column (↕)',
      inputType: 'multi_slot',
      slots: [CROSS_SLOT_META.top, CROSS_SLOT_META.bottom],
      fluencySeconds: 26,
      enableHundredsChart: true,
      chartMax: 120,
      chartClues: [n],
      prompt: `On the 120-chart, fill 10 LESS (↑) above and 10 MORE (↓) below ${n}:`,
      stageHTML: buildChartStripHTML({
        orientation: 'vertical',
        arrowBadge: '↕ Bridging 100!',
        cells: [
          { multiSlotId: 'top', active: true, badge: '↑ −10', ariaLabel: 'Top (10 less)' },
          { val: n },
          { multiSlotId: 'bottom', active: false, badge: '↓ +10', ariaLabel: 'Bottom (10 more)' }
        ],
        captionHTML: `Past 100, the ones digit STILL stays <strong>${ones}</strong>!`
      }),
      helperText: `Even past 100, moving UP/DOWN changes only the tens (${Math.floor(n / 10)} tens ± 1 ten) and keeps ${ones} in the ones place!`,
      mistakeSummary: `120-chart column around ${n}`,
      answer: { top, bottom },
      explanationHTML: `
        Crossing 100 follows the exact same pattern: <strong>${n} − 10 = ${top}</strong> above, and <strong>${n} + 10 = ${bottom}</strong> below!
      `
    };
  }

  // 6B: Center-Clue Cross on 120-Chart (40%)
  if (roll < 0.75) {
    const center = pickCrossCenter(8, 10); // 82..109, col 2..9
    const { top, left, right, bottom } = getCrossValues(center);
    return buildCrossMultiSlotQuestion({
      dedupeKey: `c120_cc_${center}`,
      domainId: 'chart_120',
      skillKey: 'chart120_center_cross',
      skillLabel: '120-Chart Center Cross',
      topicLabel: '120-Chart Cross',
      center,
      givenPositions: ['center'],
      blankSlots: ['left', 'right', 'top', 'bottom'],
      fluencySeconds: 34,
      chartMax: 120,
      showDirectionBadges: Math.random() < 0.5,
      prompt: `Use ${center} on the 120-chart to fill all 4 neighbors of this cross!`,
      helperText: `Left is ${center} − 1, Right is ${center} + 1, Top is ${center} − 10, Bottom is ${center} + 10!`,
      mistakeSummary: `120-chart cross at ${center}`,
      explanationHTML: `
        From <strong>${center}</strong> on the 120-chart: Left <strong>${left}</strong>, Right <strong>${right}</strong>, Top <strong>${top}</strong>, Bottom <strong>${bottom}</strong>!
      `
    });
  }

  // 6C: Two-Clue Missing-Center Cross on 120-Chart (25%)
  const center = pickCrossCenter(8, 10);
  const { top, left, right, bottom } = getCrossValues(center);
  if (Math.random() < 0.5) {
    return buildCrossMultiSlotQuestion({
      dedupeKey: `c120_nc_tl_${center}`,
      domainId: 'chart_120',
      skillKey: 'chart120_neighbor_cross',
      skillLabel: '120-Chart Missing-Middle Cross',
      topicLabel: '120-Chart Mystery',
      center,
      givenPositions: ['top', 'left'],
      blankSlots: ['center', 'right', 'bottom'],
      fluencySeconds: 34,
      chartMax: 120,
      highlightCenterFirst: true,
      prompt: 'On the 120-chart, find the MIDDLE square FIRST, then finish the cross!',
      helperText: `Hop +10 from ${top} or +1 from ${left} to find the Middle square (${center})!`,
      mistakeSummary: `120-chart Top ${top}, Left ${left}`,
      explanationHTML: `
        Step 1 (Middle): <strong>${top} + 10 = ${center}</strong> (and <strong>${left} + 1 = ${center}</strong>)! Then Right is <strong>${right}</strong> and Bottom is <strong>${bottom}</strong>.
      `
    });
  }

  return buildCrossMultiSlotQuestion({
    dedupeKey: `c120_nc_rb_${center}`,
    domainId: 'chart_120',
    skillKey: 'chart120_neighbor_cross',
    skillLabel: '120-Chart Missing-Middle Cross',
    topicLabel: '120-Chart Mystery',
    center,
    givenPositions: ['right', 'bottom'],
    blankSlots: ['center', 'left', 'top'],
    fluencySeconds: 34,
    chartMax: 120,
    highlightCenterFirst: true,
    prompt: 'On the 120-chart, find the MIDDLE square FIRST, then finish the cross!',
    helperText: `Hop −1 from ${right} or −10 from ${bottom} to find the Middle square (${center})!`,
    mistakeSummary: `120-chart Right ${right}, Bottom ${bottom}`,
    explanationHTML: `
      Step 1 (Middle): <strong>${right} − 1 = ${center}</strong> (and <strong>${bottom} − 10 = ${center}</strong>)! Then Left is <strong>${left}</strong> and Top is <strong>${top}</strong>.
    `
  });
}
