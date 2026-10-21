import React, { useState, useEffect } from 'react';
import { useAppState, SUBJECTS, stars, STATUS, pct } from '../state';

interface MatrixViewProps {
  initialSubject?: string;
}

export const MatrixView: React.FC<MatrixViewProps> = ({ initialSubject = '' }) => {
  const { clusters, stats } = useAppState();
  const [q, setQ] = useState('');
  const [subj, setSubj] = useState(initialSubject);
  const [y, setY] = useState('');
  const [st, setSt] = useState('');

  useEffect(() => {
    if (initialSubject) {
      setSubj(initialSubject);
    }
  }, [initialSubject]);

  const query = q.toLowerCase();
  const list = clusters.filter(c => {
    const s = stats[c.id];
    if (subj && c.subject !== subj) return false;
    if (y && String(c.yield) !== y) return false;
    if (st && s?.status !== st) return false;
    if (query) {
      const match = (c.title + ' ' + c.system + ' ' + c.keywords.join(' ')).toLowerCase();
      if (!match.includes(query)) return false;
    }
    return true;
  });

  const groups = SUBJECTS.map(s => [s, list.filter(c => c.subject === s)] as const).filter(
    g => g[1].length > 0
  );

  return (
    <div>
      <h1>PYT cluster matrix</h1>
      <div className="row">
        <input
          id="mq"
          placeholder="Search topic, sign, drug…"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ flex: 1, minWidth: 180 }}
        />
        <select
          id="ms"
          value={subj}
          onChange={e => setSubj(e.target.value)}
        >
          <option value="">All subjects</option>
          {SUBJECTS.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          id="my"
          value={y}
          onChange={e => setY(e.target.value)}
        >
          <option value="">Any yield</option>
          <option value="3">●●● core PYT</option>
          <option value="2">●●○ frequent</option>
          <option value="1">●○○ coverage</option>
        </select>
        <select
          id="mst"
          value={st}
          onChange={e => setSt(e.target.value)}
        >
          <option value="">Any status</option>
          {Object.entries(STATUS).map(([k, [l]]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div id="mx">
        {groups.length > 0 ? (
          groups.map(([s, cs]) => (
            <div key={s}>
              <div className="subj">
                <h2 style={{ margin: 0 }}>{s}</h2>
                <span className="muted small">{cs.length} clusters</span>
              </div>
              <div className="grid">
                {cs.map(c => {
                  const x = stats[c.id];
                  const [lab, cls] = x ? STATUS[x.status] : ['Untested', ''];
                  const masteryPct = x && x.status !== 'new' ? pct(x.m) : '0%';

                  return (
                    <a
                      key={c.id}
                      className="card tight tile"
                      href={`#/c/${c.id}`}
                    >
                      <div className="row small">
                        <span className="yield">{stars(c.yield)}</span>
                        <span className="muted">{c.system}</span>
                        {c.kind === 'volatile' && <span className="pill">volatile</span>}
                        {c.images.length > 0 && <span title="has images">🖼</span>}
                      </div>
                      <div className="t">{c.title}</div>
                      <div className="row small">
                        <span className={`pill ${cls}`}>{lab}</span>
                        <span className="muted">
                          {c.qn} MCQs · {c.cards.length} cards
                        </span>
                      </div>
                      <div className="bar m" style={{ marginTop: 6 }}>
                        <i style={{ width: masteryPct }}></i>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p className="muted" style={{ marginTop: 16 }}>
            No cluster matches.
          </p>
        )}
      </div>
    </div>
  );
};
