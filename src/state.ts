import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Cluster, Question, ClusterStat } from './types';
export * from './types';

export const SUBJECTS = [
  'Medicine', 'Surgery', 'OBGY', 'Pediatrics', 'Ophthalmology', 'ENT',
  'Orthopedics', 'Psychiatry', 'Dermatology', 'Anesthesia', 'Radiology',
  'Pathology', 'Pharmacology', 'Microbiology', 'Forensic Medicine',
  'Community Medicine', 'Anatomy', 'Physiology', 'Biochemistry'
];

export const DAY = 864e5;
export const YW: Record<number, number> = { 3: 1, 2: 0.6, 1: 0.3 };
export const ET: Record<string, string> = {
  G: 'True gap (never learned)',
  R: 'Retention failure (learned, blanked)',
  A: 'Reasoning defect (misapplied)',
  T: 'Trap / misread qualifier',
  P: 'Pacing / fatigue'
};
export const EW: Record<string, number> = { G: 1, A: 1, R: 0.7, T: 0.5, P: 0.3, K: 1 };
export const ETYPES = ['G', 'R', 'A', 'T', 'P'] as const;
export const KEY = 'inicet-os-v5';

export const STATUS: Record<string, [string, string]> = {
  new: ['Untested', ''],
  weak: ['Weak', 'bad'],
  shaky: ['Shaky', 'warn'],
  mastered: ['Mastered', 'good']
};

export const PRESCRIBE: Record<string, string> = {
  new: 'Untested. Take a 5-question probe first so the plan knows where you stand.',
  G: 'True gap on a PYT. 48-hour patch: 15–20 min on just this subtopic (anchor, algorithm, tables), drill 10 MCQs, write the discriminator into your 20th Notebook.',
  R: 'Retention failure. No re-reading: run this cluster\'s cards today and again in 2 days.',
  A: 'Reasoning defect. Re-read the algorithm and trap sheet, then drill 10 MCQs naming "initial vs definitive / IOC vs gold standard" before each answer.',
  T: 'Trap leak. Read the trap sheet; in the drill, name the qualifier (EXCEPT, initial vs definitive) before answering.',
  P: 'Pacing leak. You know it but ran out of time. Do a 25-question speed run at 30 s per question.',
};

export function defaults(): AppState {
  return {
    v: 5,
    settings: { examDate: '2026-11-01', newPerDay: 40, theme: '' },
    attempts: [],
    errors: [],
    cards: {},
    blocks: [],
    read: {},
    newLog: {},
    active: null,
    sprint: {},
    spot: {},
    nb: [],
    pearls: {}
  };
}

export function loadState(): AppState {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    const d = defaults();
    return {
      ...d,
      ...raw,
      settings: { ...d.settings, ...(raw.settings || {}) },
      sprint: raw.sprint || {},
      spot: raw.spot || {},
      nb: raw.nb || []
    };
  } catch (e) {
    return defaults();
  }
}

export function saveState(s: AppState): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    return true;
  } catch (e) {
    return false;
  }
}

/* Helpers */
export const esc = (s: any) =>
  String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] || ch));

export const pct = (x: number) => Math.round(x * 100) + '%';
export const today = () => new Date().toISOString().slice(0, 10);
export const fmtT = (s: number) => {
  s = Math.max(0, Math.round(s));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
};
export const stars = (y: number) => '●'.repeat(y) + '○'.repeat(3 - y);

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function weightedSample<T>(items: T[], weightOf: (x: T) => number, n: number): T[] {
  const pool = items.map(x => ({ x, k: Math.pow(Math.random(), 1 / Math.max(weightOf(x), 1e-6)) }));
  return pool.sort((a, b) => b.k - a.k).slice(0, n).map(p => p.x);
}

export function download(name: string, text: string, type = 'text/plain') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* Diagnosis engine */
export function clusterStats(S: AppState, clusters: Cluster[]): Record<string, ClusterStat> {
  const now = Date.now();
  const st: Record<string, ClusterStat> = {};
  for (const c of clusters) {
    st[c.id] = {
      a: 1,
      b: 1,
      n: 0,
      days: new Set<number>(),
      G: 0,
      R: 0,
      A: 0,
      T: 0,
      P: 0,
      last: 0,
      seen: 0,
      right: 0,
      recent: [],
      m: 0,
      status: 'new',
      errs: 0,
      leak: 'new',
      structural: false,
      priority: 0
    };
  }

  for (const at of S.attempts) {
    const w = Math.pow(0.5, (now - at.ts) / (21 * DAY));
    for (const cid of at.c || []) {
      const s = st[cid];
      if (!s) continue;
      if (at.ok) {
        s.a += w;
        s.right++;
      } else if (at.skip) {
        s.b += 0.3 * w;
      } else {
        s.b += w * (EW[at.et || 'G'] ?? 1);
      }
      if (!at.skip) s.recent.push(at.ok ? 1 : 0);
      s.n += w;
      s.seen++;
      s.days.add(Math.floor(at.ts / DAY));
      s.last = Math.max(s.last, at.ts);
    }
  }

  for (const [k, r] of Object.entries(S.cards)) {
    if (k.startsWith('m:') || (!r.reps && !r.lapses)) continue;
    const cid = k.split('#')[0];
    const s = st[cid];
    if (!s) continue;
    const w = 0.5 * Math.pow(0.5, (now - (r.last || now)) / (21 * DAY));
    if ((r.lastGrade ?? 0) >= 3) s.a += w;
    else s.b += w;
    s.n += w;
    if (r.last) s.days.add(Math.floor(r.last / DAY));
  }

  for (const e of S.errors) {
    if (!e.resolved) {
      for (const cid of e.c || []) {
        if (st[cid]) {
          const t = e.et === 'K' ? 'G' : e.et;
          if (t in st[cid]) (st[cid] as any)[t]++;
        }
      }
    }
  }

  for (const c of clusters) {
    const s = st[c.id];
    s.m = s.a / (s.a + s.b);
    s.status = s.n < 1.5 ? 'new' : (s.m >= 0.8 && s.n >= 6 && s.days.size >= 2) ? 'mastered' : s.m < 0.6 ? 'weak' : 'shaky';
    const gap = s.status === 'new' ? 0.5 : 1 - s.m;
    s.errs = ETYPES.reduce((x, t) => x + (s as any)[t], 0);
    s.leak = (s.errs ? ETYPES.slice().sort((x, y) => (s as any)[y] - (s as any)[x])[0] : (s.status === 'new' ? 'new' : 'G')) as any;
    const r15 = s.recent.slice(-15);
    s.structural = s.days.size >= 3 && r15.length >= 6 && r15.reduce((a, b) => a + b, 0) / r15.length < 0.5;
    s.priority = YW[c.yield] * gap * (1 + 0.15 * Math.min(s.G + s.A + s.R + 0.5 * (s.T + s.P), 5)) * (s.structural ? 1.4 : 1) * (S.read[c.id] ? 1 : 1.1);
  }

  return st;
}

export function rankedClusters(st: Record<string, ClusterStat>, clusters: Cluster[]): Cluster[] {
  return clusters.slice().sort((x, y) => (st[y.id]?.priority ?? 0) - (st[x.id]?.priority ?? 0));
}

export function applyTheme(theme: string) {
  if (theme) {
    document.documentElement.dataset.theme = theme;
  } else {
    delete document.documentElement.dataset.theme;
  }
}

/* React Context */
interface StateContextType {
  state: AppState;
  clusters: Cluster[];
  questions: Question[];
  clusterMap: Record<string, Cluster>;
  questionMap: Record<string, Question>;
  stats: Record<string, ClusterStat>;
  toastMsg: string;
  showToast: (msg: string) => void;
  updateState: (updater: (prev: AppState) => AppState) => void;
  markClusterRevised: (cid: string) => void;
  setExamDate: (date: string) => void;
  setNewCardsPerDay: (n: number) => void;
  setTheme: (theme: string) => void;
  toggleSprintItem: (date: string) => void;
  toggleSpotterItem: (index: number | string) => void;
  addNotebookItem: (subject: string, text: string) => void;
  incrementNotebookRecall: (id: string) => void;
  resetNotebookRecall: (id: string) => void;
  togglePearlMastered: (id: string) => void;
  resetAllData: () => void;
  importData: (imported: AppState) => boolean;
  cloudUser: any;
  cloudSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  syncToCloud: () => Promise<boolean>;
  loadFromCloud: () => Promise<boolean>;
  loginGoogle: () => Promise<void>;
  logoutGoogle: () => Promise<void>;
  createCloudSnapshot: (label?: string) => Promise<string | undefined>;
}

export const StateContext = createContext<StateContextType | null>(null);

export function useAppState() {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error('useAppState must be used within StateProvider');
  return ctx;
}
