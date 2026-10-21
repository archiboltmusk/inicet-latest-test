import React, { useState } from 'react';
import { useAppState, SUBJECTS, CoverageItem } from '../state';

export const CoverageView: React.FC = () => {
  const { clusters, clusterMap, stats } = useAppState();
  const coverageData: CoverageItem[] = window.DATA_COVERAGE || [];

  const [subj, setSubj] = useState('');
  const [gapFilter, setGapFilter] = useState('');

  const subs = SUBJECTS.filter(s => coverageData.some(o => o.s === s));
  const bySubject: Record<string, [number, number]> = {};
  coverageData.forEach(o => {
    if (!bySubject[o.s]) bySubject[o.s] = [0, 0];
    bySubject[o.s][o.c.length ? 0 : 1]++;
  });

  const filtered = coverageData.filter(o => {
    if (subj && o.s !== subj) return false;
    if (gapFilter !== '') {
      const isGap = o.c.length === 0;
      if (gapFilter === '1' && !isGap) return false;
      if (gapFilter === '0' && isGap) return false;
    }
    return true;
  });

  const tot = coverageData.length;
  const mapped = coverageData.filter(o => o.c.length > 0).length;

  const getMastery = (o: CoverageItem) => {
    if (!o.c.length) return -2;
    const values = o.c.map(id => {
      const s = stats[id];
      return s && s.status !== 'new' ? s.m : -1;
    });
    return Math.max(...values);
  };

  return (
    <div>
      <h1>Chapter coverage</h1>
      <p className="muted small">
        Every chapter topic in the Marrow World of Revision notes (names only) matched against our{' '}
        {clusters.length} clusters. {mapped} of {tot} topics are covered; the rest are gaps, to be filled
        in order of exam yield.
      </p>

      <div className="row">
        <select
          id="cs"
          value={subj}
          onChange={e => setSubj(e.target.value)}
        >
          <option value="">All subjects</option>
          {subs.map(s => {
            const counts = bySubject[s] || [0, 0];
            return (
              <option key={s} value={s}>
                {s} ({counts[0]}/{counts[0] + counts[1]})
              </option>
            );
          })}
        </select>

        <select
          id="cg"
          value={gapFilter}
          onChange={e => setGapFilter(e.target.value)}
        >
          <option value="">Covered + gaps</option>
          <option value="1">Gaps only</option>
          <option value="0">Covered only</option>
        </select>
      </div>

      <div className="list small" style={{ marginTop: 10 }}>
        {filtered.length > 0 ? (
          filtered.map((o, idx) => {
            const m = getMastery(o);
            return (
              <div key={idx} className="row">
                <span className="muted" style={{ minWidth: 110 }}>
                  {o.s}
                </span>
                <span style={{ flex: 1, minWidth: 160 }}>{o.t}</span>
                {o.c.length > 0 ? (
                  <>
                    {o.c.map(id =>
                      clusterMap[id] ? (
                        <a
                          key={id}
                          className="pill"
                          href={`#/c/${id}`}
                        >
                          {clusterMap[id].title.slice(0, 38)}
                        </a>
                      ) : null
                    )}
                    {m >= 0 ? (
                      <span
                        className={`pill ${
                          m >= 0.8 ? 'good' : m >= 0.6 ? 'warn' : 'bad'
                        }`}
                      >
                        {Math.round(m * 100)}%
                      </span>
                    ) : (
                      <span className="pill">untested</span>
                    )}
                  </>
                ) : (
                  <span className="pill bad">gap</span>
                )}
              </div>
            );
          })
        ) : (
          <span className="muted">Nothing here.</span>
        )}
      </div>
    </div>
  );
};
