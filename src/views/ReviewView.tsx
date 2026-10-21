import React, { useState, useEffect } from 'react';
import {
  useAppState,
  today,
  DAY,
  rankedClusters,
  ET,
  esc,
  SRSCard,
} from '../state';
import { md, clozeHTML, stemHTML } from '../utils/render';

interface ReviewViewProps {
  reviewClusterId: string | null;
  onClearReviewCluster: () => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  reviewClusterId,
  onClearReviewCluster,
}) => {
  const {
    state: S,
    clusters,
    clusterMap,
    questionMap,
    stats,
    updateState,
    showToast,
  } = useAppState();

  const [revealed, setRevealed] = useState(false);

  // Keyboard shortcut listener: space to reveal, 1-4 to grade
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/INPUT|TEXTAREA|SELECT/.test((document.activeElement as HTMLElement)?.tagName || '')) {
        return;
      }
      if (e.key === ' ' && !revealed) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && /^[1-4]$/.test(e.key)) {
        const gradeMap: Record<string, number> = { '1': 0, '2': 3, '3': 4, '4': 5 };
        gradeCard(gradeMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [revealed]);

  // SM-2 definitions & queue
  const allCardDefs = () => {
    const out: Array<{ key: string; cid: string; k: any; n: number }> = [];
    for (const c of clusters) {
      c.cards.forEach((k, i) => {
        if (k.type === 'cloze') {
          const ns = [...new Set([...k.text.matchAll(/\{\{c(\d+)::/g)].map(m => +m[1]))];
          ns.forEach(n => out.push({ key: `${c.id}#${i}#${n}`, cid: c.id, k, n }));
        } else {
          out.push({ key: `${c.id}#${i}#0`, cid: c.id, k, n: 0 });
        }
      });
    }
    return out;
  };

  const getSrsQueue = () => {
    const now = Date.now();
    const defs = allCardDefs();
    const d = today();

    const due: string[] = [];
    for (const [key, r] of Object.entries(S.cards)) {
      if (r.due <= now && (!reviewClusterId || key.startsWith(reviewClusterId + '#'))) {
        due.push(key);
      }
    }
    due.sort((a, b) => (S.cards[a]?.due || 0) - (S.cards[b]?.due || 0));

    const used = S.newLog[d] || 0;
    const room = Math.max(0, S.settings.newPerDay - used);
    let fresh: string[] = [];

    if (reviewClusterId) {
      fresh = defs
        .filter(x => x.cid === reviewClusterId && !S.cards[x.key])
        .map(x => x.key);
    } else if (room > 0) {
      const ranked = rankedClusters(stats, clusters);
      const rankMap = Object.fromEntries(ranked.map((c, i) => [c.id, i]));
      fresh = defs
        .filter(x => !S.cards[x.key])
        .sort((a, b) => (rankMap[a.cid] ?? 9999) - (rankMap[b.cid] ?? 9999))
        .slice(0, room)
        .map(x => x.key);
    }

    return [...due, ...fresh];
  };

  const queue = getSrsQueue();

  const getCardFace = (key: string) => {
    if (key.startsWith('m:')) {
      const qid = key.slice(2);
      const q = questionMap[qid];
      if (!q) return null;
      const e = S.errors.filter(x => x.qid === q.id).pop();
      const optionsHtml = q.o.map((o, k) => `${'ABCD'[k]}. ${esc(o)}`).join('<br>');
      const qImgHtml = q.i
        ? `<figure class="qimg"><img src="${esc(q.i.src)}" alt="Question image"><figcaption class="credit">${esc(q.i.credit)} · ${esc(q.i.lic)}</figcaption></figure>`
        : '';

      return {
        title: 'Your mistake' + (e ? ' · ' + (ET[e.et] || e.et) : ''),
        cid: q.c[0],
        front: `${stemHTML(q.q)}${qImgHtml}<br><br>${optionsHtml}`,
        back: `<b>${'ABCD'[q.a]}. ${esc(q.o[q.a])}</b><br>${esc(q.e)}${
          e && e.note ? `<br><br><i>Your note:</i> ${esc(e.note)}` : ''
        }`,
      };
    }

    const [cid, iStr, nStr] = key.split('#');
    const c = clusterMap[cid];
    if (!c) return null;
    const k = c.cards[+iStr];
    if (!k) return null;

    return k.type === 'cloze'
      ? {
          title: c.title,
          cid,
          front: clozeHTML(k.text, +nStr, false),
          back: clozeHTML(k.text, +nStr, true),
        }
      : {
          title: c.title,
          cid,
          front: md(k.front),
          back: md(k.back),
        };
  };

  const currentKey = queue[0];
  const cardFace = currentKey ? getCardFace(currentKey) : null;
  const isNewCard = currentKey ? !S.cards[currentKey] : false;

  const gradeCard = (g: number) => {
    if (!currentKey) return;
    updateState(prev => {
      const now = Date.now();
      const cards = { ...prev.cards };
      const r: SRSCard = cards[currentKey] || {
        ef: 2.5,
        iv: 0,
        due: 0,
        reps: 0,
        lapses: 0,
      };

      const newLog = { ...prev.newLog };
      if (!cards[currentKey] && !currentKey.startsWith('m:')) {
        const d = today();
        newLog[d] = (newLog[d] || 0) + 1;
      }

      if (g === 0) {
        r.reps = 0;
        r.lapses++;
        r.iv = 0;
        r.due = now + 10 * 60e3; // 10 minutes
      } else {
        r.reps++;
        r.iv =
          r.reps === 1
            ? g === 5
              ? 3
              : 1
            : r.reps === 2
            ? g === 3
              ? 3
              : 6
            : Math.round(r.iv * r.ef * (g === 3 ? 0.8 : g === 5 ? 1.3 : 1));
        r.ef = Math.max(1.3, r.ef + (0.1 - (5 - g) * (0.08 + (5 - g) * 0.02)));
        r.due = now + r.iv * DAY;
      }
      r.last = now;
      r.lastGrade = g;

      cards[currentKey] = r;
      return { ...prev, cards, newLog };
    });

    setRevealed(false);
  };

  if (!queue.length || !cardFace) {
    return (
      <div>
        <h1>Review</h1>
        <div className="card">
          <p>
            Nothing due{reviewClusterId ? ' for this cluster' : ''}. {S.settings.newPerDay} new cards
            per day are drawn from your highest-priority clusters.
          </p>
          <div className="row">
            {reviewClusterId && (
              <button className="btn" onClick={onClearReviewCluster}>
                Back to all cards
              </button>
            )}
            <a className="btn" href="#/settings">
              Export to Anki
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>
        Review{' '}
        <span className="muted small">
          {queue.length} left
          {reviewClusterId && clusterMap[reviewClusterId]
            ? ' · ' + clusterMap[reviewClusterId].title
            : ''}
        </span>
      </h1>

      <div className="card srs-card">
        <div className="row small muted">
          <span>{cardFace.title}</span>
          {isNewCard && <span className="pill">new</span>}
          {cardFace.cid && clusterMap[cardFace.cid] && (
            <a href={`#/c/${cardFace.cid}`} style={{ marginLeft: 'auto' }}>
              Open cluster
            </a>
          )}
        </div>

        <div
          className="srs-face"
          style={{ marginTop: 8 }}
          dangerouslySetInnerHTML={{ __html: cardFace.front }}
        />

        {revealed && (
          <div
            className="srs-face"
            style={{
              borderTop: '1px dashed var(--line)',
              marginTop: 10,
              paddingTop: 10,
            }}
            dangerouslySetInnerHTML={{ __html: cardFace.back }}
          />
        )}

        {!revealed ? (
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary" onClick={() => setRevealed(true)}>
              Show answer <kbd>space</kbd>
            </button>
          </div>
        ) : (
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => gradeCard(0)}>
              Again <kbd>1</kbd>
            </button>
            <button className="btn" onClick={() => gradeCard(3)}>
              Hard <kbd>2</kbd>
            </button>
            <button className="btn primary" onClick={() => gradeCard(4)}>
              Good <kbd>3</kbd>
            </button>
            <button className="btn" onClick={() => gradeCard(5)}>
              Easy <kbd>4</kbd>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
