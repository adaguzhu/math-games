export const GUIDE_TITLE = '📜 1–12 Multiplication Speed Scroll';
export const GUIDE_SUBTITLE = 'Mental shortcuts to reach 100 multiplication facts in 5 minutes (1 fact every 3 seconds)!';

export const GUIDE_HTML = `
  <div class="guide-grid">
    <article class="guide-card">
      <h3>⚡ The 5-Minute 100-Fact Challenge</h3>
      <p style="margin:0; font-size:0.9rem; color:var(--ink-700);">Answering <strong>100 facts in 5 minutes</strong> means averaging <strong>20 facts per minute</strong> — about <strong>1 fact every 3 seconds</strong>!</p>
      <div class="guide-example-box">
        • 🎯 <strong>Target Pace Marker</strong>: Glides steadily across the bar at 20 facts/min.<br/>
        • 👻 <strong>Personal Best Ghost</strong>: Races at your fastest past pace so you can beat your own record.<br/>
        • 👑 <strong>Grand Prize</strong>: Solve <strong>100+ first-try facts</strong> in 5:00 to awaken <strong>Colossal King Darkstalker</strong>!
      </div>
    </article>

    <article class="guide-card">
      <h3>🌱 Fast Mental Anchors (×2, ×4, ×5, ×10)</h3>
      <p style="margin:0; font-size:0.9rem; color:var(--ink-700);">Anchor facts should take under 1 second and help unlock harder facts nearby!</p>
      <div class="guide-example-box">
        • <strong>×2 (Double)</strong>: 2 × 8 = 8 + 8 = <strong>16</strong><br/>
        • <strong>×4 (Double-Double)</strong>: 4 × 7 → double 7 (14), double again → <strong>28</strong><br/>
        • <strong>×10 (Shift Left)</strong>: 10 × 12 = <strong>120</strong><br/>
        • <strong>×5 (Half of ×10)</strong>: 5 × 8 → half of 80 = <strong>40</strong>
      </div>
    </article>

    <article class="guide-card">
      <h3>✨ The ×9 Secret (10 × n − n)</h3>
      <p style="margin:0; font-size:0.9rem; color:var(--ink-700);">Never count on fingers! Multiply by <strong>10</strong>, then subtract one group of the number.</p>
      <div class="guide-example-box">
        • <strong>9 × 7</strong> = (10 × 7) − 7 = 70 − 7 = <strong>63</strong><br/>
        • <strong>9 × 12</strong> = (10 × 12) − 12 = 120 − 12 = <strong>108</strong><br/>
        <small style="color:var(--ink-700);">Quick Check (for ×1 to ×10): The digits add up to <strong>9</strong>! (6 + 3 = 9)</small>
      </div>
    </article>

    <article class="guide-card">
      <h3>🔥 Conquering Tricky ×6, ×7, ×8 &amp; Big ×11, ×12</h3>
      <p style="margin:0; font-size:0.9rem; color:var(--ink-700);">Use <strong>×5 + extra</strong> or <strong>×10 + extra</strong>, and memorize the 5 classic boss facts cold:</p>
      <div class="guide-example-box">
        • <strong>×11</strong>: Twin digits up to ×9 (11 × 7 = <strong>77</strong>), or 10n + n (11 × 12 = 120 + 12 = <strong>132</strong>)<br/>
        • <strong>×12</strong>: 10n + 2n → 12 × 7 = 70 + 14 = <strong>84</strong><br/>
        • <strong>5 Boss Facts</strong>: 6×7 = <strong>42</strong> • 6×8 = <strong>48</strong> • 7×7 = <strong>49</strong> • 7×8 = <strong>56</strong> • 8×8 = <strong>64</strong>
      </div>
    </article>
  </div>
`;
