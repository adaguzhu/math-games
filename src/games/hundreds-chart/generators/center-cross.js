import { buildCrossMultiSlotQuestion, getCrossValues, pickCrossCenter } from './helpers.js';

export function genCenterCross() {
  const center = pickCrossCenter(1, 8);
  const { top, left, right, bottom } = getCrossValues(center);

  // 2A: Vertical Spine on Cross (35%)
  if (Math.random() < 0.35) {
    return buildCrossMultiSlotQuestion({
      dedupeKey: `cc_spine_${center}`,
      domainId: 'center_cross',
      skillKey: 'center_cross_spine',
      skillLabel: 'Vertical Spine on Cross',
      topicLabel: 'Center Cross (↕)',
      center,
      givenPositions: ['center', 'left', 'right'],
      blankSlots: ['top', 'bottom'],
      fluencySeconds: 24,
      showDirectionBadges: true,
      prompt: 'The middle row is filled! Fill 10 LESS (↑) above and 10 MORE (↓) below:',
      helperText: `Notice ${left}, ${center}, ${right} count by 1s across the row. Now change ONLY the tens digit for Top (−10) and Bottom (+10)!`,
      mistakeSummary: `Cross spine at ${center}`,
      explanationHTML: `
        Going UP from <strong>${center}</strong> subtracts 10 → <strong>${top}</strong>. Going DOWN adds 10 → <strong>${bottom}</strong>!
      `
    });
  }

  // 2B: Full 4-Neighbor Worksheet Cross (65%)
  const showBadges = Math.random() < 0.5;
  return buildCrossMultiSlotQuestion({
    dedupeKey: `cc_full_${center}_${showBadges ? 'b' : 'c'}`,
    domainId: 'center_cross',
    skillKey: 'center_cross_full',
    skillLabel: 'Full 4-Neighbor Cross',
    topicLabel: 'Center-Clue Cross',
    center,
    givenPositions: ['center'],
    blankSlots: ['left', 'right', 'top', 'bottom'],
    fluencySeconds: 32,
    showDirectionBadges: showBadges,
    prompt: `Use the middle number ${center} to finish all 4 squares of the cross!`,
    helperText: `Sideways changes by 1 (${center} − 1 = ${left}, ${center} + 1 = ${right}). Up/down changes by 10 (${center} − 10 = ${top}, ${center} + 10 = ${bottom})!`,
    mistakeSummary: `Full cross around ${center}`,
    explanationHTML: `
      From <strong>${center}</strong>: Left is <strong>${left}</strong> (−1), Right is <strong>${right}</strong> (+1), Top is <strong>${top}</strong> (−10), Bottom is <strong>${bottom}</strong> (+10)!
    `
  });
}
