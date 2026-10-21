import React, { useState } from 'react';
import { CONFUSABLE_PAIRS, ConfusablePair } from '../data/confusablePairs';
import { useAppState } from '../state';

export const DiscriminatorView: React.FC = () => {
  const { clusterMap } = useAppState();
  const [query, setQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const subjects = Array.from(new Set(CONFUSABLE_PAIRS.map(p => p.subject.split(' / ')[0])));

  const filtered = CONFUSABLE_PAIRS.filter(pair => {
    if (selectedSubject && !pair.subject.includes(selectedSubject)) return false;
    if (query) {
      const q = query.toLowerCase();
      const match =
        pair.title.toLowerCase().includes(q) ||
        pair.entities.some(e => e.toLowerCase().includes(q)) ||
        pair.differentiatingKey.toLowerCase().includes(q) ||
        pair.clue.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="row small">
        <a href="#/today">← Back to Today</a>
      </div>
      <h1>Confusable Pairs Discriminator</h1>
      <p className="muted small">
        Fast clinical contrast tables for high-yield lookalike conditions. Read the core discriminator
        and trap alert to prevent negative marks on 50/50 vignettes.
      </p>

      <div className="row" style={{ marginBottom: 16 }}>
        <input
          placeholder="Search pair (e.g., TTP, NMS, Crohn, Croup, Pemphigus, CAH)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
        >
          <option value="">All Subjects</option>
          {subjects.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map(pair => (
          <div key={pair.id} className="card">
            <div className="row">
              <h2 style={{ margin: 0, fontSize: 18 }}>{pair.title}</h2>
              <span className="muted small" style={{ marginLeft: 'auto' }}>
                {pair.subject}
              </span>
            </div>

            <div className="row" style={{ margin: '8px 0' }}>
              {pair.entities.map(e => (
                <span key={e} className="pill" style={{ fontWeight: 700 }}>
                  {e}
                </span>
              ))}
            </div>

            <div className="box anchor" style={{ margin: '8px 0', fontSize: 13.5 }}>
              <b>First 30-Second Clue:</b> {pair.clue}
            </div>

            <div
              className="box"
              style={{
                background: 'var(--soft)',
                borderLeft: '4px solid var(--accent)',
                fontSize: 13.5,
              }}
            >
              <b>Key Discriminator:</b> {pair.differentiatingKey}
            </div>

            <div className="tbl" style={{ marginTop: 10 }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>Feature</th>
                    {pair.entities.map((e, idx) => (
                      <th key={idx}>{e}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pair.table.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td style={{ fontWeight: 600 }}>{row.feature}</td>
                      {row.values.map((val, cIdx) => (
                        <td key={cIdx}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="box trap" style={{ margin: '10px 0 6px', fontSize: 13 }}>
              <b style={{ color: 'var(--bad)' }}>Exam Trap:</b> {pair.trapAlert}
            </div>

            {pair.clusterIds && pair.clusterIds.length > 0 && (
              <div className="row small" style={{ marginTop: 8 }}>
                <span className="muted">Related Clusters:</span>
                {pair.clusterIds.map(cid =>
                  clusterMap[cid] ? (
                    <a key={cid} className="pill" href={`#/c/${cid}`}>
                      {clusterMap[cid].title}
                    </a>
                  ) : null
                )}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="muted">No matching confusable pair found.</p>
        )}
      </div>
    </div>
  );
};
