import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { AppState } from './types';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// CRITICAL: firestoreDatabaseId must be passed as second argument
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot per skill instructions
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
    return false;
  }
}

export async function loginWithGoogle(): Promise<User> {
  const res = await signInWithPopup(auth, googleProvider);
  return res.user;
}

export async function logoutUser(): Promise<void> {
  await fbSignOut(auth);
}

export async function saveUserStateToCloud(
  userId: string,
  state: AppState,
  email?: string
): Promise<void> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const stateJson = JSON.stringify(state);
    await setDoc(
      userDocRef,
      {
        uid: userId,
        email: email || auth.currentUser?.email || '',
        lastSyncedAt: new Date().toISOString(),
        stateJson,
        totalAttempts: state.attempts?.length || 0,
        masteredPearlsCount: Object.values(state.pearls || {}).filter(Boolean).length,
        streak: state.dailyStreak || 0,
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadUserStateFromCloud(userId: string): Promise<AppState | null> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return null;
    const data = snap.data();
    if (data?.stateJson) {
      return JSON.parse(data.stateJson) as AppState;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export interface CloudBackupItem {
  id: string;
  userId: string;
  createdAt: string;
  label: string;
  stateJson: string;
  attemptsCount: number;
}

export async function createCloudBackup(
  userId: string,
  state: AppState,
  label: string = 'Auto Snapshot'
): Promise<string> {
  const backupId = `bk_${Date.now()}`;
  const path = `users/${userId}/backups/${backupId}`;
  try {
    const backupRef = doc(db, 'users', userId, 'backups', backupId);
    await setDoc(backupRef, {
      id: backupId,
      userId,
      createdAt: new Date().toISOString(),
      label: label.slice(0, 200),
      stateJson: JSON.stringify(state),
    });
    return backupId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function listCloudBackups(userId: string): Promise<CloudBackupItem[]> {
  const path = `users/${userId}/backups`;
  try {
    const colRef = collection(db, 'users', userId, 'backups');
    const snap = await getDocs(colRef);
    const items: CloudBackupItem[] = [];
    snap.forEach(d => {
      const data = d.data();
      let count = 0;
      try {
        const parsed = JSON.parse(data.stateJson);
        count = parsed.attempts?.length || 0;
      } catch {
        // ignore
      }
      items.push({
        id: data.id || d.id,
        userId: data.userId || userId,
        createdAt: data.createdAt || new Date().toISOString(),
        label: data.label || 'Saved Snapshot',
        stateJson: data.stateJson || '',
        attemptsCount: count,
      });
    });
    items.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteCloudBackup(userId: string, backupId: string): Promise<void> {
  const path = `users/${userId}/backups/${backupId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'backups', backupId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
