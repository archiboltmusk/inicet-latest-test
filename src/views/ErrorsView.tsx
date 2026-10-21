import React from 'react';
import { useAppState, ET, ETYPES } from '../state';

interface ErrorsViewProps {
  onStartBlock: (mode: string) => void;
}

export const ErrorsView: React.FC<ErrorsViewProps> = ({ onStartBlock }) => {
  const { state: S, clusterMap, questionMap } = useAppState();

  const unres = S.errors.filter(e => !e.resolved);
  const plugged = S.errors.filter(e => e.resolved).length;

  const fixExplanations: Record<string, string> = {
    G: 'Fix: 48-hour patch on that subtopic only, if it is a PYT. One-off trivia: accept the loss.',
    R: 'Fix: cards (mistake card added automatically), not lectures.',
    A: 'Fix: clinical case drills; name the operative verb before answering.',
    T: 'Fix: write the exact trick pattern; do not re-read the chapter.',
    P: 'Fix: speed run next morning; watch the last 10 of each block.',
  };

  const traps = S.errors.filter(e => e.et === 'T' && e.note).slice(-12).reverse();

  return (
    <div>
      <h1>Error OS</h1>
      <div className="row">
        <span className="small">
          {unres.length} unresolved · {plugged} leaks plugged (answered right later)
        </span>
        <button
          className="btn primary"
          disabled={unres.length === 0}
          onClick={() => onStartBlock('purge')}
          style={unres.length === 0 ? { pointerEvents: 'none', opacity: 0.45 } : undefined}
        >
          Mistake purge
        </button>
      </div>

      <div className="cols3" style={{ marginTop: 12 }}>
        {ETYPES.map(t => {
          const list = unres
            .filter(e => (e.et === 'K' ? 'G' : e.et) === t)
            .sort((a, b) => b.ts - a.ts);

          return (
            <div key={t} className="card">
              <h3>
                <span className={`pill ${t.toLowerCase()}`}>{t}</span> {ET[t]}{' '}
                <span className="muted">{list.length}</span>
              </h3>
              <p className="small muted">{fixExplanations[t]}</p>
              <div className="list small">
                {list.slice(0, 40).map(e => {
                  const q = questionMap[e.qid];
                  if (!q) return null;
                  const previewStem = q.q.slice(0, 140) + (q.q.length > 140 ? '…' : '');

                  return (
                    <div key={e.id}>
                      <div>{previewStem}</div>
                      <div className="muted">
                        {(e.c || []).map((cid, ci) =>
                          clusterMap[cid] ? (
                            <span key={cid}>
                              {ci > 0 && ' · '}
                              <a href={`#/c/${cid}`}>{clusterMap[cid].title}</a>
                            </span>
                          ) : null
                        ) || q.s}{' '}
                        · {new Date(e.ts).toLocaleDateString()}
                      </div>
                      {e.note && (
                        <div>
                          <i>{e.note}</i>
                        </div>
                      )}
                    </div>
                  );
                })}
                {list.length === 0 && <p className="muted">Empty.</p>}
              </div>
            </div>
          );
        })}
      </div>

      <h2>
        Your trap patterns <span className="muted small">read every Sunday</span>
      </h2>
      <div className="card small">
        {traps.length > 0 ? (
          traps.map(e => <div key={e.id}>• {e.note}</div>)
        ) : (
          <span className="muted">Notes you write on T errors collect here.</span>
        )}
      </div>
    </div>
  );
};
