import React, { useState } from 'react';
import {
  useAppState,
  stars,
  STATUS,
  PRESCRIBE,
  pct,
  ETYPES,
  esc,
} from '../state';
import { md, clozeHTML, renderFlowchart } from '../utils/render';

interface ClusterViewProps {
  clusterId: string;
  onStartBlock: (mode: string, cid?: string) => void;
  onReviewClusterCards: (cid: string) => void;
}

export const ClusterView: React.FC<ClusterViewProps> = ({
  clusterId,
  onStartBlock,
  onReviewClusterCards,
}) => {
  const { state: S, clusterMap, stats, markClusterRevised } = useAppState();
  const [showAlgoText, setShowAlgoText] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [flippedPyqs, setFlippedPyqs] = useState<Record<number, boolean>>({});

  const c = clusterMap[clusterId];
  if (!c) {
    return (
      <div>
        <p>
          Cluster not found. <a href="#/matrix">Back to matrix</a>
        </p>
      </div>
    );
  }

  const st = stats[clusterId];
  const [lab, cls] = st ? STATUS[st.status] : ['Untested', ''];
  const revisedDate = S.read[c.id];

  const toggleCard = (idx: number) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const togglePyq = (idx: number) => {
    setFlippedPyqs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div>
      <div className="row small">
        <a href={`#/matrix/${encodeURIComponent(c.subject)}`}>← {c.subject}</a>
        <span className="muted">· {c.system}</span>
      </div>
      <h1>{c.title}</h1>
      <div className="row small">
        <span className="yield">{stars(c.yield)}</span>
        <span className={`pill ${cls}`}>
          {lab}
          {st && st.status !== 'new' ? ' ' + pct(st.m) : ''}
        </span>
        {st && st.seen > 0 && (
          <span className="muted">
            {st.right}/{st.seen} correct
          </span>
        )}
        {st && st.errs > 0 && (
          <>
            {ETYPES.map(t =>
              (st as any)[t] > 0 ? (
                <span key={t} className={`pill ${t.toLowerCase()}`}>
                  {t} {(st as any)[t]}
                </span>
              ) : null
            )}
          </>
        )}
        {st && st.structural && (
          <span className="pill bad">structural gap: &lt;50% across 3+ sittings</span>
        )}
      </div>

      <div className="box" style={{ background: 'var(--soft)' }}>
        <b>Plan:</b> {st ? PRESCRIBE[st.leak] : PRESCRIBE['new']}
      </div>

      <div className="row">
        {c.qn > 0 ? (
          <button
            className="btn primary"
            onClick={() => onStartBlock('drill', c.id)}
          >
            Drill {Math.min(c.qn, st?.status === 'new' ? 5 : 10)} MCQs (45 s each)
          </button>
        ) : (
          <span className="muted small">No tagged MCQs yet for this cluster.</span>
        )}
        <button
          className="btn"
          onClick={() => onReviewClusterCards(c.id)}
        >
          Review this cluster's cards
        </button>
        <button
          className="btn"
          onClick={() => markClusterRevised(c.id)}
        >
          {revisedDate
            ? `Revised ${new Date(revisedDate).toLocaleDateString()}`
            : 'Mark revised today'}
        </button>
      </div>

      <div className="box anchor">
        <b>Diagnostic anchor (first 30 seconds)</b>
        <ul className="pts">
          {c.anchor.map((a, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: md(a) }} />
          ))}
        </ul>
      </div>

      {c.algorithm && (
        <>
          <h2>
            Algorithm{' '}
            <button
              className="btn small"
              onClick={() => setShowAlgoText(!showAlgoText)}
            >
              {showAlgoText ? 'Flowchart' : 'Text view'}
            </button>
          </h2>
          {showAlgoText ? (
            <pre className="algo">{c.algorithm}</pre>
          ) : (
            <div
              className="flowwrap"
              dangerouslySetInnerHTML={{ __html: renderFlowchart(c.algorithm) }}
            />
          )}
        </>
      )}

      {c.tables &&
        c.tables.map((t, idx) => (
          <div key={idx}>
            <h3>{t.title}</h3>
            <div className="tbl">
              <table>
                <thead>
                  <tr>
                    {t.head.map((h, hi) => (
                      <th key={hi} dangerouslySetInnerHTML={{ __html: md(h) }} />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((r, ri) => (
                    <tr key={ri}>
                      {r.map((cell, ci) => (
                        <td key={ci} dangerouslySetInnerHTML={{ __html: md(cell) }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

      <h2>High-yield points</h2>
      <ul className="pts">
        {c.points.map((p, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: md(p) }} />
        ))}
      </ul>

      <h2>Trap sheet</h2>
      {c.traps.map((t, i) => (
        <div key={i} className="box trap">
          <div>
            <b>Stem:</b> <span dangerouslySetInnerHTML={{ __html: md(t.stem) }} />
          </div>
          <div style={{ marginTop: 4 }}>
            <b style={{ color: 'var(--bad)' }}>Trap:</b>{' '}
            <span dangerouslySetInnerHTML={{ __html: md(t.trap) }} />
          </div>
          <div style={{ marginTop: 4 }}>
            <b style={{ color: 'var(--good)' }}>Correct:</b>{' '}
            <span dangerouslySetInnerHTML={{ __html: md(t.fix) }} />
          </div>
        </div>
      ))}

      {c.images && c.images.length > 0 && (
        <>
          <h2>Images</h2>
          <div className="figs">
            {c.images.map((im, i) => (
              <figure key={i}>
                <a href={im.page || '#'} target="_blank" rel="noopener noreferrer">
                  <img loading="lazy" src={im.src} alt={im.caption} />
                </a>
                <figcaption dangerouslySetInnerHTML={{ __html: md(im.caption) }} />
                <div className="credit">
                  {im.credit || 'Wikimedia Commons'} · {im.licence || 'CC BY'}
                  {im.page && (
                    <>
                      {' · '}
                      <a href={im.page} target="_blank" rel="noopener noreferrer">
                        source
                      </a>
                    </>
                  )}
                </div>
              </figure>
            ))}
          </div>
        </>
      )}

      {c.pyq && c.pyq.length > 0 && (
        <>
          <h2>
            Asked before{' '}
            <span className="muted small">
              {c.pyqn || c.pyq.length} recalled PYQ stems match this cluster; keyed answers from recall compilations
            </span>
          </h2>
          <div className="card list small">
            {c.pyq.map(([q, a, x], i) => {
              const open = !!flippedPyqs[i];
              return (
                <div
                  key={i}
                  className={`flip ${open ? 'open' : ''}`}
                  onClick={() => togglePyq(i)}
                >
                  <div>{q}</div>
                  <div className="back">
                    <b>{a}</b>
                    {x && <span className="muted"> · {x}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <h2>
        Cards <span className="muted small">tap to reveal</span>
      </h2>
      <div className="grid">
        {c.cards.map((k, idx) => {
          const open = !!flippedCards[idx];
          if (k.type === 'cloze') {
            return (
              <div
                key={idx}
                className={`card tight flip ${open ? 'open' : ''}`}
                onClick={() => toggleCard(idx)}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: clozeHTML(k.text, -1, false) }}
                />
                <div
                  className="back"
                  dangerouslySetInnerHTML={{ __html: clozeHTML(k.text, -1, true) }}
                />
              </div>
            );
          }
          return (
            <div
              key={idx}
              className={`card tight flip ${open ? 'open' : ''}`}
              onClick={() => toggleCard(idx)}
            >
              <div dangerouslySetInnerHTML={{ __html: md(k.front) }} />
              <div
                className="back"
                dangerouslySetInnerHTML={{ __html: md(k.back) }}
              />
            </div>
          );
        })}
      </div>

      <h2>Go deeper</h2>
      <ul className="pts small">
        {(c.wiki || []).map((w, i) => (
          <li key={i}>
            <a
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(w.replace(/ /g, '_'))}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia: {w.replace(/_/g, ' ')}
            </a>
          </li>
        ))}
        <li>CoreBTR {c.subject}: the matching chapter's tables (your primary spine)</li>
        <li>Marrow Plan B: {c.subject} custom module filtered to this topic, exam mode</li>
        {c.verify && <li className="muted">Guideline basis: {c.verify}</li>}
      </ul>
    </div>
  );
};
