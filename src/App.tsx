import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  AppState,
  Cluster,
  Question,
  defaults,
  loadState,
  saveState,
  applyTheme,
  clusterStats,
  StateContext,
  DAY,
  weightedSample,
  shuffle,
} from './state';
import { Header } from './components/Header';
import { TodayView } from './views/TodayView';
import { SprintView } from './views/SprintView';
import { MatrixView } from './views/MatrixView';
import { ClusterView } from './views/ClusterView';
import { BlockView, MODES } from './views/BlockView';
import { ReviewView } from './views/ReviewView';
import { ErrorsView } from './views/ErrorsView';
import { SpottersView } from './views/SpottersView';
import { NotebookView } from './views/NotebookView';
import { PyqView } from './views/PyqView';
import { CoverageView } from './views/CoverageView';
import { PlaybookView } from './views/PlaybookView';
import { SettingsView } from './views/SettingsView';
import { DiscriminatorView } from './views/DiscriminatorView';
import { VolatileSheetsView } from './views/VolatileSheetsView';
import { PearlsView } from './views/PearlsView';
import { VisualVaultView } from './views/VisualVaultView';
import {
  auth,
  testConnection,
  loginWithGoogle,
  logoutUser,
  saveUserStateToCloud,
  loadUserStateFromCloud,
  createCloudBackup,
} from './firebase';

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => loadState());
  const [toastMsg, setToastMsg] = useState('');
  const [currentRoute, setCurrentRoute] = useState('today');
  const [routeArg, setRouteArg] = useState('');
  const [reviewClusterId, setReviewClusterId] = useState<string | null>(null);

  // Apply theme on load and when changed
  useEffect(() => {
    applyTheme(state.settings.theme);
  }, [state.settings.theme]);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(prev => (prev === msg ? '' : prev));
    }, 2200);
  }, []);

  const updateState = useCallback((updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  // Listen for hashchange routing
  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash.replace(/^#\/?/, '') || 'today';
      const [r, arg] = hash.split('/');
      setCurrentRoute(r || 'today');
      setRouteArg(arg ? decodeURIComponent(arg) : '');
      if (r !== 'review') {
        setReviewClusterId(null);
      }
      window.scrollTo(0, 0);
    };

    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  // Data sets from window
  const clusters: Cluster[] = useMemo(() => window.DATA_CLUSTERS || [], []);
  const questions: Question[] = useMemo(() => window.DATA_QUESTIONS || [], []);

  const clusterMap = useMemo(() => {
    const map: Record<string, Cluster> = {};
    for (const c of clusters) map[c.id] = c;
    return map;
  }, [clusters]);

  const questionMap = useMemo(() => {
    const map: Record<string, Question> = {};
    for (const q of questions) map[q.id] = q;
    return map;
  }, [questions]);

  const stats = useMemo(() => {
    return clusterStats(state, clusters);
  }, [state, clusters]);

  // Action helpers
  const markClusterRevised = useCallback((cid: string) => {
    updateState(prev => ({
      ...prev,
      read: { ...prev.read, [cid]: Date.now() },
    }));
    showToast('Marked revised');
  }, [updateState, showToast]);

  const setExamDate = useCallback((date: string) => {
    updateState(prev => ({
      ...prev,
      settings: { ...prev.settings, examDate: date },
    }));
  }, [updateState]);

  const setNewCardsPerDay = useCallback((n: number) => {
    updateState(prev => ({
      ...prev,
      settings: { ...prev.settings, newPerDay: n },
    }));
  }, [updateState]);

  const setTheme = useCallback((theme: string) => {
    updateState(prev => ({
      ...prev,
      settings: { ...prev.settings, theme },
    }));
  }, [updateState]);

  const toggleSprintItem = useCallback((date: string) => {
    updateState(prev => {
      const sprint = { ...prev.sprint };
      sprint[date] = !sprint[date];
      return { ...prev, sprint };
    });
  }, [updateState]);

  const toggleSpotterItem = useCallback((index: number | string) => {
    updateState(prev => {
      const spot = { ...prev.spot };
      spot[index] = !spot[index];
      return { ...prev, spot };
    });
  }, [updateState]);

  const addNotebookItem = useCallback((subject: string, text: string) => {
    updateState(prev => ({
      ...prev,
      nb: [
        ...prev.nb,
        { id: 'n' + Date.now(), s: subject, t: text, r: 0, struck: false },
      ],
    }));
    showToast('Added to notebook');
  }, [updateState, showToast]);

  const incrementNotebookRecall = useCallback((id: string) => {
    updateState(prev => ({
      ...prev,
      nb: prev.nb.map(n => {
        if (n.id !== id) return n;
        const newR = (n.r || 0) + 1;
        return { ...n, r: newR, struck: newR >= 3 };
      }),
    }));
  }, [updateState]);

  const resetNotebookRecall = useCallback((id: string) => {
    updateState(prev => ({
      ...prev,
      nb: prev.nb.map(n => (n.id === id ? { ...n, r: 0 } : n)),
    }));
  }, [updateState]);

  const resetAllData = useCallback(() => {
    const d = defaults();
    updateState(() => d);
  }, [updateState]);

  const importData = useCallback((imported: AppState) => {
    if (!imported || imported.v !== 5) return false;
    updateState(() => ({
      ...defaults(),
      ...imported,
      settings: { ...defaults().settings, ...(imported.settings || {}) },
    }));
    return true;
  }, [updateState]);

  // Question selection for block
  const lastCorrect = useCallback(() => {
    const m: Record<string, number> = {};
    for (const at of state.attempts) {
      if (at.ok) m[at.qid] = Math.max(m[at.qid] || 0, at.ts);
    }
    return m;
  }, [state.attempts]);

  const pickMixed = useCallback((n: number, subject?: string) => {
    const lc = lastCorrect();
    const now = Date.now();
    const pool = questions.filter(
      q => (!subject || q.s === subject) && !(lc[q.id] && now - lc[q.id] < 30 * DAY)
    );
    const w = (q: Question) => {
      const p = q.c.length
        ? Math.max(...q.c.map(cid => (stats[cid] ? stats[cid].priority : 0.2)))
        : 0.15;
      return p * (/INI/.test(q.t || '') ? 1.5 : 1);
    };
    return weightedSample(pool, w, n).map(q => q.id);
  }, [questions, stats, lastCorrect]);

  const pickDiagnostic = useCallback((n: number): string[] => {
    const byC: Record<string, string[]> = {};
    for (const q of shuffle(questions.slice())) {
      for (const cid of q.c) {
        (byC[cid] = byC[cid] || []).push(q.id);
      }
    }
    const order = clusters
      .filter(c => stats[c.id]?.status === 'new' && byC[c.id])
      .sort((a, b) => b.yield - a.yield || Math.random() - 0.5);

    const out = new Set<string>();
    for (let round = 0; out.size < n && round < 3; round++) {
      for (const c of order) {
        if (out.size >= n) break;
        const qid = byC[c.id][round];
        if (qid) out.add(qid);
      }
    }
    if (out.size < n) {
      for (const id of pickMixed(n - out.size)) {
        out.add(id);
      }
    }
    return shuffle(Array.from(out));
  }, [clusters, questions, stats, pickMixed]);

  const pickCluster = useCallback((cid: string, n: number) => {
    const lc = lastCorrect();
    const pool = questions.filter(q => q.c.includes(cid));
    pool.sort((a, b) => (lc[a.id] || 0) - (lc[b.id] || 0) || Math.random() - 0.5);
    return shuffle(pool.slice(0, n).map(q => q.id));
  }, [questions, lastCorrect]);

  const pickImages = useCallback((n: number, subject?: string) => {
    const now = Date.now();
    const lc = lastCorrect();
    const pool = questions.filter(
      q => q.i && (!subject || q.s === subject) && !(lc[q.id] && now - lc[q.id] < 30 * DAY)
    );
    const w = (q: Question) =>
      1 + Math.max(0, ...q.c.map(c => (stats[c] ? stats[c].priority : 0)));
    return pool
      .map(q => [Math.random() * w(q) * 2, q.id] as [number, string])
      .sort((a, b) => b[0] - a[0])
      .slice(0, n)
      .map(x => x[1]);
  }, [questions, stats, lastCorrect]);

  const pickPurge = useCallback((n: number): string[] => {
    const ids: string[] = Array.from(
      new Set(
        state.errors
          .filter(e => !e.resolved)
          .sort((a, b) => b.ts - a.ts)
          .map(e => e.qid)
      )
    );
    return shuffle(ids.filter(id => !!questionMap[id]).slice(0, n));
  }, [state.errors, questionMap]);

  const startBlock = useCallback((mode: string, cid?: string, subject?: string) => {
    const active = state.active;
    if (active && !active.done) {
      if (!window.confirm('A block is running. Abandon it and start a new one?')) {
        window.location.hash = '#/block';
        return;
      }
    }

    let ids: string[] = [];
    let partQids: string[][] | undefined = undefined;
    let limitSecs = MODES[mode]?.secs || 45 * 60;

    if (mode === 'gt200') {
      const all200 = pickMixed(200);
      if (all200.length < 50) {
        showToast('Not enough questions to start Grand Test');
        return;
      }
      partQids = [
        all200.slice(0, 50),
        all200.slice(50, 100),
        all200.slice(100, 150),
        all200.slice(150, 200),
      ].filter(p => p.length > 0);
      ids = partQids[0];
      limitSecs = 45 * 60;
    } else if (mode === 'multicorrect') {
      const multiPool = questions.filter(
        q =>
          /assertion|\band\b|1\s*,|both\s|which of the following are/i.test(q.q) ||
          q.o.some(opt => /^[1-4]\s*(?:,|and)/i.test(opt))
      );
      ids = shuffle(multiPool.length > 10 ? multiPool : questions).slice(0, 25).map(q => q.id);
      limitSecs = 25 * 50;
    } else if (mode === 'flush48') {
      const recentErrIds = Array.from(
        new Set(
          state.errors
            .filter(e => !e.resolved && Date.now() - e.ts <= 48 * 3600 * 1000)
            .map(e => e.qid)
        )
      );
      ids = shuffle(recentErrIds.filter(id => !!questionMap[id])).slice(0, 30);
    } else if (mode === 'flush7d') {
      const weekErrIds = Array.from(
        new Set(
          state.errors
            .filter(
              e =>
                !e.resolved &&
                Date.now() - e.ts > 48 * 3600 * 1000 &&
                Date.now() - e.ts <= 7 * DAY
            )
            .map(e => e.qid)
        )
      );
      ids = shuffle(weekErrIds.filter(id => !!questionMap[id])).slice(0, 40);
    } else if (mode === 'diagnostic') ids = pickDiagnostic(50);
    else if (mode === 'purge') ids = pickPurge(50);
    else if (mode === 'pyq26') {
      ids = shuffle(questions.filter(q => /^PYQ/.test(q.t || '')).map(q => q.id));
    } else if (mode === 'image') ids = pickImages(25, subject);
    else if (mode === 'sprint') {
      ids = questions.filter(q => q.t === 'drill').map(q => q.id);
    } else if (mode === 'drill' && cid) {
      ids = pickCluster(cid, stats[cid]?.status === 'new' ? 5 : 10);
    } else {
      ids = pickMixed(MODES[mode]?.n || 50, subject);
    }

    if (!ids.length) {
      showToast('No questions available for that selection');
      return;
    }

    const secs = limitSecs;
    updateState(prev => ({
      ...prev,
      active: {
        id: 'b' + Date.now(),
        mode,
        cid: cid || null,
        qids: ids,
        ans: {},
        elim: {},
        flags: {},
        tq: {},
        start: Date.now(),
        limit: secs,
        cur: 0,
        enter: Date.now(),
        done: false,
        part: mode === 'gt200' ? 1 : undefined,
        totalParts: mode === 'gt200' ? 4 : undefined,
        partQids: partQids,
        partScores: [],
      },
    }));

    window.location.hash = '#/block';
  }, [
    state.active,
    state.errors,
    questionMap,
    pickDiagnostic,
    pickPurge,
    questions,
    pickImages,
    pickCluster,
    stats,
    pickMixed,
    showToast,
    updateState,
  ]);

  const openReviewForCluster = useCallback((cid: string) => {
    setReviewClusterId(cid);
    window.location.hash = '#/review';
  }, []);

  const togglePearlMastered = useCallback((id: string) => {
    updateState(prev => {
      const pearls = { ...(prev.pearls || {}) };
      pearls[id] = !pearls[id];
      return { ...prev, pearls };
    });
  }, [updateState]);

  // Cloud Storage & Auth State
  const [cloudUser, setCloudUser] = useState<any>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  useEffect(() => {
    testConnection();
    const unsub = auth.onAuthStateChanged(u => {
      setCloudUser(u);
    });
    return () => unsub();
  }, []);

  const syncToCloud = useCallback(async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    setCloudSyncStatus('syncing');
    try {
      await saveUserStateToCloud(auth.currentUser.uid, state, auth.currentUser.email || undefined);
      setCloudSyncStatus('synced');
      return true;
    } catch {
      setCloudSyncStatus('error');
      return false;
    }
  }, [state]);

  const loadFromCloud = useCallback(async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    setCloudSyncStatus('syncing');
    try {
      const loaded = await loadUserStateFromCloud(auth.currentUser.uid);
      if (loaded) {
        setState(loaded);
        setCloudSyncStatus('synced');
        return true;
      }
      setCloudSyncStatus('idle');
      return false;
    } catch {
      setCloudSyncStatus('error');
      return false;
    }
  }, []);

  const loginGoogle = useCallback(async () => {
    const u = await loginWithGoogle();
    setCloudUser(u);
  }, []);

  const logoutGoogle = useCallback(async () => {
    await logoutUser();
    setCloudUser(null);
  }, []);

  const createCloudSnapshot = useCallback(async (label?: string) => {
    if (!auth.currentUser) return undefined;
    return await createCloudBackup(auth.currentUser.uid, state, label);
  }, [state]);

  const contextValue = useMemo(() => ({
    state,
    clusters,
    questions,
    clusterMap,
    questionMap,
    stats,
    toastMsg,
    showToast,
    updateState,
    markClusterRevised,
    setExamDate,
    setNewCardsPerDay,
    setTheme,
    toggleSprintItem,
    toggleSpotterItem,
    addNotebookItem,
    incrementNotebookRecall,
    resetNotebookRecall,
    togglePearlMastered,
    resetAllData,
    importData,
    cloudUser,
    cloudSyncStatus,
    syncToCloud,
    loadFromCloud,
    loginGoogle,
    logoutGoogle,
    createCloudSnapshot,
  }), [
    state,
    clusters,
    questions,
    clusterMap,
    questionMap,
    stats,
    toastMsg,
    showToast,
    updateState,
    markClusterRevised,
    setExamDate,
    setNewCardsPerDay,
    setTheme,
    toggleSprintItem,
    toggleSpotterItem,
    addNotebookItem,
    incrementNotebookRecall,
    resetNotebookRecall,
    togglePearlMastered,
    resetAllData,
    importData,
    cloudUser,
    cloudSyncStatus,
    syncToCloud,
    loadFromCloud,
    loginGoogle,
    logoutGoogle,
    createCloudSnapshot,
  ]);

  return (
    <StateContext.Provider value={contextValue}>
      <Header currentRoute={currentRoute} />
      <main id="app">
        {currentRoute === 'today' && <TodayView onStartBlock={startBlock} />}
        {currentRoute === 'sprint' && <SprintView />}
        {currentRoute === 'matrix' && <MatrixView initialSubject={routeArg} />}
        {currentRoute === 'c' && (
          <ClusterView
            clusterId={routeArg}
            onStartBlock={startBlock}
            onReviewClusterCards={openReviewForCluster}
          />
        )}
        {currentRoute === 'block' && <BlockView onStartBlock={startBlock} />}
        {currentRoute === 'review' && (
          <ReviewView
            reviewClusterId={reviewClusterId}
            onClearReviewCluster={() => setReviewClusterId(null)}
          />
        )}
        {currentRoute === 'errors' && <ErrorsView onStartBlock={startBlock} />}
        {currentRoute === 'spotters' && <SpottersView />}
        {currentRoute === 'notebook' && <NotebookView />}
        {currentRoute === 'pyq' && <PyqView />}
        {currentRoute === 'coverage' && <CoverageView />}
        {currentRoute === 'playbook' && <PlaybookView />}
        {currentRoute === 'pearls' && (
          <PearlsView initialPearlId={routeArg} onStartBlock={startBlock} />
        )}
        {currentRoute === 'vault' && <VisualVaultView />}
        {currentRoute === 'discriminators' && <DiscriminatorView />}
        {currentRoute === 'volatile' && <VolatileSheetsView />}
        {currentRoute === 'settings' && <SettingsView />}
      </main>
      <div id="toast" role="status" className={toastMsg ? 'on' : ''}>
        {toastMsg}
      </div>
    </StateContext.Provider>
  );
};
