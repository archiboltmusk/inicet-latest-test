import React from 'react';

export const PlaybookView: React.FC = () => {
  return (
    <div>
      <h1>Exam playbook</h1>
      <div className="cols3">
        <div className="card">
          <h3>Paper format</h3>
          <ul className="pts small">
            <li>200 MCQs, 4 parts × 50, 45 min each (part locks)</li>
            <li>+1 correct, −⅓ wrong, 0 unanswered</li>
            <li>Target: attempt 192–198, accuracy ≥ 82–85%, under 22–25 wrong in total</li>
            <li>Check the current session's prospectus; AIIMS can change the scheme</li>
          </ul>
        </div>

        <div className="card">
          <h3>38/7 block rule</h3>
          <ul className="pts small">
            <li>First pass of 50 in 38 min (≈ 45 s each)</li>
            <li>
              Certain → answer and move. Down to 2 options → pick, flag, move. Zero idea or heavy
              calculation → skip within 15 s
            </li>
            <li>Last 7 min: only the flagged 2-option questions</li>
          </ul>
        </div>

        <div className="card">
          <h3>Next-best-step hierarchy</h3>
          <pre className="algo">
            {`Unstable / acute distress?
  YES → bedside stabilisation first
        (airway, needle decompression,
         pelvic binder, fluids)
  NO  → initial workup?
        YES → bedside / first-line test
              (eFAST, CXR, ECG, NCCT)
        NO (diagnosis known)
            → definitive test / surgery`}
          </pre>
          <p className="small">
            Circle the qualifier: "immediate next step" vs "most accurate test" vs "definitive management".
          </p>
        </div>

        <div className="card">
          <h3>Two-option rule (negative-mark ceiling)</h3>
          <ul className="pts small">
            <li>Re-read the stem for EXCEPT / NOT / LEAST / FALSE</li>
            <li>Absolute words (always, never, solely) are usually the false option</li>
            <li>
              If you can name why one option is the trap, take the other; if not, keep your first instinct
            </li>
            <li>Never guess blind on four unknown options</li>
          </ul>
        </div>

        <div className="card">
          <h3>Image questions: triangulate</h3>
          <ul className="pts small">
            <li>Age and sex</li>
            <li>Tempo and labs (fever, ESR, markers, electrolytes)</li>
            <li>Use the image only to exclude one of your final two</li>
          </ul>
        </div>

        <div className="card">
          <h3>Grand test audit</h3>
          <ul className="pts small">
            <li>Sit GTs 09:00–12:00 in four locked 45-min parts</li>
            <li>13:00–15:00 review wrong + flagged from parts 1–2; 16:30–18:30 parts 3–4</li>
            <li>Skip solid correct answers</li>
            <li>
              Log every lost mark here as K / T / P (paste the question via a 1-Q note if it is not in the
              bank)
            </li>
          </ul>
        </div>

        <div className="card">
          <h3>Final 30 days</h3>
          <ul className="pts small">
            <li>Mistake purge over fresh random sets</li>
            <li>Two passes of volatile sheets (staging, scores, formulas, BNS)</li>
            <li>Repeat errors become physical cards for the last 48 h</li>
            <li>Do not switch sources because of one mock percentile</li>
          </ul>
        </div>

        <div className="card">
          <h3>Source roles</h3>
          <ul className="pts small">
            <li>
              CoreBTR: the single spine; convert tables to cards, cover the right column and recall
            </li>
            <li>
              Marrow Plan B: 50-Q custom modules, exam mode only, two-line review (anchor + trap), ≤ 1.5
              min per question
            </li>
            <li>This app: diagnosis, cards, timed blocks, Error OS</li>
          </ul>
        </div>
      </div>

      <h2>Attempt strategy</h2>
      <div className="cols3">
        <div className="card">
          <h3>Expected value per question (+1 / −⅓)</h3>
          <table className="small">
            <thead>
              <tr>
                <th>Options left</th>
                <th>EV</th>
                <th>Rule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2</td>
                <td>+0.33</td>
                <td>Always attempt</td>
              </tr>
              <tr>
                <td>3</td>
                <td>+0.11</td>
                <td>Only with a clinical hunch</td>
              </tr>
              <tr>
                <td>4 (blind)</td>
                <td>≈ 0</td>
                <td>Leave it</td>
              </tr>
            </tbody>
          </table>
          <p className="small">
            Sweet spot 185–192 attempts. Below 180 leaves no margin; 198–200 usually means blind guesses.
          </p>
        </div>

        <div className="card">
          <h3>Three rounds per part</h3>
          <ul className="pts small">
            <li>Round 1: answer only ≥ 80% certain, flag 2-option questions</li>
            <li>Round 2: return to flags; commit every 2-option question</li>
            <li>
              Round 3: count attempts. Under target → convert hunch questions; never mark zero-elimination
              questions
            </li>
            <li>Max 40 s on a 50/50, then mark and move</li>
          </ul>
        </div>

        <div className="card">
          <h3>Down to two options</h3>
          <ul className="pts small">
            <li>
              Re-read only the last sentence: investigation of choice vs gold standard; initial vs
              definitive
            </li>
            <li>Symmetry rule: two options differing in one variable → answer is usually one of them</li>
            <li>
              Absolutes (always, never, pathognomonic, rules out) are usually false; hedged statements
              usually true
            </li>
            <li>The odd detail (age, sex, day post-op, steroid use) exists to kill one option</li>
            <li>Prefer the mechanism-linked adverse effect over an idiosyncratic one</li>
            <li>
              Keep the first impression unless you find a concrete missed fact (EXCEPT, pregnancy, K⁺)
            </li>
          </ul>
        </div>

        <div className="card">
          <h3>Finding real gaps after a GT</h3>
          <ul className="pts small">
            <li>Sort every miss: G true gap · R retention · A reasoning · T trap · P pacing</li>
            <li>Only G and A on a PYT are architecture gaps; one-off trivia is an acceptable loss</li>
            <li>Misses on questions with &gt; 60% peer accuracy = foundational crack; patch first</li>
            <li>&lt; 50% on a topic across 3 sittings = structural gap (flagged on the cluster)</li>
            <li>48-h patch: 15–20 min on that subtopic only → 10-Q drill → one line in the Notebook</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
