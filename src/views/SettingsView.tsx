import React, { useRef } from 'react';
import {
  useAppState,
  today,
  download,
  esc,
  AppState,
} from '../state';
import { md } from '../utils/render';

export const SettingsView: React.FC = () => {
  const {
    state: S,
    clusters,
    questionMap,
    stats,
    setExamDate,
    setNewCardsPerDay,
    setTheme,
    resetAllData,
    importData,
    showToast,
  } = useAppState();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateAnkiText = (scope: string): string => {
    const conv = (s: string) => md(s).replace(/\t/g, ' ');
    const cz = (s: string) =>
      esc(s)
        .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
        .replace(/\n/g, '<br>')
        .replace(/\t/g, ' ');
    const rows = [
      '#separator:tab',
      '#html:true',
      '#notetype column:1',
      '#deck column:2',
      '#tags column:5',
    ];
    const tag = (c: any) => `INICET ${c.subject.replace(/\s+/g, '_')} yield${c.yield} ${c.id}`;

    for (const c of clusters) {
      const st = stats[c.id];
      if (scope === 'weak' && !['weak', 'shaky'].includes(st?.status || '')) continue;
      if (scope === 'mistakes') break;

      const deck = `INI-CET::${c.subject}::${c.title.replace(/::/g, ':')}`;
      for (const k of c.cards) {
        rows.push(
          k.type === 'cloze'
            ? ['Cloze', deck, cz(k.text), esc(c.title), tag(c)].join('\t')
            : ['Basic', deck, conv(k.front), conv(k.back), tag(c)].join('\t')
        );
      }
    }

    if (scope !== 'weak') {
      for (const key of Object.keys(S.cards).filter(k => k.startsWith('m:'))) {
        const qid = key.slice(2);
        const q = questionMap[qid];
        if (!q) continue;
        const e = S.errors.filter(x => x.qid === q.id).pop();
        const front = `${q.q}<br><br>${q.o.map((o, k) => `${'ABCD'[k]}. ${o}`).join('<br>')}`;
        const back = `<b>${'ABCD'[q.a]}. ${q.o[q.a]}</b><br>${q.e}${
          e && e.note ? `<br><br><i>Your note:</i> ${e.note}` : ''
        }`;
        rows.push(
          [
            'Basic',
            'INI-CET::My mistakes',
            front.replace(/\t/g, ' '),
            back.replace(/\t/g, ' '),
            'INICET mistake',
          ].join('\t')
        );
      }
    }

    return rows.join('\n');
  };

  const handleExportAnki = (scope: string) => {
    download(`inicet-anki-${scope}-${today()}.txt`, generateAnkiText(scope));
  };

  const handleExportProgress = () => {
    download(
      `inicet-progress-${today()}.json`,
      JSON.stringify(S, null, 2),
      'application/json'
    );
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    file
      .text()
      .then(t => {
        const d = JSON.parse(t) as AppState;
        if (!d || d.v !== 5) throw new Error('Invalid version');
        if (importData(d)) {
          showToast('Imported');
          window.location.hash = '#/today';
        } else {
          showToast('That file is not an INI-CET Revision OS backup');
        }
      })
      .catch(() => {
        showToast('That file is not an INI-CET Revision OS backup');
      });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (window.confirm('Delete all progress in this browser?')) {
      resetAllData();
      showToast('Reset complete');
    }
  };

  // Total cards
  const totalCards = clusters.reduce((acc, c) => acc + c.cards.length, 0);

  return (
    <div>
      <h1>Settings & data</h1>
      <div className="cols3">
        <div className="card">
          <h3>Plan</h3>
          <label className="small">
            Exam date
            <br />
            <input
              type="date"
              id="sd"
              value={S.settings.examDate}
              onChange={e => {
                setExamDate(e.target.value);
                showToast('Saved');
              }}
            />
          </label>
          <br />
          <br />
          <label className="small">
            New cards per day
            <br />
            <input
              type="number"
              id="sn"
              min="0"
              max="200"
              value={S.settings.newPerDay}
              onChange={e => {
                setNewCardsPerDay(Math.max(0, +e.target.value || 0));
                showToast('Saved');
              }}
            />
          </label>
          <br />
          <br />
          <label className="small">
            Theme
            <br />
            <select
              id="sth"
              value={S.settings.theme}
              onChange={e => {
                setTheme(e.target.value);
                showToast('Saved');
              }}
            >
              <option value="">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>

        <div className="card">
          <h3>Anki export</h3>
          <p className="small">
            Tab-separated file with Basic and Cloze notes, decks per subject and cluster. Anki: File →
            Import.
          </p>
          <div className="row">
            <button className="btn" onClick={() => handleExportAnki('all')}>
              All cards
            </button>
            <button className="btn" onClick={() => handleExportAnki('weak')}>
              Weak + shaky clusters
            </button>
            <button className="btn" onClick={() => handleExportAnki('mistakes')}>
              My mistakes
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Backup</h3>
          <p className="small">
            Progress lives only in this browser. Export regularly; import on another device.
          </p>
          <div className="row">
            <button className="btn" onClick={handleExportProgress}>
              Export progress
            </button>
            <label className="btn" style={{ cursor: 'pointer' }}>
              Import
              <input
                ref={fileInputRef}
                type="file"
                id="imp"
                accept=".json"
                hidden
                onChange={handleImportFile}
              />
            </label>
            <button
              className="btn"
              onClick={handleReset}
              style={{ color: 'var(--bad)' }}
            >
              Reset all
            </button>
          </div>
        </div>
      </div>

      <p className="small muted" style={{ marginTop: 16 }}>
        {clusters.length} clusters · {Object.keys(questionMap).length} MCQs · {totalCards} cards ·
        images from Wikimedia Commons under their stated licences.
      </p>
    </div>
  );
};
