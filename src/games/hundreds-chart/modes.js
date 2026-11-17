export const MODES = [
  {
    id: 'compass_hops',
    title: '10 Less, 10 More & ±1 Hops',
    shortTitle: '±10 & ±1 Hops',
    icon: '🧭',
    iconBg: '#FEF3C7',
    desc: 'Hop UP 1 row (−10), DOWN 1 row (+10), and step left or right by 1 across decade turns!',
    vocab: ['10 less', '10 more', '±1 row/col']
  },
  {
    id: 'center_cross',
    title: 'Center-Clue Crosses',
    shortTitle: 'Center Crosses',
    icon: '➕',
    iconBg: '#DCFCE7',
    desc: 'Start from the middle number of a 100-chart cross cutout and fill all 4 neighbors!',
    vocab: ['middle clue', '↑ −10 / ↓ +10', '← −1 / → +1']
  },
  {
    id: 'neighbor_clues',
    title: 'Two-Clue Crosses (Find Middle!)',
    shortTitle: 'Two-Clue Crosses',
    icon: '🧩',
    iconBg: '#E0F2FE',
    desc: 'When the middle square is blank, use two neighbor clues to crack the center FIRST!',
    vocab: ['find middle 1st', 'two clues', 'cross puzzle']
  },
  {
    id: 'single_clue',
    title: 'One-Clue Cross Detective',
    shortTitle: 'One-Clue Crosses',
    icon: '🕵️',
    iconBg: '#FCE7F3',
    desc: 'Only ONE outer square is printed! Unlock the middle square first, then finish the whole cross.',
    vocab: ['one clue', 'work inward', 'full cross']
  },
  {
    id: 'chart_detective',
    title: 'Chart Windows & Oops Detective',
    shortTitle: 'Oops Detective',
    icon: '🔎',
    iconBg: '#CCFBF1',
    desc: 'Spot sneaky wrong numbers on completed crosses, fill 3×3 windows, and follow 2-hop compass riddles!',
    vocab: ['spot the oops', '3×3 window', '2-hop riddle']
  },
  {
    id: 'chart_120',
    title: 'Beyond 100: The 120-Chart!',
    shortTitle: '120-Chart',
    icon: '🚀',
    iconBg: '#FFEDD5',
    desc: 'Cross the 100 bridge into 101–120! See how the exact same +10 and +1 patterns keep going past 100.',
    vocab: ['94 → 104 → 114', 'bridge 100', '120-chart']
  }
];

export const MIX_META = {
  id: 'mix',
  title: 'Supa Chart Daily Mix',
  shortTitle: 'Daily Mix',
  icon: '🗺️',
  iconBg: '#E0F2FE',
  bannerTitle: '🗺️ Supa Chart Daily Mix (All 6 Skills)',
  bannerDesc: '10 cozy, untimed 100-chart & 120-chart puzzles mixing ±10/±1 Hops, Center Crosses, Missing-Middle Mysteries, Oops Detective, and 120-Chart Bridges! Earn a <strong>+1 Courage Bonus Star</strong> for 8+ first-try answers!'
};

export const ALL_MODE_IDS = ['mix', 'compass_hops', 'center_cross', 'neighbor_clues', 'single_clue', 'chart_detective', 'chart_120'];
export const ALL_MODES_META = [MIX_META, ...MODES];
