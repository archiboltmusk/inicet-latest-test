import React, { useState, useEffect, useRef } from 'react';
import {
  useAppState,
  SUBJECTS,
  DAY,
  fmtT,
  pct,
  esc,
  shuffle,
  weightedSample,
  ET,
  ETYPES,
  ActiveBlock,
  Question,
  Attempt,
  ErrorRecord,
  BlockSummary,
} from '../state';
import { stemHTML } from '../utils/render';

export const MODES: Record<string, { label: string; n: number; secs: number }> = {
  mixed: { label: '50-Q mixed block', n: 50, secs: 45 * 60 },
  diagnostic: { label: 'Diagnostic sweep', n: 50, secs: 45 * 60 },
  speed: { label: 'Speed run', n: 25, secs: 25 * 30 },
  purge: { label: 'Mistake purge', n: 50, secs: 0 },
  drill: { label: 'Cluster drill', n: 10, secs: 0 },
  sprint: { label: 'Sprint drills', n: 50, secs: 0 },
  image: { label: 'Image questions', n: 25, secs: 25 * 45 },
  pyq26: { label: 'Dated PYQs (2022, 2026)', n: 50, secs: 0 },
};

interface BlockViewProps {
  onStartBlock: (mode: string, cid?: string, subject?: string) => void;
}

export const BlockView: React.FC<BlockViewProps> = ({ onStartBlock }) => {
  const {
    state: S,
    clusters,
    questions,
    clusterMap,
    questionMap,
    stats,
    showToast,
    updateState,
  } = useAppState();

  const [selectedSubject, setSelectedSubject] = useState('');
  const [now, setNow] = useState(Date.now());
  const timerRef = useRef<number | null>(null);

  const B = S.active;

  // Clock tick for active block
  useEffect(() => {
    if (B && !B.done && B.limit > 0) {
      timerRef.current = window.setInterval(() => {
        setNow(Date.now());
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [B?.id, B?.done, B?.limit]);

  // Keyboard navigation for active block
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/INPUT|TEXTAREA|SELECT/.test((document.activeElement as HTMLElement)?.tagName || '')) {
        return;
      }
      if (!B || B.done) return;

      if (/^[1-4]$/.test(e.key)) {
        const k = +e.key - 1;
        selectAnswer(k);
      } else if (e.key === 'ArrowRight') {
        navigateQuestion(1);
      } else if (e.key === 'ArrowLeft') {
        navigateQuestion(-1);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFlag();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [B]);

  const logQuestionTime = (active: ActiveBlock) => {
    const timeSpent = (Date.now() - active.enter) / 1000;
    active.tq[active.cur] = (active.tq[active.cur] || 0) + timeSpent;
    active.enter = Date.now();
  };

  const selectAnswer = (optionIdx: number) => {
    if (!B || B.done) return;
    updateState(prev => {
      if (!prev.active) return prev;
      const act = { ...prev.active };
      act.ans = { ...act.ans, [act.cur]: optionIdx };
      if (act.elim[act.cur]) {
        act.elim = {
          ...act.elim,
          [act.cur]: act.elim[act.cur].filter(x => x !== optionIdx),
        };
      }
      return { ...prev, active: act };
    });
  };

  const toggleEliminate = (optionIdx: number) => {
    if (!B || B.done) return;
    updateState(prev => {
      if (!prev.active) return prev;
      const act = { ...prev.active };
      const currentElim = act.elim[act.cur] || [];
      const isElim = currentElim.includes(optionIdx);
      const newElim = isElim
        ? currentElim.filter(x => x !== optionIdx)
        : [...currentElim, optionIdx];

      const newAns = { ...act.ans };
      if (newAns[act.cur] === optionIdx) {
        delete newAns[act.cur];
      }

      act.elim = { ...act.elim, [act.cur]: newElim };
      act.ans = newAns;
      return { ...prev, active: act };
    });
  };

  const clearAnswer = () => {
    if (!B || B.done) return;
    updateState(prev => {
      if (!prev.active) return prev;
      const act = { ...prev.active };
      const newAns = { ...act.ans };
      delete newAns[act.cur];
      act.ans = newAns;
      return { ...prev, active: act };
    });
  };

  const toggleFlag = () => {
    if (!B || B.done) return;
    updateState(prev => {
      if (!prev.active) return prev;
      const act = { ...prev.active };
      act.flags = { ...act.flags, [act.cur]: !act.flags[act.cur] };
      return { ...prev, active: act };
    });
  };

  const navigateQuestion = (delta: number) => {
    if (!B || B.done) return;
    updateState(prev => {
      if (!prev.active) return prev;
      const act = { ...prev.active };
      logQuestionTime(act);
      act.cur = Math.max(0, Math.min(act.qids.length - 1, act.cur + delta));
      return { ...prev, active: act };
    });
  };

  const jumpToQuestion = (idx: number) => {
    if (!B || B.done) return;
    updateState(prev => {
      if (!prev.active) return prev;
      const act = { ...prev.active };
      logQuestionTime(act);
      act.cur = idx;
      return { ...prev, active: act };
    });
  };

  const submitCurrentBlock = (auto = false) => {
    if (!B || B.done) return;
    updateState(prev => {
      if (!prev.active || prev.active.done) return prev;
      const act = { ...prev.active };
      if (!auto) logQuestionTime(act);

      const ts = Date.now();
      let correct = 0;
      let wrong = 0;
      const newAttempts: Attempt[] = [...prev.attempts];
      const newErrors: ErrorRecord[] = [...prev.errors];

      act.qids.forEach((qid, i) => {
        const q = questionMap[qid];
        if (!q) return;
        const a = act.ans[i];
        const skip = a === undefined;
        const ok = !skip && a === q.a;
        if (ok) correct++;
        else if (!skip) wrong++;

        newAttempts.push({
          qid,
          c: q.c,
          ok,
          skip,
          t: Math.round(act.tq[i] || 0),
          ts,
          b: act.id,
          i,
          flag: !!act.flags[i],
          et: null,
        });

        if (ok) {
          for (const e of newErrors) {
            if (e.qid === qid && !e.resolved) {
              e.resolved = ts;
            }
          }
        }
      });

      const used = act.limit > 0 ? Math.min(act.limit, (ts - act.start) / 1000) : (ts - act.start) / 1000;
      const newBlockSummary: BlockSummary = {
        id: act.id,
        ts,
        mode: act.mode,
        n: act.qids.length,
        correct,
        wrong,
        net: correct - wrong / 3,
        used,
      };

      act.done = true;
      act.used = used;

      return {
        ...prev,
        attempts: newAttempts,
        errors: newErrors,
        blocks: [...prev.blocks, newBlockSummary],
        active: act,
      };
    });

    if (auto) showToast('Time up: block locked');
  };

  const classifyError = (questionIndex: number, type: 'G' | 'R' | 'A' | 'T' | 'P') => {
    if (!B) return;
    updateState(prev => {
      const att = prev.attempts.find(x => x.b === B.id && x.i === questionIndex);
      if (!att) return prev;
      att.et = type;

      const q = questionMap[att.qid];
      const errors = [...prev.errors];
      let err = errors.find(x => x.b === B.id && x.i === questionIndex);
      if (!err) {
        err = {
          id: 'e' + Date.now() + questionIndex,
          qid: att.qid,
          c: q ? q.c : [],
          b: B.id,
          i: questionIndex,
          ts: Date.now(),
          note: '',
          resolved: 0,
          et: type,
        };
        errors.push(err);
      } else {
        err.et = type;
      }

      const cards = { ...prev.cards };
      if (!cards['m:' + att.qid]) {
        cards['m:' + att.qid] = {
          ef: 2.5,
          iv: 0,
          due: Date.now(),
          reps: 0,
          lapses: 0,
        };
      }

      return { ...prev, errors, cards };
    });
  };

  const updateErrorNote = (questionIndex: number, note: string) => {
    if (!B) return;
    updateState(prev => {
      const att = prev.attempts.find(x => x.b === B.id && x.i === questionIndex);
      if (!att) return prev;

      const errors = [...prev.errors];
      let err = errors.find(x => x.b === B.id && x.i === questionIndex);
      if (!err) {
        const q = questionMap[att.qid];
        const defaultType = questionIndex >= B.qids.length - 10 && (B.tq[questionIndex] || 0) < 20 ? 'P' : 'G';
        err = {
          id: 'e' + Date.now() + questionIndex,
          qid: att.qid,
          c: q ? q.c : [],
          b: B.id,
          i: questionIndex,
          ts: Date.now(),
          note,
          resolved: 0,
          et: defaultType,
        };
        errors.push(err);
      } else {
        err.note = note;
      }
      return { ...prev, errors };
    });
  };

  const closeCompletedBlock = () => {
    updateState(prev => ({ ...prev, active: null }));
    window.location.hash = '#/today';
  };

  // Render Setup if no active block
  if (!B) {
    const unres = S.errors.filter(e => !e.resolved).length;
    const datedPyqsCount = questions.filter(q => /^PYQ/.test(q.t || '')).length;

    return (
      <div>
        <h1>Timed block</h1>
        <div className="cols3">
          <div className="card">
            <h3>50-Q mixed block</h3>
            <p className="small">
              45-minute lockout like one INI-CET part. Questions are weighted toward your weakest
              high-yield clusters; anything you got right in the last 30 days is held back.
            </p>
            <div className="row">
              <select
                id="bs"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
              >
                <option value="">All subjects</option>
                {SUBJECTS.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                className="btn primary"
                onClick={() => onStartBlock('mixed', undefined, selectedSubject)}
              >
                Start
              </button>
            </div>
          </div>

          <div className="card">
            <h3>Diagnostic sweep</h3>
            <p className="small">
              One question from each untested cluster, core PYTs first. Run this until every cluster
              has data; it is how the plan finds what you lack.
            </p>
            <button className="btn" onClick={() => onStartBlock('diagnostic')}>
              Start
            </button>
          </div>

          <div className="card">
            <h3>Speed run</h3>
            <p className="small">
              25 questions in 12.5 minutes (30 s each). Makes the real 45 s pace feel slow.
            </p>
            <button className="btn" onClick={() => onStartBlock('speed')}>
              Start
            </button>
          </div>

          <div className="card">
            <h3>Dated PYQs (2022 recall + 2026)</h3>
            <p className="small">
              {datedPyqsCount} dated INI-CET questions with explanations, untimed. Also searchable
              under PYQs.
            </p>
            <button className="btn" onClick={() => onStartBlock('pyq26')}>
              Start
            </button>
          </div>

          <div className="card">
            <h3>Image questions</h3>
            <p className="small">
              25 INI-CET-style image questions (ECG, X-ray, smear, histology, clinical signs), 45 s
              each. Weak clusters first; uses the subject picker in the mixed-block card.
            </p>
            <button
              className="btn"
              onClick={() => onStartBlock('image', undefined, selectedSubject)}
            >
              Start
            </button>
          </div>

          <div className="card">
            <h3>Sprint drills</h3>
            <p className="small">
              Toxic alcohols and 50/50 vignettes, untimed, full explanations.
            </p>
            <button className="btn" onClick={() => onStartBlock('sprint')}>
              Start
            </button>
          </div>

          <div className="card">
            <h3>Mistake purge</h3>
            <p className="small">
              Re-attempt your unresolved wrong answers ({unres}). A question you get right here is
              marked as a plugged leak.
            </p>
            <button
              className="btn"
              disabled={!unres}
              onClick={() => onStartBlock('purge')}
            >
              Start
            </button>
          </div>
        </div>

        <h2>Past blocks</h2>
        {S.blocks.length > 0 ? (
          <div className="tbl">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Mode</th>
                  <th>Net</th>
                  <th>Right</th>
                  <th>Wrong</th>
                  <th>Skipped</th>
                  <th>Accuracy</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {S.blocks
                  .slice()
                  .reverse()
                  .slice(0, 30)
                  .map(b => (
                    <tr key={b.id}>
                      <td>{new Date(b.ts).toLocaleDateString()}</td>
                      <td>{MODES[b.mode]?.label || b.mode}</td>
                      <td>{b.net.toFixed(1)}</td>
                      <td>{b.correct}</td>
                      <td>{b.wrong}</td>
                      <td>{b.n - b.correct - b.wrong}</td>
                      <td>
                        {b.correct + b.wrong
                          ? pct(b.correct / (b.correct + b.wrong))
                          : '—'}
                      </td>
                      <td>{fmtT(b.used)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">None yet.</p>
        )}
      </div>
    );
  }

  // Render Result if done
  if (B.done) {
    const b = S.blocks.find(x => x.id === B.id) || {
      net: 0,
      n: B.qids.length,
      correct: 0,
      wrong: 0,
      used: B.used || 0,
    };
    const atts = S.attempts.filter(a => a.b === B.id);
    const quarters = [0, 1, 2, 3, 4].map(k => {
      const seg = atts.filter(
        a => a.i >= (k * B.qids.length) / 5 && a.i < ((k + 1) * B.qids.length) / 5
      );
      return seg.length ? `${seg.filter(a => a.ok).length}/${seg.length}` : '';
    });
    const review = atts.filter(a => !a.ok);

    return (
      <div>
        <h1>{MODES[B.mode]?.label || B.mode}: result</h1>
        <div className="grid">
          <div className="card">
            <div className="muted small">Net score</div>
            <div className="stat">
              {b.net.toFixed(2)} / {b.n}
            </div>
            <div className="small muted">+1 right, −⅓ wrong</div>
          </div>
          <div className="card">
            <div className="muted small">Accuracy on attempted</div>
            <div className="stat">
              {b.correct + b.wrong ? pct(b.correct / (b.correct + b.wrong)) : '—'}
            </div>
            <div className="small muted">
              {b.correct} right · {b.wrong} wrong · {b.n - b.correct - b.wrong} skipped
            </div>
          </div>
          <div className="card">
            <div className="muted small">Time used</div>
            <div className="stat">{fmtT(b.used)}</div>
            <div className="small muted">of {fmtT(B.limit)}</div>
          </div>
          <div className="card">
            <div className="muted small">By fifth of the block</div>
            <div className="stat small" style={{ fontSize: 16 }}>
              {quarters.join(' · ')}
            </div>
            <div className="small muted">A drop at the end = pacing/fatigue</div>
          </div>
        </div>

        <h2>
          Audit every lost mark{' '}
          <span className="muted small">{review.length} to classify</span>
        </h2>
        <p className="small muted">
          Two-line review only: the anchor phrase that should have locked it, and why the tempting option
          was wrong. Classify: <b>G</b> true gap (no clue) · <b>R</b> retention (read it, blanked on the number) ·{' '}
          <b>A</b> reasoning (knew facts, misapplied: IOC vs gold standard, initial vs definitive) ·{' '}
          <b>T</b> trap (missed EXCEPT/qualifier) · <b>P</b> pacing. Only G and A on a PYT are real knowledge gaps.
        </p>

        {review.map(a => {
          const q = questionMap[a.qid];
          if (!q) return null;
          const att = S.attempts.find(x => x.b === B.id && x.i === a.i);
          const ch = B.ans[a.i];
          const defaultEt = a.i >= B.qids.length - 10 && (a.t || 0) < 20 ? 'P' : 'G';
          const err = S.errors.find(e => e.b === B.id && e.i === a.i);
          const activeEt = err ? err.et : att?.et || defaultEt;

          return (
            <div key={a.i} className="card" style={{ margin: '10px 0' }} id={`r${a.i}`}>
              <div className="row small muted">
                <span>Q {a.i + 1}</span>
                <span>{q.s}</span>
                {q.c.map(cid =>
                  clusterMap[cid] ? (
                    <a key={cid} href={`#/c/${cid}`}>
                      {clusterMap[cid].title}
                    </a>
                  ) : null
                )}
                <span>{Math.round(a.t)} s</span>
                {a.skip && <span className="pill">skipped</span>}
              </div>

              <div
                className="stem"
                dangerouslySetInnerHTML={{ __html: stemHTML(q.q) }}
              />

              {q.i && (
                <figure className="qimg">
                  <img src={q.i.src} alt="Question image" loading="lazy" />
                  <figcaption className="credit">
                    {q.i.credit} · {q.i.lic}
                    {q.i.page && (
                      <>
                        {' · '}
                        <a href={q.i.page} target="_blank" rel="noopener noreferrer">
                          source
                        </a>
                      </>
                    )}
                  </figcaption>
                </figure>
              )}

              {q.o.map((o, k) => (
                <div key={k} className="opt">
                  <button
                    className={`o ${k === q.a ? 'right' : ''} ${
                      k === ch && k !== q.a ? 'wrong' : ''
                    }`}
                    disabled
                  >
                    <b>{'ABCD'[k]}.</b> {o}
                  </button>
                </div>
              ))}

              <div className="expl">
                {q.e}
                {q.w && (
                  <>
                    {'\n\nWhy the others are wrong:\n'}
                    {q.w
                      .map((t, k) => (t ? 'ABCD'[k] + '. ' + t : ''))
                      .filter(Boolean)
                      .join('\n')}
                  </>
                )}
                {q.i?.cap && `\n\nImage: ${q.i.cap}`}
                {q.x && `\n\nAsked: ${q.x}`}
              </div>

              {!a.skip && (
                <>
                  <div className="row">
                    <span className="seg">
                      {ETYPES.map(t => (
                        <button
                          key={t}
                          className={(err ? err.et : '') === t ? 'on' : ''}
                          onClick={() => classifyError(a.i, t)}
                          title={ET[t]}
                        >
                          {t} · {ET[t].split(' (')[0]}
                        </button>
                      ))}
                    </span>
                    {!err && <span className="small muted">suggested: {activeEt}</span>}
                  </div>
                  <textarea
                    placeholder="Anchor I missed / why the tempting option was wrong"
                    value={err ? err.note : ''}
                    onChange={e => updateErrorNote(a.i, e.target.value)}
                  />
                </>
              )}
            </div>
          );
        })}

        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn primary" onClick={closeCompletedBlock}>
            Done
          </button>
          <a className="btn" href="#/errors">
            Open Error OS
          </a>
        </div>
      </div>
    );
  }

  // Active Block Running
  const elapsed = (Date.now() - B.start) / 1000;
  if (B.limit > 0 && elapsed >= B.limit) {
    submitCurrentBlock(true);
    return null;
  }

  const q = questionMap[B.qids[B.cur]];
  const i = B.cur;
  const n = B.qids.length;
  const answeredCount = Object.keys(B.ans).length;
  const timeLeft = B.limit > 0 ? Math.max(0, B.limit - elapsed) : 0;
  const isTimeCritical = B.limit > 0 && timeLeft < ((7 * 60 * B.limit) / 2700);

  // 38/7 pacing math
  const target = B.limit > 0 ? Math.min(n, (elapsed / (B.limit * 0.844)) * n) : 0;
  const answeredKeys = Object.keys(B.ans).map(Number);
  const firstPass = answeredKeys.length ? Math.max(...answeredKeys, B.cur) + 1 : B.cur + 1;
  const behind = Math.floor(target - firstPass);

  const handleSubmit = () => {
    const un = n - answeredCount;
    if (window.confirm(`Submit block?${un > 0 ? ` ${un} unanswered.` : ''}`)) {
      submitCurrentBlock(false);
    }
  };

  if (!q) {
    return (
      <div className="card">
        <p>Question not found.</p>
        <button className="btn primary" onClick={closeCompletedBlock}>
          Close
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="qhead">
        <div>
          <b>{MODES[B.mode]?.label || B.mode}</b>{' '}
          <span className="muted small">
            {n} Q · {B.limit > 0 ? fmtT(B.limit) : 'untimed'} · +1 / −⅓
          </span>
        </div>
        <div className="row">
          {B.limit > 0 && (
            <span
              className="timer"
              style={{ color: isTimeCritical ? 'var(--warn)' : undefined }}
            >
              {fmtT(timeLeft)}
            </span>
          )}
          <button className="btn sm" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      {B.limit > 0 && (
        <>
          <div
            className="pacer"
            title="Blue = answered; orange line = 38/7 target position"
          >
            <i style={{ width: `${(answeredCount / n) * 100}%` }}></i>
            <b style={{ left: `${Math.min(100, (target / n) * 100)}%` }}></b>
          </div>
          <div className="small muted">
            {behind >= 2
              ? `Behind the 38/7 pace by ${behind} questions. Skip zero-idea questions within 15 s.`
              : 'On pace.'}
          </div>
        </>
      )}

      <div className="card" style={{ marginTop: 10 }}>
        <div className="row small muted">
          <span>
            Q {i + 1} / {n}
          </span>
          <span>{q.s}</span>
          {q.t && <span className="pill">{q.t}</span>}
          <button
            className="btn sm"
            onClick={toggleFlag}
            style={{ marginLeft: 'auto' }}
          >
            {B.flags[i] ? '⚑ Flagged' : '⚐ Flag'}
          </button>
        </div>

        <div
          className="stem"
          dangerouslySetInnerHTML={{ __html: stemHTML(q.q) }}
        />

        {q.i && (
          <figure className="qimg">
            <img src={q.i.src} alt="Question image" loading="lazy" />
            <figcaption className="credit">
              {q.i.credit} · {q.i.lic}
              {q.i.page && (
                <>
                  {' · '}
                  <a href={q.i.page} target="_blank" rel="noopener noreferrer">
                    source
                  </a>
                </>
              )}
            </figcaption>
          </figure>
        )}

        {q.o.map((o, k) => {
          const isSelected = B.ans[i] === k;
          const isEliminated = (B.elim[i] || []).includes(k);

          return (
            <div key={k} className="opt">
              <button
                className={`o ${isSelected ? 'sel' : ''} ${
                  isEliminated ? 'elim' : ''
                }`}
                onClick={() => selectAnswer(k)}
              >
                <b>{'ABCD'[k]}.</b> {o}
              </button>
              <button
                className="x"
                onClick={() => toggleEliminate(k)}
                title="Strike out"
              >
                ✕
              </button>
            </div>
          );
        })}

        <div className="row" style={{ marginTop: 10 }}>
          <button
            className="btn"
            disabled={i === 0}
            onClick={() => navigateQuestion(-1)}
          >
            ← Prev
          </button>
          <button className="btn" onClick={clearAnswer}>
            Clear
          </button>
          <button
            className="btn primary"
            onClick={() => navigateQuestion(1)}
          >
            {i === n - 1 ? 'Review palette' : 'Next →'}
          </button>
        </div>
      </div>

      <div className="palette">
        {B.qids.map((_, k) => {
          const hasAnswer = B.ans[k] !== undefined;
          const isFlagged = B.flags[k];
          const isCur = k === i;

          return (
            <button
              key={k}
              className={`${hasAnswer ? 'ans' : ''} ${
                isFlagged ? 'flg' : ''
              } ${isCur ? 'cur' : ''}`}
              onClick={() => jumpToQuestion(k)}
            >
              {k + 1}
            </button>
          );
        })}
      </div>

      <p className="small muted" style={{ marginTop: 12 }}>
        Keys: <kbd>1</kbd>–<kbd>4</kbd> answer · <kbd>F</kbd> flag · <kbd>←</kbd>/<kbd>→</kbd> move. 38/7 rule:
        first pass by 84% of the time, then review flagged 2-option questions.
      </p>
    </div>
  );
};
