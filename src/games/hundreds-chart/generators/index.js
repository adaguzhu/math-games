import { buildRoundQuestionsFromMap } from '../../../shared/round-engine.js';
import { genCompassHops } from './compass-hops.js';
import { genCenterCross } from './center-cross.js';
import { genNeighborClues } from './neighbor-clues.js';
import { genSingleClue } from './single-clue.js';
import { genChartDetective } from './chart-detective.js';
import { genChart120 } from './chart-120.js';

export const GENERATORS_BY_MODE = {
  compass_hops: genCompassHops,
  center_cross: genCenterCross,
  neighbor_clues: genNeighborClues,
  single_clue: genSingleClue,
  chart_detective: genChartDetective,
  chart_120: genChart120
};

export const MIX_SCHEDULE = [
  'compass_hops', 'compass_hops',
  'center_cross', 'center_cross',
  'neighbor_clues', 'neighbor_clues',
  'single_clue',
  'chart_detective', 'chart_detective',
  'chart_120'
];

export function buildRoundQuestions(modeId) {
  return buildRoundQuestionsFromMap({
    modeId,
    generatorsByMode: GENERATORS_BY_MODE,
    mixSchedule: MIX_SCHEDULE,
    fallbackMode: 'center_cross'
  });
}

export {
  genCompassHops,
  genCenterCross,
  genNeighborClues,
  genSingleClue,
  genChartDetective,
  genChart120
};
