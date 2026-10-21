import React, { useState } from 'react';
import { useAppState, SUBJECTS } from '../state';

export const NotebookView: React.FC = () => {
  const {
    state: S,
    clusters,
    clusterMap,
    addNotebookItem,
    incrementNotebookRecall,
    resetNotebookRecall,
  } = useAppState();

  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [text, setText] = useState('');

  const live = (S.nb || []).filter(e => !e.struck);
  const struck = (S.nb || []).filter(e => e.struck);
  const sillies = S.errors
    .filter(e => e.note && ['T', 'A'].includes(e.et))
    .slice(-30)
    .reverse();
  const volatileClusters = clusters.filter(c => c.kind === 'volatile');

  const handleAdd = () => {
    if (!text.trim()) return;
    addNotebookItem(selectedSubject, text.trim());
    setText('');
  };

  return (
    <div>
      <h1>20th Notebook</h1>
      <p className="small muted">
        Only pure volatility: numbers, cut-offs, staging, loci, eponyms, and your repeated traps. One
        line each, arrows or tables, no sentences. Tick "recalled" when you recall an item instantly;
        three in a row strikes it out. Read it all in the last 72 hours.
      </p>

      <div className="card">
        <div className="row">
          <select
            id="nbs"
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
          >
            {SUBJECTS.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            id="nbt"
            placeholder="e.g. Carhart notch → 2 kHz (otosclerosis) | noise dip → 4 kHz"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd();
            }}
            style={{ flex: 1, minWidth: 220 }}
          />
          <button className="btn primary" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>

      <h2>
        Live <span className="muted small">{live.length}</span>
      </h2>
      <div className="card list small">
        {live.length > 0 ? (
          live.map(e => (
            <div key={e.id} className="row">
              <span className="pill">{e.s}</span>
              <span style={{ flex: 1 }}>{e.t}</span>
              <span className="muted">
                {'●'.repeat(e.r || 0)}
                {'○'.repeat(3 - (e.r || 0))}
              </span>
              <button
                className="btn sm"
                onClick={() => incrementNotebookRecall(e.id)}
              >
                recalled
              </button>
              <button
                className="btn sm"
                onClick={() => resetNotebookRecall(e.id)}
              >
                blanked
              </button>
            </div>
          ))
        ) : (
          <span className="muted">Empty. Add the facts you blanked on today.</span>
        )}
      </div>

      <h2>
        My sillies & traps{' '}
        <span className="muted small">from Error OS notes (T and A)</span>
      </h2>
      <div className="card list small">
        {sillies.length > 0 ? (
          sillies.map(e => (
            <div key={e.id}>
              {e.note}{' '}
              {e.c && e.c[0] && clusterMap[e.c[0]] && (
                <a href={`#/c/${e.c[0]}`}>{clusterMap[e.c[0]].title}</a>
              )}
            </div>
          ))
        ) : (
          <span className="muted">
            Notes you write on trap/reasoning errors collect here.
          </span>
        )}
      </div>

      <h2>
        Volatile sheets <span className="muted small">pure-number clusters</span>
      </h2>
      <div className="row">
        {volatileClusters.map(c => (
          <a key={c.id} className="btn sm" href={`#/c/${c.id}`}>
            {c.title}
          </a>
        ))}
      </div>

      {struck.length > 0 && (
        <>
          <h2>
            Struck out <span className="muted small">{struck.length}</span>
          </h2>
          <div className="card small">
            {struck.map(e => (
              <div key={e.id} style={{ textDecoration: 'line-through', opacity: 0.6 }}>
                {e.t}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
