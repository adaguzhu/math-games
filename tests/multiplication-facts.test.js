import test from 'node:test';
import assert from 'node:assert/strict';
import { GAMES, getGameById } from '../src/games/registry.js';
import { MULTIPLICATION_FACTS_GAME } from '../src/games/multiplication-facts/index.js';
import {
  createSprintQuestionDeck,
  buildRoundQuestions,
  getModePairs
} from '../src/games/multiplication-facts/generators/index.js';
import {
  applySprintCompletion,
  computeSprintPaceTelemetry
} from '../src/shared/progression.js';
import {
  createDefaultFamilyState,
  encodeBackupCode,
  getGameSave,
  importBackupPayload,
  normalizeFamilyState
} from '../src/shared/storage.js';

test('Multiplication Facts is registered in grade3 with Colossal Darkstalker configuration', () => {
  assert.ok(GAMES.some(g => g.id === 'multiplication-facts'));
  assert.equal(getGameById('multiplication-facts'), MULTIPLICATION_FACTS_GAME);
  assert.equal(MULTIPLICATION_FACTS_GAME.assignedProfileId, 'grade3');
  assert.equal(MULTIPLICATION_FACTS_GAME.gradeId, 'grade3');
  assert.equal(MULTIPLICATION_FACTS_GAME.gameType, 'timed-sprint');
  assert.equal(MULTIPLICATION_FACTS_GAME.grandPrizeId, 'colossal_darkstalker');
  assert.equal(MULTIPLICATION_FACTS_GAME.grandPrizeModeId, 'mix');
  assert.equal(MULTIPLICATION_FACTS_GAME.grandPrizeGoalFacts, 100);
  assert.equal(MULTIPLICATION_FACTS_GAME.grandPrizeDurationSec, 300);

  const starter = MULTIPLICATION_FACTS_GAME.companions.find(c => c.id === 'moonwatcher_coach');
  const colossal = MULTIPLICATION_FACTS_GAME.companions.find(c => c.id === 'colossal_darkstalker');
  assert.ok(starter && starter.isColossal === false);
  assert.ok(colossal && colossal.isColossal === true);
  assert.equal(colossal.image, './assets/multiplication-facts/colossal_darkstalker.jpg');
});

test('createSprintQuestionDeck covers exact 1..12 pools and avoids consecutive identical/commuted repeats across 300+ draws', () => {
  const mixPairs = getModePairs('mix');
  assert.equal(mixPairs.length, 144);

  const mixDeck = createSprintQuestionDeck('mix');
  const firstPassKeys = new Set();
  let prev = null;
  for (let i = 0; i < 320; i++) {
    const q = mixDeck.nextQuestion();
    assert.equal(q.inputType, 'numpad');
    assert.ok(q.a >= 1 && q.a <= 12);
    assert.ok(q.b >= 1 && q.b <= 12);
    assert.equal(q.answer, q.a * q.b);
    assert.equal(q.skillKey, `mult_table_${q.a}`);
    assert.ok(q.explanationHTML.includes(`${q.a} × ${q.b} = ${q.answer}`));
    assert.ok(q.stageHTML.includes('id="slot-main"'));
    if (i < 144) firstPassKeys.add(q.dedupeKey);
    if (prev) {
      const samePair = q.a === prev.a && q.b === prev.b;
      const commutedTwin = q.a === prev.b && q.b === prev.a;
      assert.equal(samePair || commutedTwin, false, `Consecutive repeat: ${prev.a}x${prev.b} -> ${q.a}x${q.b}`);
    }
    prev = q;
  }
  assert.equal(firstPassKeys.size, 144, 'First pass of mix deck must cover all 144 unique facts');

  const expectedByMode = {
    quick_1m: p => p.a >= 1 && p.b <= 12,
    half_2m30: p => p.a >= 1 && p.b <= 12,
    tables_foundation: p => [1, 2, 5, 10].includes(p.a) || [1, 2, 5, 10].includes(p.b),
    tables_core: p => [3, 4, 6].includes(p.a) || [3, 4, 6].includes(p.b),
    tables_tricky: p => [7, 8, 9].includes(p.a) || [7, 8, 9].includes(p.b),
    tables_master: p => [11, 12].includes(p.a) || [11, 12].includes(p.b) || p.a === p.b
  };

  for (const [modeId, predicate] of Object.entries(expectedByMode)) {
    const deck = createSprintQuestionDeck(modeId);
    let last = null;
    for (let i = 0; i < 305; i++) {
      const q = deck.nextQuestion();
      assert.ok(q.a >= 1 && q.a <= 12 && q.b >= 1 && q.b <= 12);
      assert.equal(q.answer, q.a * q.b);
      assert.ok(predicate(q), `Fact ${q.a}x${q.b} out of filter for ${modeId}`);
      if (last) {
        assert.equal((q.a === last.a && q.b === last.b) || (q.a === last.b && q.b === last.a), false);
      }
      last = q;
    }
  }

  const compatRound = buildRoundQuestions('mix');
  assert.equal(compatRound.length, 10);
});

test('computeSprintPaceTelemetry computes Target Pace and Personal Best Ghost status accurately', () => {
  const ahead = computeSprintPaceTelemetry({
    correctSolved: 55,
    elapsedMs: 150000,
    durationSec: 300,
    targetFacts: 100,
    bestPacePerMin: 18,
    bestScore: 90
  });
  assert.equal(ahead.formattedClock, '2:30');
  assert.equal(ahead.targetState, 'ahead');
  assert.equal(ahead.ghostState, 'ahead');
  assert.ok(ahead.paceDelta > 0);
  assert.ok(ahead.ghostDelta > 0);

  const onPaceNoGhost = computeSprintPaceTelemetry({
    correctSolved: 50,
    elapsedMs: 150000,
    durationSec: 300,
    targetFacts: 100,
    bestPacePerMin: 0,
    bestScore: 0
  });
  assert.equal(onPaceNoGhost.targetState, 'on-pace');
  assert.equal(onPaceNoGhost.ghostState, 'no-ghost');

  const behind = computeSprintPaceTelemetry({
    correctSolved: 30,
    elapsedMs: 150000,
    durationSec: 300,
    targetFacts: 100,
    bestPacePerMin: 20,
    bestScore: 100
  });
  assert.equal(behind.targetState, 'behind');
  assert.equal(behind.ghostState, 'behind');

  const goalMet = computeSprintPaceTelemetry({
    correctSolved: 100,
    elapsedMs: 240000,
    durationSec: 300,
    targetFacts: 100,
    bestPacePerMin: 20,
    bestScore: 100
  });
  assert.equal(goalMet.targetState, 'goal-met');
});

test('applySprintCompletion unlocks Colossal Darkstalker only at 100+ facts in <= 5:00 and persists sprintStats across backups', () => {
  const family = createDefaultFamilyState(GAMES);
  const save = getGameSave(family, 'grade3', MULTIPLICATION_FACTS_GAME);
  assert.deepEqual(save.unlockedDragons, ['moonwatcher_coach']);
  assert.equal(save.sprintStats.mix.bestScore, 0);

  // 99 facts in 5:00 does NOT unlock Colossal Darkstalker
  const r99 = applySprintCompletion({
    gameSave: save,
    gameDef: MULTIPLICATION_FACTS_GAME,
    modeId: 'mix',
    correctSolved: 99,
    attempted: 101,
    durationSec: 300
  });
  assert.equal(r99.pendingUnlocks.length, 0);
  assert.equal(save.unlockedDragons.includes('colossal_darkstalker'), false);
  assert.equal(save.sprintStats.mix.bestScore, 99);
  assert.equal(save.sprintStats.mix.bestPacePerMin, 19.8);
  assert.equal(r99.isNewBestScore, true);

  // 100 facts in a 2-minute tables sprint does NOT unlock Colossal Darkstalker
  const rTables = applySprintCompletion({
    gameSave: save,
    gameDef: MULTIPLICATION_FACTS_GAME,
    modeId: 'tables_foundation',
    correctSolved: 100,
    attempted: 100,
    durationSec: 120
  });
  assert.equal(rTables.pendingUnlocks.length, 0);
  assert.equal(save.unlockedDragons.includes('colossal_darkstalker'), false);

  // 100 facts in 5:00 in 'mix' DOES unlock Colossal Darkstalker
  const r100 = applySprintCompletion({
    gameSave: save,
    gameDef: MULTIPLICATION_FACTS_GAME,
    modeId: 'mix',
    correctSolved: 104,
    attempted: 106,
    durationSec: 300,
    hundredthFactMs: 288000
  });
  assert.equal(r100.pendingUnlocks.length, 1);
  assert.equal(r100.pendingUnlocks[0].id, 'colossal_darkstalker');
  assert.equal(save.unlockedDragons.includes('colossal_darkstalker'), true);
  assert.equal(save.sprintStats.mix.bestScore, 104);
  assert.equal(save.sprintStats.mix.bestPacePerMin, 20.8);
  assert.equal(save.sprintStats.mix.bestHundredMs, 288000);

  // Backup round-trip and normalization preserve sprintStats & unlock
  const code = encodeBackupCode(family);
  const restored = importBackupPayload(code, createDefaultFamilyState(GAMES), GAMES);
  assert.equal(restored.ok, true);
  const restoredSave = getGameSave(restored.familyState, 'grade3', MULTIPLICATION_FACTS_GAME);
  assert.equal(restoredSave.sprintStats.mix.bestScore, 104);
  assert.equal(restoredSave.sprintStats.mix.bestPacePerMin, 20.8);
  assert.equal(restoredSave.sprintStats.mix.bestHundredMs, 288000);
  assert.equal(restoredSave.unlockedDragons.includes('colossal_darkstalker'), true);

  const normalized = normalizeFamilyState(restored.familyState, GAMES);
  assert.equal(getGameSave(normalized, 'grade3', MULTIPLICATION_FACTS_GAME).sprintStats.mix.bestScore, 104);
});
