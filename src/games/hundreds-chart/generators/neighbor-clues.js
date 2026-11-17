import { buildCrossMultiSlotQuestion, getCrossValues, pickCrossCenter } from './helpers.js';

export function genNeighborClues() {
  const roll = Math.random();

  // 3A: Top + Left given -> fill center, right, bottom (30%)
  if (roll < 0.30) {
    const center = pickCrossCenter(1, 8);
    const { top, left, right, bottom } = getCrossValues(center);
    return buildCrossMultiSlotQuestion({
      dedupeKey: `nc_tl_${center}`,
      domainId: 'neighbor_clues',
      skillKey: 'neighbor_two_clues',
      skillLabel: 'Two-Clue Cross (Find Middle First)',
      topicLabel: 'Two-Clue Cross',
      center,
      givenPositions: ['top', 'left'],
      blankSlots: ['center', 'right', 'bottom'],
      fluencySeconds: 32,
      highlightCenterFirst: true,
      prompt: 'Find the MIDDLE square FIRST, then finish the rest of the cross!',
      helperText: `Look at Top (${top}) + 10 or Left (${left}) + 1 — both land on the same Middle square!`,
      mistakeSummary: `Top ${top}, Left ${left}`,
      explanationHTML: `
        Step 1 (Middle): <strong>${top} + 10 = ${center}</strong> (and <strong>${left} + 1 = ${center}</strong>)! Then Right is <strong>${right}</strong> (+1) and Bottom is <strong>${bottom}</strong> (+10).
      `
    });
  }

  // 3B: Right + Bottom given -> fill center, left, top (35%)
  if (roll < 0.65) {
    const center = pickCrossCenter(1, 8);
    const { top, left, right, bottom } = getCrossValues(center);
    return buildCrossMultiSlotQuestion({
      dedupeKey: `nc_rb_${center}`,
      domainId: 'neighbor_clues',
      skillKey: 'neighbor_two_clues',
      skillLabel: 'Two-Clue Cross (Find Middle First)',
      topicLabel: 'Two-Clue Cross',
      center,
      givenPositions: ['right', 'bottom'],
      blankSlots: ['center', 'left', 'top'],
      fluencySeconds: 32,
      highlightCenterFirst: true,
      prompt: 'Use Right and Bottom to find the MIDDLE square FIRST, then finish the cross!',
      helperText: `Step 1 left from ${right} (−1) OR up 1 row from ${bottom} (−10) to find the Middle square!`,
      mistakeSummary: `Right ${right}, Bottom ${bottom}`,
      explanationHTML: `
        Step 1 (Middle): <strong>${right} − 1 = ${center}</strong> (and <strong>${bottom} − 10 = ${center}</strong>)! Then Left is <strong>${left}</strong> (−1) and Top is <strong>${top}</strong> (−10).
      `
    });
  }

  // 3C: Top + Left + Bottom given -> fill center, right (20%, weighted toward cols 7..9)
  if (roll < 0.85) {
    const center = pickCrossCenter(1, 8, Math.random() < 0.75 ? [7, 8, 9] : null);
    const { top, left, right, bottom } = getCrossValues(center);
    return buildCrossMultiSlotQuestion({
      dedupeKey: `nc_tlb_${center}`,
      domainId: 'neighbor_clues',
      skillKey: 'neighbor_three_clues',
      skillLabel: 'Three-Clue Cross (Decade Edge)',
      topicLabel: 'Three-Clue Cross',
      center,
      givenPositions: ['top', 'left', 'bottom'],
      blankSlots: ['center', 'right'],
      fluencySeconds: 26,
      highlightCenterFirst: true,
      prompt: 'Three clues are printed! Find the MIDDLE square first, then the RIGHT square:',
      helperText: `The column already shows ${top} and ${bottom}. What sits right between them (and 1 after ${left})?`,
      mistakeSummary: `Top ${top}, Left ${left}, Bottom ${bottom}`,
      explanationHTML: `
        Step 1 (Middle): <strong>${left} + 1 = ${center}</strong> (between ${top} and ${bottom})! Step 2 (Right): <strong>${center} + 1 = ${right}</strong>!
      `
    });
  }

  // 3D: Top + Right OR Left + Bottom given -> fill center + remaining 2 blanks (15%)
  const center = pickCrossCenter(1, 8);
  const { top, left, right, bottom } = getCrossValues(center);
  if (Math.random() < 0.5) {
    return buildCrossMultiSlotQuestion({
      dedupeKey: `nc_tr_${center}`,
      domainId: 'neighbor_clues',
      skillKey: 'neighbor_two_clues',
      skillLabel: 'Two-Clue Cross (Find Middle First)',
      topicLabel: 'Two-Clue Cross',
      center,
      givenPositions: ['top', 'right'],
      blankSlots: ['center', 'left', 'bottom'],
      fluencySeconds: 32,
      highlightCenterFirst: true,
      prompt: 'Find the MIDDLE square FIRST from Top and Right, then finish the cross!',
      helperText: `Go down +10 from ${top} or left −1 from ${right} to get the Middle square!`,
      mistakeSummary: `Top ${top}, Right ${right}`,
      explanationHTML: `
        Step 1 (Middle): <strong>${top} + 10 = ${center}</strong> (and <strong>${right} − 1 = ${center}</strong>)! Then Left is <strong>${left}</strong> and Bottom is <strong>${bottom}</strong>.
      `
    });
  }

  return buildCrossMultiSlotQuestion({
    dedupeKey: `nc_lb_${center}`,
    domainId: 'neighbor_clues',
    skillKey: 'neighbor_two_clues',
    skillLabel: 'Two-Clue Cross (Find Middle First)',
    topicLabel: 'Two-Clue Cross',
    center,
    givenPositions: ['left', 'bottom'],
    blankSlots: ['center', 'right', 'top'],
    fluencySeconds: 32,
    highlightCenterFirst: true,
    prompt: 'Find the MIDDLE square FIRST from Left and Bottom, then finish the cross!',
    helperText: `Go right +1 from ${left} or up −10 from ${bottom} to unlock the Middle square!`,
    mistakeSummary: `Left ${left}, Bottom ${bottom}`,
    explanationHTML: `
      Step 1 (Middle): <strong>${left} + 1 = ${center}</strong> (and <strong>${bottom} − 10 = ${center}</strong>)! Then Right is <strong>${right}</strong> and Top is <strong>${top}</strong>.
    `
  });
}
