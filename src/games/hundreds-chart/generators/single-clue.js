import { buildCrossMultiSlotQuestion, getCrossValues, pickCrossCenter } from './helpers.js';

export function genSingleClue() {
  const center = pickCrossCenter(1, 8);
  const { top, left, right, bottom } = getCrossValues(center);
  const roll = Math.random();

  // 4A: Only Top given (35%)
  if (roll < 0.35) {
    return buildCrossMultiSlotQuestion({
      dedupeKey: `sc_top_${center}`,
      domainId: 'single_clue',
      skillKey: 'single_clue_cross',
      skillLabel: 'One-Clue Cross Detective',
      topicLabel: 'One-Clue Cross',
      center,
      givenPositions: ['top'],
      blankSlots: ['center', 'left', 'right', 'bottom'],
      fluencySeconds: 36,
      highlightCenterFirst: true,
      showDirectionBadges: false,
      prompt: `Only TOP (${top}) is given! Find the Middle square first, then finish the whole cross:`,
      helperText: `Hop down +10 from ${top} to unlock the Middle square (${center}), then branch out ±1 and +10!`,
      mistakeSummary: `Only Top ${top}`,
      explanationHTML: `
        Start at Top <strong>${top}</strong> → Middle is <strong>${top} + 10 = ${center}</strong>! From ${center}: Left is <strong>${left}</strong>, Right is <strong>${right}</strong>, Bottom is <strong>${bottom}</strong>.
      `
    });
  }

  // 4B: Only Bottom given (30%)
  if (roll < 0.65) {
    return buildCrossMultiSlotQuestion({
      dedupeKey: `sc_bot_${center}`,
      domainId: 'single_clue',
      skillKey: 'single_clue_cross',
      skillLabel: 'One-Clue Cross Detective',
      topicLabel: 'One-Clue Cross',
      center,
      givenPositions: ['bottom'],
      blankSlots: ['center', 'left', 'right', 'top'],
      fluencySeconds: 36,
      highlightCenterFirst: true,
      showDirectionBadges: false,
      prompt: `Only BOTTOM (${bottom}) is given! Find the Middle square first, then finish the whole cross:`,
      helperText: `Hop up −10 from ${bottom} to unlock the Middle square (${center}), then branch out!`,
      mistakeSummary: `Only Bottom ${bottom}`,
      explanationHTML: `
        Start at Bottom <strong>${bottom}</strong> → Middle is <strong>${bottom} − 10 = ${center}</strong>! From ${center}: Left is <strong>${left}</strong>, Right is <strong>${right}</strong>, Top is <strong>${top}</strong>.
      `
    });
  }

  // 4C: Only Left or Only Right given (35%)
  if (Math.random() < 0.5) {
    return buildCrossMultiSlotQuestion({
      dedupeKey: `sc_left_${center}`,
      domainId: 'single_clue',
      skillKey: 'single_clue_cross',
      skillLabel: 'One-Clue Cross Detective',
      topicLabel: 'One-Clue Cross',
      center,
      givenPositions: ['left'],
      blankSlots: ['center', 'right', 'top', 'bottom'],
      fluencySeconds: 36,
      highlightCenterFirst: true,
      showDirectionBadges: false,
      prompt: `Only LEFT (${left}) is given! Find the Middle square first, then finish the whole cross:`,
      helperText: `Step right +1 from ${left} to find the Middle square (${center}), then fill the rest!`,
      mistakeSummary: `Only Left ${left}`,
      explanationHTML: `
        Start at Left <strong>${left}</strong> → Middle is <strong>${left} + 1 = ${center}</strong>! From ${center}: Right is <strong>${right}</strong>, Top is <strong>${top}</strong>, Bottom is <strong>${bottom}</strong>.
      `
    });
  }

  return buildCrossMultiSlotQuestion({
    dedupeKey: `sc_right_${center}`,
    domainId: 'single_clue',
    skillKey: 'single_clue_cross',
    skillLabel: 'One-Clue Cross Detective',
    topicLabel: 'One-Clue Cross',
    center,
    givenPositions: ['right'],
    blankSlots: ['center', 'left', 'top', 'bottom'],
    fluencySeconds: 36,
    highlightCenterFirst: true,
    showDirectionBadges: false,
    prompt: `Only RIGHT (${right}) is given! Find the Middle square first, then finish the whole cross:`,
    helperText: `Step left −1 from ${right} to find the Middle square (${center}), then fill the rest!`,
    mistakeSummary: `Only Right ${right}`,
    explanationHTML: `
      Start at Right <strong>${right}</strong> → Middle is <strong>${right} − 1 = ${center}</strong>! From ${center}: Left is <strong>${left}</strong>, Top is <strong>${top}</strong>, Bottom is <strong>${bottom}</strong>.
    `
  });
}
