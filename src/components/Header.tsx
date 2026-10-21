import React, { useState, useMemo } from 'react';
import { useAppState } from '../state';
import { sound } from '../utils/audio';
import { CloudStorageModal } from './CloudStorageModal';

interface HeaderProps {
  currentRoute: string;
}

const THEMES = [
  { id: '', label: '🎮 Arcade Dark' },
  { id: 'light', label: '☀️ Sunny Arcade' },
  { id: 'cyberpunk', label: '🌌 Cyber Neon' },
  { id: 'botanical', label: '🌿 Emerald Zen' },
];

export const Header: React.FC<HeaderProps> = ({ currentRoute }) => {
  const { state, setTheme, showToast } = useAppState();
  const [soundOn, setSoundOn] = useState(() => sound.isEnabled());
  const [showCloudModal, setShowCloudModal] = useState(false);

  const isRouteActive = (route: string) => {
    if (route === 'today' && (currentRoute === 'today' || !currentRoute)) return true;
    if (route === 'matrix' && (currentRoute === 'matrix' || currentRoute === 'c')) return true;
    return currentRoute === route;
  };

  // Gamification calculations
  const { xp, level, rankTitle, streakDays, accuracyPct } = useMemo(() => {
    const correctCount = state.attempts.filter(a => a.ok).length;
    const totalCount = state.attempts.length;
    const blocksCount = state.blocks.length;
    const pearlsCount = Object.keys(state.pearls || {}).filter(k => state.pearls![k]).length;
    const notebookCount = state.nb.length;

    const totalXp = correctCount * 10 + blocksCount * 60 + pearlsCount * 30 + notebookCount * 15;
    const lvl = Math.floor(totalXp / 120) + 1;

    let title = 'Cadet Aspirant';
    if (lvl >= 25) title = '🏆 AIR < 100 Ranker';
    else if (lvl >= 18) title = '⚡ Top 500 Clinician';
    else if (lvl >= 12) title = '🎯 Top 1,000 Strategist';
    else if (lvl >= 6) title = '🔥 High-Yield Scholar';
    else if (lvl >= 3) title = '⭐ PYT Hunter';

    // Streak calculation from sprints & attempts
    const uniqueAttemptDays = new Set(
      state.attempts.map(a => new Date(a.ts).toDateString())
    );
    const sprintDays = Object.values(state.sprint || {}).filter(Boolean).length;
    const streak = Math.max(uniqueAttemptDays.size, sprintDays, 1);

    const acc = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 100;

    return {
      xp: totalXp,
      level: lvl,
      rankTitle: title,
      streakDays: streak,
      accuracyPct: acc,
    };
  }, [state.attempts, state.blocks, state.pearls, state.nb, state.sprint]);

  const handleToggleSound = () => {
    const next = sound.toggle();
    setSoundOn(next);
    showToast(next ? '🔊 Arcade Sound FX: ON' : '🔇 Arcade Sound FX: MUTED');
  };

  const handleCycleTheme = () => {
    const curIdx = THEMES.findIndex(t => t.id === (state.settings.theme || ''));
    const nextIdx = (curIdx + 1) % THEMES.length;
    const nextTheme = THEMES[nextIdx];
    setTheme(nextTheme.id);
    showToast(`Theme changed to ${nextTheme.label}! 🎨`);
  };

  return (
    <header className="top">
      {/* Brand & Gamer Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <a className="brand" href="#/today">
          <span style={{ fontSize: '1.25rem' }}>🎯</span>
          <span>INI-CET <b>Revision OS</b></span>
        </a>

        {/* Player Level & XP Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--soft)',
            border: '1.5px solid var(--line-strong)',
            padding: '3px 10px',
            borderRadius: 99,
            fontSize: '0.78rem',
            fontWeight: 700,
          }}
          title={`Total XP: ${xp.toLocaleString()} • Rank: ${rankTitle}`}
        >
          <span style={{ color: 'var(--warn)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            ⭐ <b>Lv.{level}</b>
          </span>
          <span style={{ color: 'var(--line-strong)' }}>|</span>
          <span style={{ color: 'var(--accent)' }}>{rankTitle}</span>
          <span style={{ color: 'var(--line-strong)' }}>|</span>
          <span style={{ color: 'var(--streak)' }}>🔥 {streakDays}d Streak</span>
          {accuracyPct > 0 && (
            <>
              <span style={{ color: 'var(--line-strong)' }}>|</span>
              <span style={{ color: 'var(--good)' }}>🎯 {accuracyPct}%</span>
            </>
          )}
        </div>
      </div>

      {/* Main Nav Items */}
      <nav id="nav">
        <a href="#/today" className={isRouteActive('today') ? 'on' : ''}>
          Today
        </a>
        <a href="#/sprint" className={isRouteActive('sprint') ? 'on' : ''}>
          Sprint
        </a>
        <a href="#/matrix" className={isRouteActive('matrix') ? 'on' : ''}>
          Matrix
        </a>
        <a href="#/block" className={isRouteActive('block') ? 'on' : ''}>
          Block
        </a>
        <a href="#/review" className={isRouteActive('review') ? 'on' : ''}>
          Review
        </a>
        <a href="#/errors" className={isRouteActive('errors') ? 'on' : ''}>
          Error OS
        </a>
        <a href="#/spotters" className={isRouteActive('spotters') ? 'on' : ''}>
          Spotters
        </a>
        <a href="#/notebook" className={isRouteActive('notebook') ? 'on' : ''}>
          Notebook
        </a>
        <a href="#/pyq" className={isRouteActive('pyq') ? 'on' : ''}>
          PYQs
        </a>
        <a href="#/coverage" className={isRouteActive('coverage') ? 'on' : ''}>
          Coverage
        </a>
        <a href="#/playbook" className={isRouteActive('playbook') ? 'on' : ''}>
          Playbook
        </a>
        <a href="#/pearls" className={isRouteActive('pearls') ? 'on' : ''} title="Apex Pearls Directory (Top-100 High Yield Knowledge Matrix)">
          💎 Pearls
        </a>
        <a href="#/vault" className={isRouteActive('vault') ? 'on' : ''} title="Visual & Video Vault (Radiology, Histology, ECG & Animated Simulations)">
          🎬 Vault
        </a>
        <a href="#/discriminators" className={isRouteActive('discriminators') ? 'on' : ''} title="Confusable Pairs Discriminator">
          Pairs
        </a>
        <a href="#/volatile" className={isRouteActive('volatile') ? 'on' : ''} title="20 Easy-Mark Volatile Revision Sheets">
          20 Sheets
        </a>
        <a href="quest/" title="8-bit organ-system tracker">
          Quest
        </a>

        {/* Cloud Storage & Sync button */}
        <button
          onClick={() => {
            sound.playClick();
            setShowCloudModal(true);
          }}
          style={{
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            padding: '4px 9px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            marginLeft: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
          }}
          title="Cloud Storage & Cross-Device Sync"
        >
          ☁️ Cloud
        </button>

        {/* Arcade Sound FX Toggle */}
        <button
          onClick={handleToggleSound}
          style={{
            background: soundOn ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            border: '1px solid var(--line)',
            borderRadius: 8,
            color: soundOn ? 'var(--accent)' : 'var(--muted)',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            marginLeft: 4,
          }}
          title={soundOn ? 'Arcade sound effects enabled (Click to mute)' : 'Arcade sound muted (Click to enable)'}
        >
          {soundOn ? '🔊 SFX' : '🔇 Muted'}
        </button>

        {/* Theme Quick Switcher */}
        <button
          onClick={handleCycleTheme}
          style={{
            background: 'var(--soft)',
            border: '1px solid var(--line)',
            borderRadius: 8,
            color: 'var(--ink)',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
          title="Cycle game themes (Arcade Dark, Sunny Light, Cyberpunk, Emerald Zen)"
        >
          🎨 Theme
        </button>

        <a
          href="#/settings"
          className={isRouteActive('settings') ? 'on' : ''}
          aria-label="Settings"
        >
          ⚙
        </a>
      </nav>

      {showCloudModal && <CloudStorageModal onClose={() => setShowCloudModal(false)} />}
    </header>
  );
};
