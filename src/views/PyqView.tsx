import React, { useState, useEffect } from 'react';
import { useAppState, SUBJECTS, PYQItem } from '../state';

export const PyqView: React.FC = () => {
  const { clusterMap } = useAppState();
  const [data, setData] = useState<PYQItem[] | null>(() => window.DATA_PYQ || null);
  const [loading, setLoading] = useState<boolean>(!window.DATA_PYQ);
  const [loadError, setLoadError] = useState(false);

  const [q, setQ] = useState('');
  const [subj, setSubj] = useState('');
  const [exam, setExam] = useState('');
  const [repeat, setRepeat] = useState('');
  const [year, setYear] = useState('');
  const [limit, setLimit] = useState(40);

  useEffect(() => {
    if (window.DATA_PYQ) {
      setData(window.DATA_PYQ);
      setLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.src = '/data/pyq.js';
    script.onload = () => {
      setData(window.DATA_PYQ || []);
      setLoading(false);
    };
    script.onerror = () => {
      setLoadError(true);
      setLoading(false);
    };
    document.head.appendChild(script);
  }, []);

  if (loading) {
    return <p className="muted pad">Loading PYQs…</p>;
  }

  if (loadError || !data) {
    return <p className="pad">PYQ data failed to load.</p>;
  }

  const query = q.toLowerCase();
  const filtered = data
    .filter(o => {
      if (subj && o.s !== subj) return false;
      if (exam && !o.x?.includes(exam)) return false;
      if (repeat && o.n < +repeat) return false;
      if (year && String(o.y) !== year) return false;
      if (query) {
        const text = (o.q + ' ' + o.a + ' ' + (o.st || '')).toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    })
    .sort((a, b) => (Number(b.y) || 0) - (Number(a.y) || 0) || b.n - a.n);

  const shown = filtered.slice(0, limit);
  const availableSubjects = SUBJECTS.filter(s => data.some(o => o.s === s));

  return (
    <div>
      <h1>Previous-year questions</h1>
      <div className="row">
        <input
          id="pqs"
          placeholder="Search…"
          value={q}
          onChange={e => {
            setQ(e.target.value);
            setLimit(40);
          }}
          style={{ flex: 1, minWidth: 150 }}
        />
        <select
          id="pfs"
          value={subj}
          onChange={e => {
            setSubj(e.target.value);
            setLimit(40);
          }}
        >
          <option value="">All subjects</option>
          {availableSubjects.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          id="pfe"
          value={exam}
          onChange={e => {
            setExam(e.target.value);
            setLimit(40);
          }}
        >
          <option value="">All exams</option>
          {['INI', 'AIIMS', 'NEET'].map(x => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        <select
          id="pfn"
          value={repeat}
          onChange={e => {
            setRepeat(e.target.value);
            setLimit(40);
          }}
        >
          <option value="">Any repeats</option>
          <option value="2">Asked ≥2×</option>
          <option value="3">Asked ≥3×</option>
        </select>
        <select
          id="pfy"
          value={year}
          onChange={e => {
            setYear(e.target.value);
            setLimit(40);
          }}
        >
          <option value="">Any year</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2022">2022 (recall)</option>
        </select>
      </div>

      <div id="pq" style={{ marginTop: 12 }}>
        <p className="muted small">
          {filtered.length} questions
          {filtered.length > limit ? `, showing ${limit}` : ''}. Answer keys come from recall; verify
          anything surprising.
        </p>

        {shown.map((o, idx) => (
          <div key={idx} className="card tight" style={{ margin: '8px 0' }}>
            <div className="row small muted">
              <span>{o.s}</span>
              <span className="pill">
                {o.x || 'recall'}
                {o.y ? ' ' + o.y : ''}
              </span>
              {o.n > 1 && <span className="pill warn">asked {o.n}×</span>}
              {o.c && clusterMap[o.c] && (
                <a href={`#/c/${o.c}`}>{clusterMap[o.c].title.slice(0, 50)}</a>
              )}
            </div>

            <div style={{ margin: '6px 0' }}>{o.q}</div>

            {o.im && (
              <figure className="qimg">
                <img src={o.im} alt="Question image" loading="lazy" />
              </figure>
            )}

            {o.o ? (
              o.o.map((t, k) => (
                <div
                  key={k}
                  className="small"
                  style={
                    k === o.k
                      ? { fontWeight: 700, color: 'var(--good)' }
                      : undefined
                  }
                >
                  {'ABCD'[k]}. {t}
                </div>
              ))
            ) : (
              <div className="small">
                <b>Answer:</b> {o.a}
              </div>
            )}

            {o.e && <div className="expl small">{o.e}</div>}
          </div>
        ))}

        {filtered.length > limit && (
          <button
            className="btn"
            id="pmore"
            style={{ marginTop: 8 }}
            onClick={() => setLimit(prev => prev + 40)}
          >
            Show 40 more
          </button>
        )}
      </div>
    </div>
  );
};
