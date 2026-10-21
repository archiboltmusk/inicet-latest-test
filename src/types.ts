export interface ClusterTable {
  title: string;
  head: string[];
  rows: string[][];
}

export interface ClusterTrap {
  stem: string;
  trap: string;
  fix: string;
}

export type ClusterCard =
  | { type: 'basic'; front: string; back: string }
  | { type: 'cloze'; text: string };

export interface ClusterImage {
  src: string;
  caption: string;
  page?: string;
  credit?: string;
  licence?: string;
}

export interface Cluster {
  id: string;
  title: string;
  subject: string;
  system: string;
  yield: number;
  kind: 'topic' | 'volatile' | string;
  anchor: string[];
  algorithm?: string;
  tables?: ClusterTable[];
  points: string[];
  traps: ClusterTrap[];
  cards: ClusterCard[];
  images: ClusterImage[];
  keywords: string[];
  wiki?: string[];
  verify?: string;
  pyq?: [string, string, string?][];
  pyqn?: number;
  qn: number;
  group?: string;
}

export interface QuestionImage {
  src: string;
  caption?: string;
  cap?: string;
  credit: string;
  lic: string;
  page?: string;
}

export interface Question {
  id: string;
  s: string;
  t?: string;
  q: string;
  o: string[];
  a: number;
  e: string;
  c: string[];
  w?: string[];
  i?: QuestionImage;
  x?: string;
}

export interface CoverageItem {
  s: string;
  t: string;
  c: string[];
}

export interface PYQItem {
  s: string;
  q: string;
  a: string;
  x?: string;
  y?: string | number;
  n: number;
  c?: string;
  im?: string;
  o?: string[];
  k?: number;
  e?: string;
  st?: string;
}

export interface Attempt {
  qid: string;
  c: string[];
  ok: boolean;
  skip: boolean;
  t: number;
  ts: number;
  b: string;
  i: number;
  flag: boolean;
  et: 'G' | 'R' | 'A' | 'T' | 'P' | 'K' | null;
}

export interface ErrorRecord {
  id: string;
  qid: string;
  c: string[];
  b: string;
  i: number;
  ts: number;
  note: string;
  resolved: number;
  et: 'G' | 'R' | 'A' | 'T' | 'P' | 'K';
}

export interface SRSCard {
  ef: number;
  iv: number;
  due: number;
  reps: number;
  lapses: number;
  last?: number;
  lastGrade?: number;
}

export interface BlockSummary {
  id: string;
  ts: number;
  mode: string;
  n: number;
  correct: number;
  wrong: number;
  net: number;
  used: number;
  partScores?: { part: number; correct: number; wrong: number; net: number; used: number }[];
}

export interface ActiveBlock {
  id: string;
  mode: string;
  cid: string | null;
  qids: string[];
  ans: Record<number, number | number[]>;
  elim: Record<number, number[]>;
  flags: Record<number, boolean>;
  tq: Record<number, number>;
  start: number;
  limit: number;
  cur: number;
  enter: number;
  done: boolean;
  used?: number;
  part?: number;
  totalParts?: number;
  partQids?: string[][];
  partScores?: { part: number; correct: number; wrong: number; net: number; used: number }[];
}

export interface NotebookItem {
  id: string;
  s: string;
  t: string;
  r: number;
  struck: boolean;
}

export interface AppSettings {
  examDate: string;
  newPerDay: number;
  theme: string;
}

export interface PearlMedia {
  type: 'image' | 'video' | 'animation';
  url: string;
  title: string;
  caption: string;
  credit?: string;
  badge?: string;
  simulationId?: string;
}

export interface CloudSyncInfo {
  lastSyncedAt?: string;
  autoSync?: boolean;
  userEmail?: string;
  userId?: string;
}

export interface AppState {
  v: number;
  settings: AppSettings;
  attempts: Attempt[];
  errors: ErrorRecord[];
  cards: Record<string, SRSCard>;
  blocks: BlockSummary[];
  read: Record<string, number>;
  newLog: Record<string, number>;
  active: ActiveBlock | null;
  sprint: Record<string, boolean>;
  spot: Record<string | number, boolean>;
  nb: NotebookItem[];
  pearls?: Record<string, boolean>;
  cloudSync?: CloudSyncInfo;
  dailyStreak?: number;
}

export interface ClusterStat {
  a: number;
  b: number;
  n: number;
  days: Set<number>;
  G: number;
  R: number;
  A: number;
  T: number;
  P: number;
  last: number;
  seen: number;
  right: number;
  recent: number[];
  m: number;
  status: 'new' | 'weak' | 'shaky' | 'mastered';
  errs: number;
  leak: 'new' | 'G' | 'R' | 'A' | 'T' | 'P';
  structural: boolean;
  priority: number;
}

declare global {
  interface Window {
    DATA_CLUSTERS?: Cluster[];
    DATA_QUESTIONS?: Question[];
    DATA_COVERAGE?: CoverageItem[];
    DATA_PYQ?: PYQItem[];
  }
}
