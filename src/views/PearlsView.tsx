import React, { useState, useMemo } from 'react';
import { useAppState, SUBJECTS, esc } from '../state';
import { APEX_PEARLS, PearlItem } from '../data/pearlsData';
import { md } from '../utils/render';

interface PearlsViewProps {
  initialPearlId?: string;
  onStartBlock?: (mode: string, clusterId?: string) => void;
}

const TAG_COLORS: Record<string, string> = {
  'Next-Step': '#3b82f6',
  'IOC': '#8b5cf6',
  'Gold-Standard': '#10b981',
  'DOC': '#06b6d4',
  'Emergency': '#ef4444',
  'Volatile': '#f59e0b',
  'Image': '#ec4899',
  'Formula': '#6366f1',
};

export const PearlsView: React.FC<PearlsViewProps> = ({ initialPearlId, onStartBlock }) => {
  const { state, togglePearlMastered, showToast } = useAppState();

  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'mastered' | 'unmastered'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(initialPearlId || null);
  const [reflexMode, setReflexMode] = useState<boolean>(false);
  const [revealedAnchors, setRevealedAnchors] = useState<Record<string, boolean>>({});

  const masteredMap = state.pearls || {};

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    APEX_PEARLS.forEach(p => p.tags.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, []);

  // Filtered pearls
  const filteredPearls = useMemo(() => {
    const q = search.trim().toLowerCase();
    return APEX_PEARLS.filter(p => {
      // Subject filter
      if (selectedSubject !== 'all' && !p.subject.toLowerCase().includes(selectedSubject.toLowerCase())) {
        return false;
      }
      // Tag filter
      if (selectedTag !== 'all' && !p.tags.includes(selectedTag)) {
        return false;
      }
      // Status filter
      const isMastered = !!masteredMap[p.id];
      if (statusFilter === 'mastered' && !isMastered) return false;
      if (statusFilter === 'unmastered' && isMastered) return false;

      // Text search
      if (!q) return true;
      const haystack = (
        p.title +
        ' ' +
        p.subject +
        ' ' +
        p.system +
        ' ' +
        p.anchor +
        ' ' +
        p.trapAlert +
        ' ' +
        p.highYieldSummary.join(' ') +
        ' ' +
        (p.pyqNotes || '') +
        ' ' +
        (p.tags.join(' '))
      ).toLowerCase();
      return haystack.includes(q);
    });
  }, [search, selectedSubject, selectedTag, statusFilter, masteredMap]);

  const masteredCount = useMemo(() => {
    return APEX_PEARLS.filter(p => !!masteredMap[p.id]).length;
  }, [masteredMap]);

  const toggleReveal = (id: string) => {
    setRevealedAnchors(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPearlLink = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/pearls/${id}`;
    navigator.clipboard?.writeText(url);
    showToast('Copied direct link to Pearl!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pad view-enter" style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Top Banner / Headline */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #131d33 0%, #1e293b 100%)', border: '1px solid #334155', marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 28 }}>💎</span>
              <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                Apex Pearls Directory
              </h1>
              <span className="badge" style={{ background: '#3b82f6', color: '#fff', fontWeight: 700, fontSize: '0.75rem', padding: '2px 8px', borderRadius: 4 }}>
                Top-100 Rank Precision
              </span>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: '0.9rem', maxWidth: 680 }}>
              Definitive high-yield clinical contrast matrices, 30-second reflex anchors, step-by-step algorithms, and AIIMS trap eliminators. Connected directly to Q-Bank questions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ textAlign: 'right', background: 'rgba(15, 23, 42, 0.6)', padding: '10px 16px', borderRadius: 8, border: '1px solid #334155' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Mastery Progress</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
                {masteredCount} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/ {APEX_PEARLS.length}</span>
              </div>
            </div>
            <button
              onClick={() => setReflexMode(!reflexMode)}
              className="btn"
              style={{
                background: reflexMode ? '#f59e0b' : '#334155',
                color: reflexMode ? '#000' : '#f8fafc',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
              title="Hide anchor clues to test instant recall before revealing"
            >
              {reflexMode ? '⚡ Active Recall: ON' : '⚡ Active Recall: OFF'}
            </button>
            <button
              onClick={handlePrint}
              className="btn"
              style={{ background: '#1e293b', border: '1px solid #475569', color: '#cbd5e1', fontSize: '0.85rem' }}
              title="Print / Save complete Pearls high-yield handbook"
            >
              🖨️ Print
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: 16, background: '#0f172a', borderRadius: 6, height: 8, overflow: 'hidden', display: 'flex' }}>
          <div
            style={{
              width: `${(masteredCount / APEX_PEARLS.length) * 100}%`,
              background: 'linear-gradient(90deg, #38bdf8, #10b981)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search pearls, algorithms, IOC, drug of choice, traps..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '0.9rem',
                borderRadius: 6,
                border: '1px solid #334155',
                background: '#0b1220',
                color: '#f8fafc'
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Subject Filter */}
          <div style={{ minWidth: 160 }}>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 10px',
                fontSize: '0.85rem',
                borderRadius: 6,
                border: '1px solid #334155',
                background: '#0b1220',
                color: '#f8fafc'
              }}
            >
              <option value="all">All 19 Subjects</option>
              {SUBJECTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div style={{ minWidth: 150 }}>
            <select
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 10px',
                fontSize: '0.85rem',
                borderRadius: 6,
                border: '1px solid #334155',
                background: '#0b1220',
                color: '#f8fafc'
              }}
            >
              <option value="all">All High-Yield Tags</option>
              {allTags.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => setStatusFilter('all')}
              className={`btn ${statusFilter === 'all' ? 'btn-primary' : ''}`}
              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            >
              All ({APEX_PEARLS.length})
            </button>
            <button
              onClick={() => setStatusFilter('mastered')}
              className={`btn ${statusFilter === 'mastered' ? 'btn-primary' : ''}`}
              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            >
              Mastered ({masteredCount})
            </button>
            <button
              onClick={() => setStatusFilter('unmastered')}
              className={`btn ${statusFilter === 'unmastered' ? 'btn-primary' : ''}`}
              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            >
              Unmastered ({APEX_PEARLS.length - masteredCount})
            </button>
          </div>
        </div>

        {/* Quick Tag Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12, paddingTop: 10, borderTop: '1px solid #1e293b' }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', alignSelf: 'center', marginRight: 4 }}>High-Yield Focus:</span>
          {['IOC', 'Gold-Standard', 'Next-Step', 'DOC', 'Emergency', 'Volatile', 'Formula', 'Image'].map(tag => {
            const isSelected = selectedTag === tag;
            const color = TAG_COLORS[tag] || '#64748b';
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? 'all' : tag)}
                style={{
                  background: isSelected ? color : 'rgba(51, 65, 85, 0.4)',
                  color: isSelected ? '#fff' : '#cbd5e1',
                  border: `1px solid ${isSelected ? color : '#334155'}`,
                  borderRadius: 14,
                  padding: '3px 9px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          Showing <b>{filteredPearls.length}</b> clinical pearls
          {selectedSubject !== 'all' && <span> in <b>{selectedSubject}</b></span>}
          {selectedTag !== 'all' && <span> tagged with <b>{selectedTag}</b></span>}
        </div>
        {filteredPearls.length > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                if (expandedId === 'ALL') {
                  setExpandedId(null);
                } else {
                  setExpandedId('ALL');
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {expandedId === 'ALL' ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        )}
      </div>

      {/* Pearls List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredPearls.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p className="muted" style={{ fontSize: '1rem', marginBottom: 12 }}>
              No pearls matched your filter criteria.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSearch('');
                setSelectedSubject('all');
                setSelectedTag('all');
                setStatusFilter('all');
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredPearls.map(pearl => {
            const isExpanded = expandedId === 'ALL' || expandedId === pearl.id;
            const isMastered = !!masteredMap[pearl.id];
            const isAnchorRevealed = revealedAnchors[pearl.id];

            return (
              <div
                key={pearl.id}
                id={`pearl-${pearl.id}`}
                className="card"
                style={{
                  border: isMastered ? '1px solid #059669' : '1px solid #334155',
                  background: isMastered ? '#0b1624' : '#101726',
                  transition: 'all 0.2s ease',
                  padding: 0,
                  overflow: 'hidden'
                }}
              >
                {/* Pearl Header Bar */}
                <div
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    cursor: 'pointer',
                    background: isMastered ? 'rgba(16, 185, 129, 0.08)' : 'rgba(30, 41, 59, 0.4)',
                    borderBottom: isExpanded ? '1px solid #334155' : 'none'
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : pearl.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 300px' }}>
                    <span
                      style={{
                        background: '#1e293b',
                        color: '#38bdf8',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid #334155'
                      }}
                    >
                      {pearl.num}
                    </span>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {pearl.subject} • {pearl.system}
                        </span>
                        <span style={{ color: '#fbbf24', fontSize: '0.75rem', letterSpacing: '1px' }}>
                          {'★'.repeat(pearl.yield)}
                        </span>
                      </div>
                      <h3 style={{ margin: '3px 0 0', fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                        {pearl.title}
                      </h3>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginRight: 6 }}>
                      {pearl.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: 10,
                            background: `${TAG_COLORS[tag] || '#64748b'}22`,
                            color: TAG_COLORS[tag] || '#94a3b8',
                            border: `1px solid ${TAG_COLORS[tag] || '#64748b'}55`
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Mastered toggle button */}
                    <button
                      onClick={() => {
                        togglePearlMastered(pearl.id);
                        showToast(isMastered ? 'Marked as unmastered' : 'Marked as Mastered! 🎉');
                      }}
                      className="btn"
                      style={{
                        padding: '5px 10px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: isMastered ? '#059669' : '#1e293b',
                        color: isMastered ? '#fff' : '#94a3b8',
                        border: isMastered ? '1px solid #10b981' : '1px solid #475569'
                      }}
                      title="Toggle mastered status"
                    >
                      {isMastered ? '✓ Mastered' : 'Mark Mastered'}
                    </button>

                    {/* Share / Copy direct link */}
                    <button
                      onClick={() => copyPearlLink(pearl.id)}
                      className="btn"
                      style={{ padding: '5px 8px', fontSize: '0.78rem', background: '#1e293b', border: '1px solid #334155' }}
                      title="Copy link to this Pearl"
                    >
                      🔗
                    </button>

                    {/* Expand icon */}
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* Always-Visible or Collapsible Body */}
                <div style={{ padding: '16px 20px', display: isExpanded ? 'block' : 'none' }}>
                  {/* 30-Second Instant Anchor Clue */}
                  <div
                    style={{
                      background: 'rgba(56, 189, 248, 0.08)',
                      borderLeft: '4px solid #38bdf8',
                      padding: '12px 16px',
                      borderRadius: 4,
                      marginBottom: 16
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        ⚡ 30-Second Diagnostic Reflex (The Anchor)
                      </span>
                      {reflexMode && (
                        <button
                          onClick={() => toggleReveal(pearl.id)}
                          style={{
                            background: '#0f172a',
                            border: '1px solid #38bdf8',
                            color: '#38bdf8',
                            borderRadius: 4,
                            padding: '2px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {isAnchorRevealed ? 'Hide Clue' : 'Reveal Clue'}
                        </button>
                      )}
                    </div>
                    {reflexMode && !isAnchorRevealed ? (
                      <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.88rem' }}>
                        Active recall active: Test your instant diagnostic reflex for this topic in your mind, then click Reveal.
                      </div>
                    ) : (
                      <div
                        style={{ fontSize: '0.92rem', color: '#f1f5f9', fontWeight: 600, lineHeight: 1.5 }}
                        dangerouslySetInnerHTML={{ __html: md(pearl.anchor) }}
                      />
                    )}
                  </div>

                  {/* Core High-Yield Summary */}
                  <div style={{ marginBottom: 18 }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '0.85rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
                      📋 High-Yield Clinical Highlights & Criteria
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {pearl.highYieldSummary.map((pt, idx) => (
                        <div
                          key={idx}
                          style={{
                            fontSize: '0.88rem',
                            color: '#cbd5e1',
                            lineHeight: 1.55,
                            background: 'rgba(15, 23, 42, 0.4)',
                            padding: '8px 12px',
                            borderRadius: 6,
                            border: '1px solid #1e293b'
                          }}
                          dangerouslySetInnerHTML={{ __html: md(pt) }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Algorithmic Flowchart if present */}
                  {pearl.algorithm && (
                    <div style={{ marginBottom: 18 }}>
                      <h4 style={{ margin: '0 0 8px', fontSize: '0.85rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
                        🔀 Stepwise Clinical Algorithm
                      </h4>
                      <pre
                        style={{
                          background: '#070d18',
                          border: '1px solid #1e293b',
                          borderRadius: 6,
                          padding: '12px 14px',
                          color: '#38bdf8',
                          fontSize: '0.8rem',
                          fontFamily: 'Consolas, Monaco, monospace',
                          overflowX: 'auto',
                          lineHeight: 1.45,
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {pearl.algorithm}
                      </pre>
                    </div>
                  )}

                  {/* Contrast Matrix / Table if present */}
                  {pearl.table && (
                    <div style={{ marginBottom: 18 }}>
                      <h4 style={{ margin: '0 0 8px', fontSize: '0.85rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
                        ⚖️ {pearl.table.title}
                      </h4>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', background: '#0b1220' }}>
                          <thead>
                            <tr style={{ background: '#1e293b' }}>
                              {pearl.table.head.map((h, i) => (
                                <th
                                  key={i}
                                  style={{
                                    padding: '8px 12px',
                                    textAlign: 'left',
                                    borderBottom: '2px solid #334155',
                                    color: '#f8fafc',
                                    fontWeight: 700
                                  }}
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {pearl.table.rows.map((r, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid #1e293b', background: i % 2 === 0 ? 'transparent' : 'rgba(30, 41, 59, 0.25)' }}>
                                {r.map((c, j) => (
                                  <td key={j} style={{ padding: '8px 12px', color: '#cbd5e1', lineHeight: 1.4 }}>
                                    {c}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Trap Alert Box */}
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      borderLeft: '4px solid #ef4444',
                      padding: '12px 16px',
                      borderRadius: 4,
                      marginBottom: 16
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: '1rem' }}>⚠️</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        AIIMS / INI-CET Distractor Trap Alert
                      </span>
                    </div>
                    <div
                      style={{ fontSize: '0.88rem', color: '#fca5a5', lineHeight: 1.5, fontWeight: 500 }}
                      dangerouslySetInnerHTML={{ __html: md(pearl.trapAlert) }}
                    />
                  </div>

                  {/* Why Others Wrong Option Breakdown */}
                  {pearl.whyOthersWrong && pearl.whyOthersWrong.length > 0 && (
                    <div style={{ marginBottom: 18 }}>
                      <h4 style={{ margin: '0 0 8px', fontSize: '0.85rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
                        ❌ Why Distractors Are Wrong (Option-by-Option Debunk)
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {pearl.whyOthersWrong.map((w, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: '#0d131f',
                              border: '1px solid #1e293b',
                              borderRadius: 6,
                              padding: '8px 12px',
                              fontSize: '0.82rem',
                              lineHeight: 1.45
                            }}
                          >
                            <span style={{ color: '#f87171', fontWeight: 700 }}>✗ "{w.distractor}": </span>
                            <span style={{ color: '#cbd5e1' }}>{w.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer & Actions */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      marginTop: 16,
                      paddingTop: 12,
                      borderTop: '1px solid #1e293b'
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {pearl.pyqNotes && <div style={{ color: '#94a3b8', marginBottom: 2 }}>🎯 <b>PYQ History:</b> {pearl.pyqNotes}</div>}
                      {pearl.verifyGuideline && <div>📚 <b>Standard Source:</b> {pearl.verifyGuideline}</div>}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      {pearl.clusterId && (
                        <a
                          href={`#/c/${pearl.clusterId}`}
                          className="btn"
                          style={{ fontSize: '0.78rem', padding: '6px 12px', background: '#1e293b', color: '#38bdf8', border: '1px solid #0284c7' }}
                        >
                          View Connected Topic Cluster →
                        </a>
                      )}
                      {pearl.clusterId && onStartBlock && (
                        <button
                          onClick={() => onStartBlock('mixed', pearl.clusterId)}
                          className="btn btn-primary"
                          style={{ fontSize: '0.78rem', padding: '6px 14px', fontWeight: 700 }}
                        >
                          ⚡ Test on this Pearl (MCQ Drill)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
