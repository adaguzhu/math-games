import { shuffle } from '../../../shared/math.js';
import { ALL_MODES_META, MIX_META } from '../modes.js';

const MODE_SHORT_TITLES = Object.fromEntries(
  ALL_MODES_META.map(m => [m.id, m.id === 'mix' ? '5-Min Challenge (1–12)' : m.shortTitle])
);

function pairMatchesFilter(modeId, a, b) {
  switch (modeId) {
    case 'tables_foundation':
      return [1, 2, 5, 10].includes(a) || [1, 2, 5, 10].includes(b);
    case 'tables_core':
      return [3, 4, 6].includes(a) || [3, 4, 6].includes(b);
    case 'tables_tricky':
      return [7, 8, 9].includes(a) || [7, 8, 9].includes(b);
    case 'tables_master':
      return [11, 12].includes(a) || [11, 12].includes(b) || a === b;
    case 'mix':
    case 'quick_1m':
    case 'half_2m30':
    default:
      return true;
  }
}

export function getModePairs(modeId) {
  const pairs = [];
  for (let a = 1; a <= 12; a++) {
    for (let b = 1; b <= 12; b++) {
      if (pairMatchesFilter(modeId, a, b)) {
        pairs.push([a, b]);
      }
    }
  }
  return pairs;
}

function isSameOrCommutedPair(p1, p2) {
  if (!p1 || !p2) return false;
  return (p1[0] === p2[0] && p1[1] === p2[1]) || (p1[0] === p2[1] && p1[1] === p2[0]);
}

function buildMultiplicationTip(a, b) {
  const prod = a * b;
  const eq = `<strong>${a} × ${b} = ${prod}</strong>`;

  if (a === 1 || b === 1) {
    const other = a === 1 ? b : a;
    return `Any number times 1 stays itself (${other}), so ${eq}!`;
  }
  if (a === 10 || b === 10) {
    const other = a === 10 ? b : a;
    return `Multiplying ${other} by 10 shifts it one place left with a 0 → ${eq}!`;
  }
  if (a === 2 || b === 2) {
    const other = a === 2 ? b : a;
    return `Times 2 just means double ${other}: ${other} + ${other} = ${prod} → ${eq}!`;
  }
  if (a === 5 || b === 5) {
    const other = a === 5 ? b : a;
    return `Times 5 is half of 10 × ${other} (half of ${10 * other} is ${prod}) → ${eq}!`;
  }
  if (a === 9 || b === 9) {
    const other = a === 9 ? b : a;
    return `Use 10 × ${other} − ${other}: ${10 * other} − ${other} = ${prod} → ${eq}!`;
  }
  if (a === 4 || b === 4) {
    const other = a === 4 ? b : a;
    return `Double-double ${other}: 2 × ${other} = ${2 * other}, and double again is ${prod} → ${eq}!`;
  }
  if (a === 11 || b === 11) {
    const other = a === 11 ? b : a;
    if (other <= 9) {
      return `Times 11 repeats the single digit ${other} twice (${prod}) → ${eq}!`;
    }
    return `Split 11 into 10 + 1: (10 × ${other}) + ${other} = ${10 * other} + ${other} = ${prod} → ${eq}!`;
  }
  if (a === 12 || b === 12) {
    const other = a === 12 ? b : a;
    return `Split 12 into 10 + 2: (10 × ${other}) + (2 × ${other}) = ${10 * other} + ${2 * other} = ${prod} → ${eq}!`;
  }
  if (a === b) {
    return `Square fact! An ${a}-by-${a} square has ${prod} tiles → ${eq}!`;
  }
  if (a === 3 || b === 3) {
    const other = a === 3 ? b : a;
    return `Double plus one more: (2 × ${other}) + ${other} = ${2 * other} + ${other} = ${prod} → ${eq}!`;
  }

  // Remaining pairs: 6, 7, 8 mixed with 6, 7, 8 (and distinct)
  return `Break ${a} into 5 + ${a - 5}: (5 × ${b}) + (${a - 5} × ${b}) = ${5 * b} + ${(a - 5) * b} = ${prod} → ${eq}!`;
}

export function createSprintQuestionDeck(modeId = 'mix') {
  const resolvedMode = MODE_SHORT_TITLES[modeId] ? modeId : MIX_META.id;
  const basePairs = getModePairs(resolvedMode);
  const topicLabel = MODE_SHORT_TITLES[resolvedMode];

  let bag = [];
  let cursor = 0;
  let lastPair = null;

  function refill() {
    bag = shuffle(basePairs);
    cursor = 0;

    if (bag.length <= 1) return;

    if (lastPair && isSameOrCommutedPair(bag[0], lastPair)) {
      const swapIdx = bag.findIndex((p, idx) => idx > 0 && !isSameOrCommutedPair(p, lastPair));
      if (swapIdx > 0) {
        const tmp = bag[0];
        bag[0] = bag[swapIdx];
        bag[swapIdx] = tmp;
      }
    }

    for (let i = 1; i < bag.length; i++) {
      if (!isSameOrCommutedPair(bag[i], bag[i - 1])) continue;
      const rightNeighbor = i + 1 < bag.length ? bag[i + 1] : null;
      let swapIdx = -1;
      for (let pass = 0; pass < 2 && swapIdx === -1; pass++) {
        const start = pass === 0 ? i + 1 : 0;
        const end = pass === 0 ? bag.length : i - 1;
        for (let j = start; j < end; j++) {
          const leftJ = j === 0 ? lastPair : bag[j - 1];
          const rightJ = j + 1 < bag.length ? bag[j + 1] : null;
          if (
            !isSameOrCommutedPair(bag[j], bag[i - 1]) &&
            !isSameOrCommutedPair(bag[j], rightNeighbor) &&
            !isSameOrCommutedPair(bag[i], leftJ) &&
            !isSameOrCommutedPair(bag[i], rightJ)
          ) {
            swapIdx = j;
            break;
          }
        }
      }
      if (swapIdx !== -1) {
        const tmp = bag[i];
        bag[i] = bag[swapIdx];
        bag[swapIdx] = tmp;
      }
    }
  }

  function nextQuestion() {
    if (cursor >= bag.length) {
      refill();
    }
    const pair = bag[cursor++];
    lastPair = pair;
    const [a, b] = pair;
    const ans = a * b;
    return {
      dedupeKey: `mult_${a}x${b}`,
      domainId: resolvedMode,
      skillKey: `mult_table_${a}`,
      skillLabel: `×${a} Multiplication Facts`,
      topicLabel,
      inputType: 'numpad',
      a,
      b,
      answer: ans,
      prompt: 'Solve as many facts as you can!',
      stageHTML: `<div class="equation-hero"><span class="eq-num">${a}</span> <span class="eq-op">×</span> <span class="eq-num">${b}</span> <span class="eq-op">=</span> <span id="slot-main" class="answer-slot active">?</span></div>`,
      promptText: `${a} × ${b} = ?`,
      correctText: String(ans),
      explanationHTML: buildMultiplicationTip(a, b)
    };
  }

  return {
    modeId: resolvedMode,
    poolSize: basePairs.length,
    nextQuestion
  };
}

export function buildRoundQuestions(modeId, count = 10) {
  const deck = createSprintQuestionDeck(modeId);
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(deck.nextQuestion());
  }
  return out;
}
