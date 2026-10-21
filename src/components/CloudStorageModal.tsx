import React, { useState, useEffect } from 'react';
import { useAppState } from '../state';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  saveUserStateToCloud,
  loadUserStateFromCloud,
  createCloudBackup,
  listCloudBackups,
  deleteCloudBackup,
  CloudBackupItem,
} from '../firebase';
import { sound } from '../utils/audio';

interface CloudStorageModalProps {
  onClose: () => void;
}

export const CloudStorageModal: React.FC<CloudStorageModalProps> = ({ onClose }) => {
  const { state, updateState, showToast } = useAppState();
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState<CloudBackupItem[]>([]);
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
      if (u) {
        loadBackupsList(u.uid);
      }
    });
    return () => unsub();
  }, []);

  const loadBackupsList = async (uid: string) => {
    try {
      const list = await listCloudBackups(uid);
      setBackups(list);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setStatusMsg('Signing in with Google...');
    try {
      const u = await loginWithGoogle();
      sound.playLevelUp();
      showToast(`Signed in as ${u.email}`);
      setStatusMsg('');
      loadBackupsList(u.uid);
    } catch (err: any) {
      console.error(err);
      setStatusMsg('Sign-in failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    sound.playClick();
    await logoutUser();
    showToast('Signed out from Cloud');
    setBackups([]);
  };

  const handleSyncToCloud = async () => {
    if (!user) return;
    setLoading(true);
    setStatusMsg('Uploading progress to Firestore Cloud Storage...');
    try {
      await saveUserStateToCloud(user.uid, state, user.email || undefined);
      updateState(prev => ({
        ...prev,
        cloudSync: {
          ...prev.cloudSync,
          lastSyncedAt: new Date().toISOString(),
          userId: user.uid,
          userEmail: user.email || '',
        },
      }));
      sound.playStreak(10);
      showToast('☁️ Progress synced to cloud successfully!');
      setStatusMsg('Synced at ' + new Date().toLocaleTimeString());
    } catch (err: any) {
      console.error(err);
      setStatusMsg('Sync failed: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreFromCloud = async () => {
    if (!user) return;
    if (!window.confirm('Restore your progress from Cloud? This will merge/overwrite local data.')) {
      return;
    }
    setLoading(true);
    setStatusMsg('Downloading progress from Cloud...');
    try {
      const cloudState = await loadUserStateFromCloud(user.uid);
      if (!cloudState) {
        setStatusMsg('No cloud data found for this account.');
        return;
      }
      updateState(() => cloudState);
      sound.playCelebration();
      showToast('☁️ Restored latest state from Cloud!');
      setStatusMsg('Restored successfully.');
    } catch (err: any) {
      console.error(err);
      setStatusMsg('Restore failed: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const label = snapshotLabel.trim() || `Snapshot (${new Date().toLocaleDateString()})`;
    setLoading(true);
    try {
      await createCloudBackup(user.uid, state, label);
      setSnapshotLabel('');
      sound.playCorrect();
      showToast('📸 Cloud snapshot saved!');
      loadBackupsList(user.uid);
    } catch (err: any) {
      console.error(err);
      showToast('Failed to save snapshot');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSnapshot = async (backupId: string) => {
    if (!user) return;
    if (!window.confirm('Delete this cloud snapshot?')) return;
    try {
      await deleteCloudBackup(user.uid, backupId);
      sound.playClick();
      setBackups(prev => prev.filter(b => b.id !== backupId));
      showToast('Snapshot deleted');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestoreSnapshot = (backup: CloudBackupItem) => {
    if (!window.confirm(`Restore snapshot "${backup.label}" from ${new Date(backup.createdAt).toLocaleString()}?`)) {
      return;
    }
    try {
      const parsed = JSON.parse(backup.stateJson);
      updateState(() => parsed);
      sound.playCelebration();
      showToast(`Restored snapshot: ${backup.label}`);
      onClose();
    } catch {
      showToast('Failed to parse snapshot data');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(145deg, #0d1527, #090e1f)',
          border: '1px solid #1e3a8a',
          borderRadius: 16,
          maxWidth: 580,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          color: '#f8fafc',
          padding: 24,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              ☁️
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Cloud Storage & Device Sync</h2>
              <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
                Firebase Cloud Firestore Persistence & Snapshots
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: 22,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* User Status Card */}
        {user ? (
          <div
            style={{
              background: '#111e38',
              border: '1px solid #1e3a8a',
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #38bdf8' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#0284c7',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{user.displayName || 'Doctor / Aspirant'}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{user.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid #ef4444',
                  borderRadius: 8,
                  padding: '4px 10px',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Sign Out
              </button>
            </div>

            {/* Sync Status Info */}
            <div
              style={{
                background: '#0b1324',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 12,
                color: '#cbd5e1',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <span>
                <strong>Last Cloud Sync:</strong>{' '}
                {state.cloudSync?.lastSyncedAt
                  ? new Date(state.cloudSync.lastSyncedAt).toLocaleString()
                  : 'Not yet synced this session'}
              </span>
              <span>
                <strong>Local Records:</strong> {state.attempts.length} attempts · {state.nb.length} notes
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                onClick={handleSyncToCloud}
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                ☁️ Sync to Cloud Now
              </button>
              <button
                onClick={handleRestoreFromCloud}
                disabled={loading}
                style={{
                  background: '#1e293b',
                  color: '#e2e8f0',
                  border: '1px solid #475569',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                📥 Download Latest
              </button>
            </div>
            {statusMsg && (
              <div style={{ fontSize: 12, color: '#38bdf8', marginTop: 10, textAlign: 'center' }}>
                {statusMsg}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              background: '#111833',
              border: '1px dashed #38bdf8',
              borderRadius: 12,
              padding: 24,
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔐</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 16 }}>Connect Your Google Account</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
              Enable automatic real-time cloud backup for all your INI-CET question attempts, 20th Notebook high-yield pearls, weak cluster diagnosis, and test streaks. Access your study state from any mobile, tablet, or desktop!
            </p>
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              }}
            >
              🚀 Sign in with Google (1-Click)
            </button>
            {statusMsg && (
              <div style={{ fontSize: 12, color: '#f87171', marginTop: 12 }}>{statusMsg}</div>
            )}
          </div>
        )}

        {/* Cloud Snapshots / Milestones */}
        {user && (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              📸 Cloud Backup Snapshots ({backups.length})
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 12px 0' }}>
              Create permanent restore points before taking Grand Tests, resetting intervals, or switching revision phases.
            </p>

            <form onSubmit={handleCreateSnapshot} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Snapshot label (e.g., Pre-GT 1, Week 3 Sprint)"
                value={snapshotLabel}
                onChange={e => setSnapshotLabel(e.target.value)}
                style={{
                  flex: 1,
                  background: '#111e38',
                  border: '1px solid #1e3a8a',
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: 13,
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#059669',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                + Save Snapshot
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {backups.length === 0 ? (
                <div style={{ padding: 16, background: '#090e1f', borderRadius: 8, textAlign: 'center', fontSize: 12, color: '#64748b' }}>
                  No saved snapshots yet. Save one above to create a milestone backup!
                </div>
              ) : (
                backups.map(bk => (
                  <div
                    key={bk.id}
                    style={{
                      background: '#111e38',
                      border: '1px solid #1e293b',
                      borderRadius: 8,
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{bk.label}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>
                        {new Date(bk.createdAt).toLocaleDateString()} {new Date(bk.createdAt).toLocaleTimeString()} · {bk.attemptsCount} attempts
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleRestoreSnapshot(bk)}
                        style={{
                          background: '#0284c7',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '4px 10px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handleDeleteSnapshot(bk.id)}
                        style={{
                          background: 'transparent',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: 11,
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
