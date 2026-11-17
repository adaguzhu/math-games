import { COMPANIONS } from './companions.js';
import { MODES, MIX_META, ALL_MODE_IDS, ALL_MODES_META } from './modes.js';
import { GUIDE_TITLE, GUIDE_SUBTITLE, GUIDE_HTML } from './guide.js';
import { buildRoundQuestions } from './generators/index.js';

export const HUNDREDS_CHART_GAME = {
  id: 'hundreds-chart',
  title: '100-Chart Cross Puzzles',
  gradeId: 'grade1',
  assignedProfileId: 'grade1',
  gradeLabel: '1st Grade',
  theme: 'sky',
  defaultPace: 'relaxed',
  enableReadAloud: true,
  cardDescription: 'Crack 100-chart & 120-chart cross puzzles! Master 10 Less, 10 More, 1 Less, 1 More, and missing-middle mysteries with 29 Dog Man & Supa Buddies!',
  starterId: '11_cat_kid',
  companions: COMPANIONS,
  companionNoun: 'Chart Detective',
  companionNounPlural: 'Chart Detectives',
  companionNounPluralLower: 'chart detectives',
  companionEmoji: '🐾',
  unlockHeading: 'A Detective Badge Capsule Is Opening!',
  unlockPodEmoji: '🧭',
  groupLabel: 'Squad',
  sanctuaryTabLabel: '🐾 Detective HQ',
  sanctuaryTitle: '🐾 Supa Chart Detectives HQ',
  sanctuarySubtitle: 'Each quest type (including Daily Mix) unlocks its own Chart Detective — every <strong>10 ⭐</strong> earned in a quest opens a new Detective Badge Capsule! Tap any unlocked buddy to make them your Study Buddy.',
  sanctuaryFilters: ['All', 'Unlocked', 'Supa Cops', 'Supa Buddies', 'Robots & Tech', 'Redeemed Heroes', 'City Friends', 'Cat Kid Club', 'Villains'],
  guideTabLabel: '📖 100-Chart Guide',
  guideTitle: GUIDE_TITLE,
  guideSubtitle: GUIDE_SUBTITLE,
  guideHTML: GUIDE_HTML,
  mixBonusLabel: '🧭 Chart Detective Daily Mix Courage Bonus',
  modes: MODES,
  mixMeta: MIX_META,
  allModeIds: ALL_MODE_IDS,
  allModesMeta: ALL_MODES_META,
  buildRoundQuestions
};
