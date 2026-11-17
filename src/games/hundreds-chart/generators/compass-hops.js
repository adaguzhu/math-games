import { pick, randInt } from '../../../shared/math.js';
import { buildChartStripHTML } from '../../../shared/manipulatives.js';
import { CROSS_SLOT_META } from './helpers.js';

export function genCompassHops() {
  const roll = Math.random();

  // 1A: Vertical Ten-Less (35%)
  if (roll < 0.35) {
    const n = randInt(11, 99);
    const ans = n - 10;
    const ones = n % 10;
    return {
      dedupeKey: `ch_up10_${n}`,
      domainId: 'compass_hops',
      skillKey: 'chart_ten_less',
      skillLabel: '10 Less (Up 1 Row)',
      topicLabel: '10 Less (↑)',
      inputType: 'numpad',
      fluencySeconds: 18,
      enableHundredsChart: true,
      chartMax: 100,
      chartClues: [n],
      prompt: `What number is 10 LESS (1 row UP) from ${n}?`,
      stageHTML: buildChartStripHTML({
        orientation: 'vertical',
        arrowBadge: '↑ 10 Less (−10)',
        cells: [
          { slotId: 'slot-main', badge: '↑ −10' },
          { val: n }
        ]
      }),
      helperText: `Going UP 1 row takes away 1 ten — the ones digit (${ones}) stays the same!`,
      mistakeSummary: `10 less than ${n}`,
      answer: ans,
      explanationHTML: `
        Going <strong>UP 1 row</strong> takes away 1 ten while the ones digit stays <strong>${ones}</strong>: <strong>${n} − 10 = ${ans}</strong>!
      `
    };
  }

  // 1B: Vertical Ten-More (25%)
  if (roll < 0.60) {
    const n = randInt(1, 90);
    const ans = n + 10;
    const ones = n % 10;
    return {
      dedupeKey: `ch_dn10_${n}`,
      domainId: 'compass_hops',
      skillKey: 'chart_ten_more',
      skillLabel: '10 More (Down 1 Row)',
      topicLabel: '10 More (↓)',
      inputType: 'numpad',
      fluencySeconds: 18,
      enableHundredsChart: true,
      chartMax: 100,
      chartClues: [n],
      prompt: `What number is 10 MORE (1 row DOWN) from ${n}?`,
      stageHTML: buildChartStripHTML({
        orientation: 'vertical',
        arrowBadge: '↓ 10 More (+10)',
        cells: [
          { val: n },
          { slotId: 'slot-main', badge: '↓ +10' }
        ]
      }),
      helperText: `Going DOWN 1 row adds 1 ten — the ones digit (${ones}) stays the same!`,
      mistakeSummary: `10 more than ${n}`,
      answer: ans,
      explanationHTML: `
        Going <strong>DOWN 1 row</strong> adds 1 ten while the ones digit stays <strong>${ones}</strong>: <strong>${n} + 10 = ${ans}</strong>!
      `
    };
  }

  // 1C: Vertical Column Trio (25%)
  if (roll < 0.85) {
    const n = randInt(11, 90);
    const top = n - 10;
    const bottom = n + 10;
    const ones = n % 10;
    return {
      dedupeKey: `ch_col3_${n}`,
      domainId: 'compass_hops',
      skillKey: 'chart_column_trio',
      skillLabel: '10 Less & 10 More Column',
      topicLabel: 'Column Trio (↕)',
      inputType: 'multi_slot',
      slots: [CROSS_SLOT_META.top, CROSS_SLOT_META.bottom],
      fluencySeconds: 24,
      enableHundredsChart: true,
      chartMax: 100,
      chartClues: [n],
      prompt: `Fill the square ABOVE (10 less) and BELOW (10 more) ${n}:`,
      stageHTML: buildChartStripHTML({
        orientation: 'vertical',
        arrowBadge: '↕ 10 Less & 10 More',
        cells: [
          { multiSlotId: 'top', active: true, badge: '↑ −10', ariaLabel: 'Top (10 less)' },
          { val: n },
          { multiSlotId: 'bottom', active: false, badge: '↓ +10', ariaLabel: 'Bottom (10 more)' }
        ]
      }),
      helperText: `Every number in this column ends in ${ones}! Subtract 10 to go up, add 10 to go down.`,
      mistakeSummary: `Column around ${n}`,
      answer: { top, bottom },
      explanationHTML: `
        In this column, every ones digit stays <strong>${ones}</strong>! Up 1 row: <strong>${n} − 10 = ${top}</strong>. Down 1 row: <strong>${n} + 10 = ${bottom}</strong>!
      `
    };
  }

  // 1D: Decade-Bridge Horizontal Row (15%)
  const dec = pick([20, 30, 40, 50, 60, 70, 80, 90]);
  const variant = Math.random();

  if (variant < 0.35) {
    return {
      dedupeKey: `ch_dec_r_${dec}`,
      domainId: 'compass_hops',
      skillKey: 'chart_decade_bridge',
      skillLabel: 'Decade-Bridge ±1 Hops',
      topicLabel: 'Decade Turn (→)',
      inputType: 'numpad',
      fluencySeconds: 18,
      enableHundredsChart: true,
      chartMax: 100,
      chartClues: [dec - 2, dec - 1],
      prompt: 'Count 1 more (+1) to finish this row up to the decade number:',
      stageHTML: buildChartStripHTML({
        orientation: 'horizontal',
        arrowBadge: '→ 1 More (+1)',
        cells: [
          { val: dec - 2 },
          { val: dec - 1 },
          { slotId: 'slot-main', badge: '→ +1' }
        ]
      }),
      helperText: `What friendly ten comes right after ${dec - 1}?`,
      mistakeSummary: `${dec - 2}, ${dec - 1}, ?`,
      answer: dec,
      explanationHTML: `
        1 more than <strong>${dec - 1}</strong> completes the ten: <strong>${dec}</strong>! (${dec - 2}, ${dec - 1}, <strong>${dec}</strong>)
      `
    };
  }

  if (variant < 0.70) {
    const ans = dec - 1;
    return {
      dedupeKey: `ch_dec_l_${dec}`,
      domainId: 'compass_hops',
      skillKey: 'chart_decade_bridge',
      skillLabel: 'Decade-Bridge ±1 Hops',
      topicLabel: 'Decade Turn (←)',
      inputType: 'numpad',
      fluencySeconds: 18,
      enableHundredsChart: true,
      chartMax: 100,
      chartClues: [dec - 2, dec],
      prompt: `What number is 1 LESS (−1) right before ${dec} on this row?`,
      stageHTML: buildChartStripHTML({
        orientation: 'horizontal',
        arrowBadge: '← 1 Less (−1)',
        cells: [
          { val: dec - 2 },
          { slotId: 'slot-main', badge: '← −1' },
          { val: dec }
        ],
        captionHTML: `Count 1 less from ${dec} in the same chart row!`
      }),
      helperText: `1 less than ${dec} sits right between ${dec - 2} and ${dec}, ending in 9!`,
      mistakeSummary: `${dec - 2}, ?, ${dec}`,
      answer: ans,
      explanationHTML: `
        1 less than <strong>${dec}</strong> is <strong>${ans}</strong>! (${dec - 2}, <strong>${ans}</strong>, ${dec})
      `
    };
  }

  const mid = dec - 1;
  const left = mid - 1;
  const right = dec;
  return {
    dedupeKey: `ch_dec_lr_${mid}`,
    domainId: 'compass_hops',
    skillKey: 'chart_decade_bridge',
    skillLabel: 'Decade-Bridge ±1 Hops',
    topicLabel: 'Decade Neighbors (↔)',
    inputType: 'multi_slot',
    slots: [CROSS_SLOT_META.left, CROSS_SLOT_META.right],
    fluencySeconds: 24,
    enableHundredsChart: true,
    chartMax: 100,
    chartClues: [mid],
    prompt: `Find 1 LESS (−1) and 1 MORE (+1) around ${mid}:`,
    stageHTML: buildChartStripHTML({
      orientation: 'horizontal',
      arrowBadge: '↔ 1 Less & 1 More',
      cells: [
        { multiSlotId: 'left', active: true, badge: '← −1', ariaLabel: 'Left (1 less)' },
        { val: mid },
        { multiSlotId: 'right', active: false, badge: '→ +1', ariaLabel: 'Right (1 more)' }
      ]
    }),
    helperText: `1 before ${mid} is ${left}, and 1 after ${mid} completes the row at ${right}!`,
    mistakeSummary: `Neighbors around ${mid}`,
    answer: { left, right },
    explanationHTML: `
      1 less than <strong>${mid}</strong> is <strong>${left}</strong>, and 1 more than <strong>${mid}</strong> completes the ten at <strong>${right}</strong>!
    `
  };
}
