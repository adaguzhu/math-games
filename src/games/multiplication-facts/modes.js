export const MODES = [
  {
    id: 'quick_1m',
    title: '1-Minute Speed Check',
    shortTitle: '1-Min Check',
    icon: '⏱️',
    iconBg: '#E0F2FE',
    durationSec: 60,
    targetFacts: 20,
    desc: 'Warm up with a crisp 60-second sprint across all 1×1 to 12×12 facts at the 20-facts/min goal pace.',
    vocab: ['1:00 timer', '1–12 mix', '20-fact pace']
  },
  {
    id: 'half_2m30',
    title: '2:30 Half-Challenge',
    shortTitle: '2:30 Half-Run',
    icon: '🏔️',
    iconBg: '#CCFBF1',
    durationSec: 150,
    targetFacts: 50,
    desc: 'Half the full gauntlet! Build steady rhythm and hit 50 facts in 2 minutes 30 seconds across 1–12.',
    vocab: ['2:30 timer', '50-fact pace', 'stamina']
  },
  {
    id: 'tables_foundation',
    title: 'Foundation Sprint (×1, ×2, ×5, ×10)',
    shortTitle: '×1, ×2, ×5, ×10',
    icon: '🌱',
    iconBg: '#DCFCE7',
    durationSec: 120,
    targetFacts: 40,
    desc: 'Lock in automatic recall on anchor tables ×1, ×2, ×5, and ×10 paired with 1–12 in both orders.',
    vocab: ['2:00 timer', '×1 ×2 ×5 ×10', 'anchor facts']
  },
  {
    id: 'tables_core',
    title: 'Core Tables Sprint (×3, ×4, ×6)',
    shortTitle: '×3, ×4, ×6',
    icon: '🔥',
    iconBg: '#FEF3C7',
    durationSec: 120,
    targetFacts: 40,
    desc: 'Sharpen your core middle tables ×3, ×4, and ×6 with doubles, double-doubles, and 1–12 pairs.',
    vocab: ['2:00 timer', '×3 ×4 ×6', 'core tables']
  },
  {
    id: 'tables_tricky',
    title: 'Tricky Tables Sprint (×7, ×8, ×9)',
    shortTitle: '×7, ×8, ×9',
    icon: '⚡',
    iconBg: '#FFEDD5',
    durationSec: 120,
    targetFacts: 40,
    desc: 'Conquer the toughest facts in 3rd grade (×7, ×8, ×9) until answers like 7×8 and 8×9 feel instant!',
    vocab: ['2:00 timer', '×7 ×8 ×9', 'tough facts']
  },
  {
    id: 'tables_master',
    title: 'Big Tables & Squares (×11, ×12, n²)',
    shortTitle: '×11, ×12, n²',
    icon: '👑',
    iconBg: '#EDE9FE',
    durationSec: 120,
    targetFacts: 40,
    desc: 'Master big ×11 and ×12 facts plus every square number from 1×1 up to 12×12 = 144.',
    vocab: ['2:00 timer', '×11 ×12', 'squares n²']
  }
];

export const MIX_META = {
  id: 'mix',
  title: '5-Minute 100-Fact Challenge',
  shortTitle: '5-Min Challenge',
  icon: '⚡',
  iconBg: '#E0F2FE',
  durationSec: 300,
  targetFacts: 100,
  unlocksGrandPrize: true,
  bannerTitle: '⚡ 5-Minute 100-Fact Challenge (All Tables 1–12)',
  bannerDesc: 'Timed fluency gauntlet on 1×1 through 12×12! Watch your live 100-fact pace bar, race your Personal Best Ghost, and solve <strong>100+ facts in 5 minutes</strong> to awaken the colossal <strong>King Darkstalker</strong>!',
  ctaLabel: 'Start 5:00 Challenge →'
};

export const ALL_MODE_IDS = [
  'mix',
  'quick_1m',
  'half_2m30',
  'tables_foundation',
  'tables_core',
  'tables_tricky',
  'tables_master'
];

export const ALL_MODES_META = [MIX_META, ...MODES];
