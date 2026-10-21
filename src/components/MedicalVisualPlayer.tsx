import React, { useState } from 'react';
import { sound } from '../utils/audio';

export interface MedicalVisualProps {
  src: string;
  title: string;
  caption?: string;
  credit?: string;
  licence?: string;
  annotations?: { xPercent: number; yPercent: number; label: string; clue?: string }[];
  comparisonSrc?: string;
  comparisonLabel?: string;
  onSaveToNotebook?: (title: string, caption: string) => void;
  onClose?: () => void;
}

export const MedicalVisualPlayer: React.FC<MedicalVisualProps> = ({
  src,
  title,
  caption,
  credit,
  licence,
  annotations = [],
  comparisonSrc,
  comparisonLabel,
  onSaveToNotebook,
  onClose,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filterMode, setFilterMode] = useState<'normal' | 'invert' | 'contrast' | 'greyscale'>('normal');
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'original' | 'compare'>('original');

  const filterStyles: Record<string, string> = {
    normal: 'none',
    invert: 'invert(1) hue-rotate(180deg) brightness(1.1)',
    contrast: 'contrast(1.6) brightness(1.05)',
    greyscale: 'grayscale(1) contrast(1.3)',
  };

  const handleZoom = (delta: number) => {
    sound.playClick();
    setZoomLevel(prev => Math.min(3, Math.max(0.8, +(prev + delta).toFixed(1))));
  };

  return (
    <div
      style={{
        background: '#090e1f',
        border: '1px solid #1e293b',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
        marginBottom: 20,
      }}
    >
      {/* Top Header & Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          padding: '12px 16px',
          background: 'linear-gradient(90deg, #10172e, #1a2342)',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🔬</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#f8fafc' }}>{title}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>High-Yield Diagnostic Visualizer</div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {comparisonSrc && (
            <div style={{ display: 'flex', background: '#0f172a', borderRadius: 8, padding: 2, border: '1px solid #334155' }}>
              <button
                onClick={() => setActiveTab('original')}
                style={{
                  background: activeTab === 'original' ? '#2563eb' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Pathology
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                style={{
                  background: activeTab === 'compare' ? '#2563eb' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {comparisonLabel || 'Comparison'}
              </button>
            </div>
          )}

          {/* Filters */}
          <select
            value={filterMode}
            onChange={e => setFilterMode(e.target.value as any)}
            style={{
              background: '#0f172a',
              color: '#38bdf8',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: '4px 8px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Image filter for radiologic & cytology contrast"
          >
            <option value="normal">Normal View</option>
            <option value="invert">Inverted (X-Ray/ECG)</option>
            <option value="contrast">High Contrast</option>
            <option value="greyscale">Monochrome</option>
          </select>

          {/* Zoom buttons */}
          <div style={{ display: 'flex', gap: 2 }}>
            <button
              onClick={() => handleZoom(-0.2)}
              style={{
                background: '#1e293b',
                color: '#cbd5e1',
                border: '1px solid #334155',
                padding: '4px 8px',
                borderRadius: '6px 0 0 6px',
                fontSize: 12,
                cursor: 'pointer',
              }}
              title="Zoom out"
            >
              -
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setZoomLevel(1);
              }}
              style={{
                background: '#1e293b',
                color: '#cbd5e1',
                border: '1px solid #334155',
                borderLeft: 'none',
                borderRight: 'none',
                padding: '4px 8px',
                fontSize: 11,
                cursor: 'pointer',
              }}
              title="Reset zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={() => handleZoom(0.2)}
              style={{
                background: '#1e293b',
                color: '#cbd5e1',
                border: '1px solid #334155',
                padding: '4px 8px',
                borderRadius: '0 6px 6px 0',
                fontSize: 12,
                cursor: 'pointer',
              }}
              title="Zoom in"
            >
              +
            </button>
          </div>

          {annotations.length > 0 && (
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              style={{
                background: showAnnotations ? '#059669' : '#334155',
                color: '#fff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {showAnnotations ? '📍 Pins ON' : 'Pins OFF'}
            </button>
          )}

          {onSaveToNotebook && (
            <button
              onClick={() => {
                sound.playCelebration();
                onSaveToNotebook(title, caption || title);
              }}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Save this spotter image to your 20th Notebook"
            >
              ⭐ Add to Notebook
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Image Stage */}
      <div
        style={{
          position: 'relative',
          overflow: 'auto',
          maxHeight: 460,
          background: '#040711',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={activeTab === 'original' ? src : (comparisonSrc || src)}
            alt={title}
            style={{
              maxHeight: 380,
              maxWidth: '100%',
              borderRadius: 8,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease, filter 0.2s ease',
              filter: filterStyles[filterMode],
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              display: 'block',
            }}
          />

          {/* Diagnostic Marker Pins */}
          {showAnnotations &&
            activeTab === 'original' &&
            annotations.map((pin, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: `${pin.yPercent}%`,
                  left: `${pin.xPercent}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#ef4444',
                    border: '2px solid #ffffff',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)',
                    cursor: 'pointer',
                  }}
                  title={`${pin.label}: ${pin.clue || ''}`}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: 26,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #475569',
                    borderRadius: 6,
                    padding: '3px 8px',
                    fontSize: 11,
                    color: '#f8fafc',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  }}
                >
                  {pin.label}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Caption & Diagnostic Anchor */}
      {caption && (
        <div style={{ padding: '12px 18px', background: '#0e172a', borderTop: '1px solid #1e293b' }}>
          <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>
            <strong>💡 Diagnostic Anchor:</strong> {caption}
          </div>
          {(credit || licence) && (
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              Credit: {credit || 'Medical Archive'} · {licence || 'Educational licence'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
