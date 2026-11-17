import test from 'node:test';
import assert from 'node:assert/strict';
import { HUNDREDS_CHART_GAME } from '../src/games/hundreds-chart/index.js';
import {
  genCompassHops,
  genCenterCross,
  genNeighborClues,
  genSingleClue,
  genChartDetective,
  genChart120,
  buildRoundQuestions
} from '../src/games/hundreds-chart/generators/index.js';
import {
  buildMistakePromptText,
  createRoundState,
  formatCorrectAnswer
} from '../src/shared/round-engine.js';

function assertCommonChartShape(q, maxVal = 100) {
  assert.equal(typeof q.dedupeKey, 'string');
  assert.equal(typeof q.domainId, 'string');
  assert.equal(typeof q.skillKey, 'string');
  assert.ok(['numpad', 'choice', 'multi_slot'].includes(q.inputType));
  assert.equal(q.enableHundredsChart, true);
  assert.equal(q.chartMax, maxVal);
  assert.ok(Array.isArray(q.chartClues) && q.chartClues.length >= 1);
  assert.equal(typeof q.prompt, 'string');
  assert.equal(typeof q.explanationHTML, 'string');
  assert.equal(typeof q.mistakeSummary, 'string');
  if (q.stageHTML) {
    assert.equal(/onclick=/i.test(q.stageHTML), false, `Found inline onclick in ${q.dedupeKey}`);
  }

  if (q.inputType === 'numpad') {
    assert.ok(Number.isInteger(q.answer), `Expected integer answer, got ${q.answer}`);
    assert.ok(q.answer >= 1 && q.answer <= maxVal, `Answer ${q.answer} out of [1..${maxVal}] in ${q.dedupeKey}`);
    assert.ok(q.stageHTML.includes('id="slot-main"'));
    assert.equal(q.chartClues.includes(q.answer), false, `Clues must not contain answer ${q.answer} in ${q.dedupeKey}`);
  } else if (q.inputType === 'multi_slot') {
    assert.ok(Array.isArray(q.slots) && q.slots.length >= 2);
    assert.equal(typeof q.answer, 'object');
    const formatted = formatCorrectAnswer(q);
    q.slots.forEach(s => {
      const val = q.answer[s.id];
      assert.ok(Number.isInteger(val) && val >= 1 && val <= maxVal, `Slot ${s.id} answer ${val} out of bounds in ${q.dedupeKey}`);
      assert.ok(q.stageHTML.includes(`id="mslot-${s.id}"`), `Missing mslot-${s.id} in ${q.dedupeKey}`);
      assert.ok(q.stageHTML.includes('data-action="focus-multi-slot"'), `Missing focus-multi-slot in ${q.dedupeKey}`);
      assert.ok(q.stageHTML.includes(`data-slot="${s.id}"`), `Missing data-slot="${s.id}" in ${q.dedupeKey}`);
      assert.equal(q.chartClues.includes(val), false, `Clues must not leak slot ${s.id}=${val} in ${q.dedupeKey}`);
      assert.ok(formatted.includes(s.shortLabel || s.label));
      assert.ok(formatted.includes(String(val)));
    });
  } else {
    assert.ok(Array.isArray(q.choices) && q.choices.length === 4);
    const ids = q.choices.map(c => c.id);
    const labels = q.choices.map(c => c.label);
    assert.equal(new Set(ids).size, 4);
    assert.equal(new Set(labels).size, 4);
    assert.ok(ids.includes(q.answer));
  }
}

function assertCrossInvariants(q, maxVal = 100) {
  if (q.inputType !== 'multi_slot') return;
  const center = q.answer.center !== undefined ? q.answer.center : q.chartClues.find(n => {
    if (q.answer.top !== undefined && q.answer.top + 10 === n) return true;
    if (q.answer.bottom !== undefined && q.answer.bottom - 10 === n) return true;
    if (q.answer.left !== undefined && q.answer.left + 1 === n) return true;
    if (q.answer.right !== undefined && q.answer.right - 1 === n) return true;
    return false;
  });
  assert.ok(Number.isInteger(center), `Could not determine cross center for ${q.dedupeKey}`);
  const col = center % 10;
  assert.ok(col >= 2 && col <= 9, `Cross center ${center} must be in columns 2..9 (got col ${col})`);
  if (q.answer.top !== undefined) assert.equal(q.answer.top, center - 10);
  if (q.answer.bottom !== undefined) assert.equal(q.answer.bottom, center + 10);
  if (q.answer.left !== undefined) assert.equal(q.answer.left, center - 1);
  if (q.answer.right !== undefined) assert.equal(q.answer.right, center + 1);
  assert.ok(center - 10 >= 1 && center + 10 <= maxVal);
}

test('100-Chart Cross Puzzles catalog has 29 Dog Man characters with Cat Kid starter and Dog Man first unlock', () => {
  assert.equal(HUNDREDS_CHART_GAME.id, 'hundreds-chart');
  assert.equal(HUNDREDS_CHART_GAME.assignedProfileId, 'grade1');
  assert.equal(HUNDREDS_CHART_GAME.defaultPace, 'relaxed');
  assert.equal(HUNDREDS_CHART_GAME.theme, 'sky');
  assert.equal(HUNDREDS_CHART_GAME.enableReadAloud, true);
  assert.equal(HUNDREDS_CHART_GAME.starterId, '11_cat_kid');

  const comps = HUNDREDS_CHART_GAME.companions;
  assert.equal(comps.length, 29);
  assert.equal(new Set(comps.map(c => c.id)).size, 29);
  assert.equal(comps[0].id, '11_cat_kid');
  assert.equal(comps[0].modeId, 'starter');
  assert.equal(comps[1].id, '01_dog_man');
  assert.equal(comps[1].modeId, 'center_cross');

  const validTribes = new Set(HUNDREDS_CHART_GAME.sanctuaryFilters);
  comps.forEach((c, idx) => {
    assert.equal(c.orderNum, idx + 1);
    assert.equal(c.image, `./assets/addition-subtraction/companions/${c.id}.jpg`);
    assert.ok(validTribes.has(c.tribe), `Invalid tribe ${c.tribe} on ${c.id}`);
    assert.ok(typeof c.bio === 'string' && c.bio.length > 20);
    assert.ok(Array.isArray(c.quotes) && c.quotes.length >= 3);
  });

  const counts = {};
  comps.forEach(c => { counts[c.modeId] = (counts[c.modeId] || 0) + 1; });
  assert.equal(counts.starter, 1);
  for (const m of HUNDREDS_CHART_GAME.allModeIds) {
    assert.equal(counts[m], 4, `Expected 4 companions for mode ${m}`);
  }
});

test('Fuzz-test all 6 100-Chart Cross Puzzles generators (550 iterations each)', () => {
  const N = 550;

  for (let i = 0; i < N; i++) {
    const q = genCompassHops();
    assertCommonChartShape(q, 100);
    assert.equal(q.domainId, 'compass_hops');
  }

  for (let i = 0; i < N; i++) {
    const q = genCenterCross();
    assertCommonChartShape(q, 100);
    assert.equal(q.domainId, 'center_cross');
    assertCrossInvariants(q, 100);
  }

  for (let i = 0; i < N; i++) {
    const q = genNeighborClues();
    assertCommonChartShape(q, 100);
    assert.equal(q.domainId, 'neighbor_clues');
    assert.equal(q.slots[0].id, 'center', `Expected center first in ${q.dedupeKey}`);
    assertCrossInvariants(q, 100);
  }

  for (let i = 0; i < N; i++) {
    const q = genSingleClue();
    assertCommonChartShape(q, 100);
    assert.equal(q.domainId, 'single_clue');
    assert.equal(q.slots[0].id, 'center', `Expected center first in ${q.dedupeKey}`);
    assertCrossInvariants(q, 100);
  }

  for (let i = 0; i < N; i++) {
    const q = genChartDetective();
    assertCommonChartShape(q, 100);
    assert.equal(q.domainId, 'chart_detective');
  }

  for (let i = 0; i < N; i++) {
    const q = genChart120();
    assertCommonChartShape(q, 120);
    assert.equal(q.domainId, 'chart_120');
    if (q.skillKey !== 'chart120_column_bridge') {
      assertCrossInvariants(q, 120);
    }
    if (q.skillKey === 'chart120_neighbor_cross') {
      assert.equal(q.slots[0].id, 'center');
    }
  }
});

test('buildRoundQuestions and round-engine multi_slot state work cleanly for all 7 modes', () => {
  for (const modeId of HUNDREDS_CHART_GAME.allModeIds) {
    const round = buildRoundQuestions(modeId);
    assert.equal(round.length, 10);
    round.forEach(q => assertCommonChartShape(q, q.domainId === 'chart_120' ? 120 : 100));
    if (modeId === 'mix') {
      const domains = new Set(round.map(q => q.domainId));
      assert.equal(domains.size, 6);
    } else {
      assert.ok(round.every(q => q.domainId === modeId));
    }
  }

  const centerQ = genNeighborClues();
  const rs = createRoundState('neighbor_clues', [centerQ]);
  assert.equal(rs.activeSlot, 'center');
  assert.equal(rs.slotBufs.center, '');
  assert.ok(rs.lockedSlots instanceof Set);
  assert.equal(rs.chartOpen, false);
  assert.equal(rs.chartSpotlight, null);
  assert.ok(buildMistakePromptText(centerQ).includes(centerQ.mistakeSummary));
});
