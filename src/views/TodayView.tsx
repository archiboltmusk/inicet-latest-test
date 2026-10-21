import React from 'react';
import {
  useAppState,
  SUBJECTS,
  DAY,
  pct,
  today,
  stars,
  STATUS,
  PRESCRIBE,
  rankedClusters,
  ETYPES,
} from '../state';
import { SPRINT } from './SprintView';

interface TodayViewProps {
  onStartBlock: (mode: string, cid?: string, subject?: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({ onStartBlock }) => {
  const { state: S, clusters, stats, questionMap } = useAppState();
  const now = Date.now();

  const counts = { new: 0, weak: 0, shaky: 0, mastered: 0 };
  for (const c of clusters) {
    const st = stats[c.id];
    if (st) counts[st.status]++;
  }

  // Count due cards
  let due = 0;
  for (const [key, r] of Object.entries(S.cards)) {
    if (r.due <= now) due++;
  }
  const dToday = today();
  const usedToday = S.newLog[dToday] || 0;
  const room = Math.max(0, S.settings.newPerDay - usedToday);
  const dueTotal = due + room;

  const unres = S.errors.filter(e => !e.resolved);
  const wk = S.attempts.filter(a => now - a.ts < 7 * DAY);
  const attemptedWk = wk.filter(a => !a.skip);
  const wkAcc = attemptedWk.length ? wk.filter(a => a.ok).length / attemptedWk.length : null;
  const last = S.blocks[S.blocks.length - 1];
  const days = S.settings.examDate
    ? Math.ceil((new Date(S.settings.examDate).getTime() - now) / DAY)
    : null;

  const ranked = rankedClusters(stats, clusters);
  const fix = ranked.slice(0, 6);

  // Daily auto plan
  const steps: [number, string, string, () => void][] = [];
  if (dueTotal > 0) {
    steps.push([
      Math.min(30, 10 + Math.round(dueTotal / 4)),
      `Review ${dueTotal} due cards`,
      '#/review',
      () => {
        window.location.hash = '#/review';
      },
    ]);
  }
  steps.push([
    35,
    'Timed mixed block, 30 Q (net-mark pacing)',
    '#/block',
    () => onStartBlock('mixed'),
  ]);
  steps.push([
    25,
    'Post-block audit: label every lost mark G / R / A / T / P',
    '#/errors',
    () => {
      window.location.hash = '#/errors';
    },
  ]);
  fix.slice(0, 2).forEach(c => {
    steps.push([
      30,
      `Fix: ${c.title}`,
      `#/c/${c.id}`,
      () => {
        if (c.qn) onStartBlock('drill', c.id);
        else window.location.hash = `#/c/${c.id}`;
      },
    ]);
  });
  steps.push([
    20,
    'Image questions (INI-CET is image-heavy)',
    '#/block',
    () => onStartBlock('image'),
  ]);
  if (unres.length) {
    steps.push([
      15,
      `Mistake purge (${Math.min(unres.length, 25)} Q)`,
      '#/block',
      () => onStartBlock('purge'),
    ]);
  }
  const totalPlanMin = steps.reduce((a, x) => a + x[0], 0);
  const phase =
    days === null
      ? ''
      : days > 30
      ? 'Build phase: widen coverage, drill weak clusters.'
      : days > 10
      ? 'Consolidate phase: mocks plus error purge, no new sources.'
      : 'Final phase: volatile sheets, dated PYQs and image questions only.';

  // Today in sprint
  const sprintItem = SPRINT.find(x => x[0] === dToday);

  return (
    <div>
      {S.active && !S.active.done && (
        <>
          <div className="card" style={{ borderColor: 'var(--warn)' }}>
            <b>A block is still running.</b> The clock kept going.{' '}
            <a className="btn sm primary" href="#/block">
              Return to block
            </a>
          </div>
          <br />
        </>
      )}

      <div className="grid">
        <div className="card">
          <div className="muted small">Exam</div>
          <div className="stat">{days === null ? '—' : `${days} days`}</div>
          <div className="small muted">
            {S.settings.examDate ? (
              S.settings.examDate
            ) : (
              <a href="#/settings">Set your exam date</a>
            )}
          </div>
        </div>
        <div className="card">
          <div className="muted small">Last block (net)</div>
          <div className="stat">{last ? `${last.net.toFixed(1)} / ${last.n}` : '—'}</div>
          <div className="small muted">
            {last
              ? `${last.correct} right, ${last.wrong} wrong, ${
                  last.n - last.correct - last.wrong
                } skipped`
              : 'No block yet'}
          </div>
        </div>
        <div className="card">
          <div className="muted small">7-day accuracy</div>
          <div className="stat">{wkAcc === null ? '—' : pct(wkAcc)}</div>
          <div className="small muted">
            {wk.length} questions this week · target ≥ 82%
          </div>
        </div>
        <div className="card">
          <div className="muted small">Unresolved errors</div>
          <div className="stat">{unres.length}</div>
          <div className="small">
            {ETYPES.map(t => {
              const cnt = unres.filter(e => (e.et === 'K' ? 'G' : e.et) === t).length;
              return (
                <span key={t} className={`pill ${t.toLowerCase()}`} style={{ marginRight: 4 }}>
                  {t} {cnt}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {sprintItem && (
        <div style={{ marginTop: 16 }}>
          <h2>
            Today in the sprint{' '}
            <a className="small" href="#/sprint">
              full plan
            </a>
          </h2>
          <div
            className="card"
            style={{ borderColor: 'var(--accent)' }}
          >
            <div className="row">
              <b>{new Date(sprintItem[0] + 'T00:00').toDateString().slice(0, 10)}</b>
              <span className="muted small">
                Day {SPRINT.indexOf(sprintItem) + 1} / {SPRINT.length}
              </span>
            </div>
            <div className="small" style={{ marginTop: 6 }}>
              <b>Morning:</b> {sprintItem[1]}
            </div>
            <div className="small" style={{ marginTop: 4 }}>
              <b>Afternoon:</b> {sprintItem[3]}
            </div>
            <div className="small" style={{ marginTop: 4 }}>
              <b>Evening:</b> {sprintItem[5]}
            </div>
            <div className="small" style={{ marginTop: 4 }}>
              <b>Night (Notebook):</b> {sprintItem[6]}
            </div>
          </div>
        </div>
      )}

      <h2>
        Today's plan{' '}
        <span className="muted small">
          ~{Math.round(totalPlanMin / 6) / 10} h · auto-built from your weak spots
        </span>
      </h2>
      <div className="card small">
        {phase && <div className="muted" style={{ marginBottom: 6 }}>{phase}</div>}
        {steps.map(([m, t, h, action], idx) => (
          <div key={idx} className="row" style={{ margin: '4px 0' }}>
            <span className="pill">{m} min</span>
            <a
              href={h}
              onClick={e => {
                e.preventDefault();
                action();
              }}
            >
              {t}
            </a>
          </div>
        ))}
      </div>

      <h2>Start</h2>
      <div className="row">
        <button
          className="btn primary"
          onClick={() => onStartBlock('mixed')}
        >
          50-Q timed block (45 min)
        </button>
        {counts.new > clusters.length * 0.3 && (
          <button
            className="btn"
            onClick={() => onStartBlock('diagnostic')}
          >
            Diagnostic sweep (50 Q, 1 per untested cluster)
          </button>
        )}
        <a className="btn" href="#/review">
          Review cards ({dueTotal} due)
        </a>
        {unres.length > 0 && (
          <button
            className="btn"
            onClick={() => onStartBlock('purge')}
          >
            Mistake purge ({Math.min(unres.length, 50)} Q)
          </button>
        )}
        <button
          className="btn"
          onClick={() => onStartBlock('speed')}
        >
          Speed run (25 Q, 12.5 min)
        </button>
      </div>

      <h2>
        Fix next{' '}
        <span className="muted small">
          ranked by yield × knowledge gap × error leaks
        </span>
      </h2>
      <div className="grid">
        {fix.map(c => {
          const s = stats[c.id];
          if (!s) return null;
          const [lab, cls] = STATUS[s.status];
          return (
            <div key={c.id} className="card">
              <div className="row">
                <span className={`pill ${cls}`}>
                  {lab}
                  {s.status === 'new' ? '' : ' ' + pct(s.m)}
                </span>
                <span className="yield" title="yield">
                  {stars(c.yield)}
                </span>
                <span className="muted small">{c.subject}</span>
              </div>
              <div className="t" style={{ fontWeight: 600, margin: '6px 0' }}>
                {c.title}
              </div>
              <div className="small">{PRESCRIBE[s.leak]}</div>
              <div className="row" style={{ marginTop: 8 }}>
                <a className="btn sm" href={`#/c/${c.id}`}>
                  Open
                </a>
                {c.qn > 0 && (
                  <button
                    className="btn sm primary"
                    onClick={() => onStartBlock('drill', c.id)}
                  >
                    {s.status === 'new' ? 'Probe 5 Q' : 'Drill 10 Q'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <h2>Coverage</h2>
      <div className="card">
        <div className="row small">
          <span className="pill good">Mastered {counts.mastered}</span>
          <span className="pill warn">Shaky {counts.shaky}</span>
          <span className="pill bad">Weak {counts.weak}</span>
          <span className="pill">Untested {counts.new}</span>
          <span className="muted">
            of {clusters.length} clusters · {Object.keys(questionMap).length} MCQs
          </span>
        </div>
        <div className="tbl" style={{ marginTop: 10 }}>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Clusters</th>
                <th>Mastered</th>
                <th>Mastery</th>
              </tr>
            </thead>
            <tbody>
              {SUBJECTS.map(s => {
                const cs = clusters.filter(c => c.subject === s);
                if (!cs.length) return null;
                const m =
                  cs.reduce(
                    (x, c) => x + (stats[c.id]?.status === 'new' ? 0 : stats[c.id]?.m || 0),
                    0
                  ) / cs.length;
                const mast = cs.filter(c => stats[c.id]?.status === 'mastered').length;
                return (
                  <tr key={s}>
                    <td>
                      <a href={`#/matrix/${encodeURIComponent(s)}`}>{s}</a>
                    </td>
                    <td>{cs.length}</td>
                    <td>{mast}</td>
                    <td style={{ minWidth: 90 }}>
                      <div className="bar m">
                        <i style={{ width: pct(m) }}></i>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <h2>Daily non-negotiable routine</h2>
      <div className="card small">
        <table>
          <tbody>
            <tr>
              <td>07:30–08:30</td>
              <td>Volatile warm-up: due cards + one volatile sheet</td>
            </tr>
            <tr>
              <td>09:00–10:30</td>
              <td>Timed block: 50 mixed questions, 38/7 pacing</td>
            </tr>
            <tr>
              <td>10:45–13:00</td>
              <td>
                Post-test audit: classify every lost mark K / T / P, two-line review
              </td>
            </tr>
            <tr>
              <td>14:00–15:30</td>
              <td>Visual sweep: images on weak clusters</td>
            </tr>
            <tr>
              <td>16:00–19:00</td>
              <td>Cluster consolidation from "Fix next": read, cards, drill</td>
            </tr>
            <tr>
              <td>19:30–20:30</td>
              <td>Exercise and decompression</td>
            </tr>
            <tr>
              <td>21:00–22:30</td>
              <td>Weak-area drill (25–30 Q) + Error OS review</td>
            </tr>
            <tr>
              <td>23:00</td>
              <td>Sleep (7.5 h)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
