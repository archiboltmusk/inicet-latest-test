import React, { useState } from 'react';
import { EASY_MARK_TOPICS, VolatileTopic } from '../data/easyMarkTopics';

export const VolatileSheetsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const subjects = Array.from(new Set(EASY_MARK_TOPICS.map(t => t.subject.split(' / ')[0])));

  const filtered = EASY_MARK_TOPICS.filter(topic => {
    if (selectedSubject && !topic.subject.includes(selectedSubject)) return false;
    if (query) {
      const q = query.toLowerCase();
      const match =
        topic.title.toLowerCase().includes(q) ||
        topic.summary.toLowerCase().includes(q) ||
        (topic.discriminatorMnemonic && topic.discriminatorMnemonic.toLowerCase().includes(q)) ||
        topic.pyqNote.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="row small">
        <a href="#/today">← Back to Today</a>
      </div>
      <h1>20 Easy-Mark Volatile Revision Sheets</h1>
      <p className="muted small">
        Pure-number criteria, cut-offs, statutory BNS sections, and classifications that decide marks in
        the final 72 hours. Review one sheet daily.
      </p>

      {/* Filter and Search Bar */}
      <div className="row" style={{ marginBottom: 16 }}>
        <input
          placeholder="Search topic (e.g. BMW, GCS, BNS, STI, Reflex, CSF, Light, Helminth)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
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

      {/* Quick Jump Bar */}
      <div
        className="row"
        style={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          paddingBottom: 8,
          marginBottom: 16,
        }}
      >
        <span className="muted small" style={{ marginRight: 4 }}>
          Jump:
        </span>
        {EASY_MARK_TOPICS.map(t => (
          <a
            key={t.id}
            href={`#topic-${t.id}`}
            className="btn sm"
            style={{ fontSize: 12, padding: '3px 8px' }}
          >
            #{t.num} {t.title.split(' ')[0]}
          </a>
        ))}
      </div>

      {/* Topic Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {filtered.map(topic => (
          <div key={topic.id} id={`topic-${topic.id}`} className="card">
            <div className="row" style={{ alignItems: 'baseline' }}>
              <span
                className="pill good"
                style={{ fontSize: 13, padding: '2px 8px', fontWeight: 700 }}
              >
                #{topic.num}
              </span>
              <h2 style={{ margin: 0, fontSize: 18 }}>{topic.title}</h2>
              <span className="muted small" style={{ marginLeft: 'auto' }}>
                {topic.subject}
              </span>
            </div>

            <p className="small" style={{ margin: '8px 0 10px', color: 'var(--muted)' }}>
              {topic.summary}
            </p>

            <div className="tbl">
              <table>
                <thead>
                  <tr>
                    {topic.tableHead.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topic.tableRows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          style={cIdx === 0 ? { fontWeight: 600, width: '25%' } : undefined}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {topic.discriminatorMnemonic && (
              <div
                className="box"
                style={{
                  background: 'var(--soft)',
                  borderLeft: '4px solid var(--accent)',
                  fontSize: 13.5,
                  margin: '10px 0 6px',
                }}
              >
                <b>Key Anchor / Mnemonic:</b> {topic.discriminatorMnemonic}
              </div>
            )}

            <div className="box trap" style={{ margin: '6px 0 2px', fontSize: 13 }}>
              <b style={{ color: 'var(--warn)' }}>Repeated INI-CET PYQ Trap:</b> {topic.pyqNote}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="muted">No matching topic found.</p>
        )}
      </div>
    </div>
  );
};
