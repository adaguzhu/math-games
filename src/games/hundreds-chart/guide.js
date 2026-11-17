import { buildChartStripHTML, buildCrossPuzzleHTML } from '../../shared/manipulatives.js';

export const GUIDE_TITLE = '📖 Cat Kid’s 100-Chart & Cross Puzzle Guide';
export const GUIDE_SUBTITLE = 'Secret detective tricks for moving UP (−10), DOWN (+10), LEFT (−1), and RIGHT (+1) across 1–100 and 1–120!';

export const GUIDE_HTML = `
  <div class="guide-grid">
    <article class="guide-card">
      <h3>🧭 The 4 Chart Directions</h3>
      <p style="margin:0; font-size:0.9rem; color:var(--ink-700);">Every row on a 100-chart has <strong>10 squares</strong>. Watch what changes in each direction from <strong>24</strong>:</p>
      <div class="guide-example-box" style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        ${buildCrossPuzzleHTML({ center: 24, givenPositions: ['top', 'left', 'center', 'right', 'bottom'] })}
        <div style="font-size:0.86rem; text-align:center;">
          • <strong>↑ UP (10 Less):</strong> Tens go down 1, ones stay <strong>4</strong> → <strong>14</strong> (<em>NOT 21!</em>)<br/>
          • <strong>↓ DOWN (10 More):</strong> Tens go up 1, ones stay <strong>4</strong> → <strong>34</strong><br/>
          • <strong>← LEFT (1 Less):</strong> 24 − 1 = <strong>23</strong> &nbsp;•&nbsp; <strong>→ RIGHT (1 More):</strong> 24 + 1 = <strong>25</strong>
        </div>
      </div>
    </article>

    <article class="guide-card">
      <h3>➕ Center-Clue Crosses</h3>
      <p style="margin:0; font-size:0.9rem; color:var(--ink-700);">When the <strong>middle number</strong> is given, work outward along the row and column:</p>
      <div class="guide-example-box" style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        ${buildCrossPuzzleHTML({ center: 24, givenPositions: ['top', 'left', 'center', 'right', 'bottom'] })}
        <div style="font-size:0.86rem; text-align:center;">
          Start at <strong>24</strong>:<br/>
          1. Sideways (±1): <strong>23</strong> (left) and <strong>25</strong> (right)<br/>
          2. Up &amp; Down (±10): <strong>14</strong> (above) and <strong>34</strong> (below)
        </div>
      </div>
    </article>

    <article class="guide-card">
      <h3>🧩 Secret Trick When the Middle Is Blank!</h3>
      <p style="margin:0; font-size:0.9rem; color:var(--ink-700);">Suppose only <strong>Right = 53</strong> and <strong>Bottom = 62</strong> are printed. Always find the <strong>Middle square FIRST</strong>!</p>
      <div class="guide-example-box" style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        ${buildCrossPuzzleHTML({ center: 52, givenPositions: ['top', 'left', 'center', 'right', 'bottom'] })}
        <div style="font-size:0.86rem; text-align:center;">
          • <strong>Step 1 (Middle):</strong> 1 left of 53 (or 10 above 62) = <strong>52</strong>!<br/>
          • <strong>Step 2 (Rest):</strong> Left is 52 − 1 = <strong>51</strong>, and Top is 52 − 10 = <strong>42</strong>!
        </div>
      </div>
    </article>

    <article class="guide-card">
      <h3>🚀 Crossing 90, 100 &amp; Up to 120</h3>
      <p style="margin:0; font-size:0.9rem; color:var(--ink-700);">The exact same +1 and +10 rules keep working past 90 and past 100!</p>
      <div class="guide-example-box" style="display:flex; flex-direction:column; align-items:center; gap:10px;">
        ${buildChartStripHTML({
          orientation: 'horizontal',
          arrowBadge: '→ Crossing 90 (+1)',
          cells: [{ val: 88 }, { val: 89 }, { val: 90 }]
        })}
        ${buildChartStripHTML({
          orientation: 'vertical',
          arrowBadge: '↓ Bridging 100 (+10)',
          cells: [{ val: 94 }, { val: 104 }, { val: 114 }],
          captionHTML: 'Ones digit stays <strong>4</strong>: 9 tens → 10 tens (<strong>104</strong>) → 11 tens (<strong>114</strong>)!'
        })}
      </div>
    </article>
  </div>
`;
