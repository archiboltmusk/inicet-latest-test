import React, { useState, useEffect, useRef } from 'react';

interface ImageLightboxModalProps {
  src: string;
  alt?: string;
  caption?: string;
  credit?: string;
  licence?: string;
  sourceUrl?: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  src,
  alt = 'Inspection Image',
  caption,
  credit,
  licence,
  sourceUrl,
  onClose,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [inverted, setInverted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === '+' || e.key === '=') zoomIn();
      else if (e.key === '-' || e.key === '_') zoomOut();
      else if (e.key === '0') resetZoom();
      else if (e.key.toLowerCase() === 'i') setInverted(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const zoomIn = () => setScale(s => Math.min(4, s + 0.35));
  const zoomOut = () => setScale(s => Math.max(0.6, s - 0.35));
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(5, 8, 15, 0.92)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top control bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          borderBottom: '1px solid var(--line)',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn sm" onClick={zoomIn} title="Zoom in (+)">
            Zoom +
          </button>
          <button className="btn sm" onClick={zoomOut} title="Zoom out (-)">
            Zoom −
          </button>
          <button className="btn sm" onClick={resetZoom} title="Reset zoom (0)">
            {Math.round(scale * 100)}%
          </button>
          <button
            className="btn sm"
            onClick={() => setInverted(!inverted)}
            title="Invert colors for radiology/contrast check (I)"
            style={inverted ? { backgroundColor: 'var(--accent)', color: '#fff' } : undefined}
          >
            {inverted ? 'Invert: ON' : 'Invert (X-ray)'}
          </button>
        </div>

        <button
          className="btn sm"
          onClick={onClose}
          style={{ fontWeight: 700, padding: '6px 14px' }}
        >
          ✕ Close <kbd style={{ marginLeft: 4 }}>Esc</kbd>
        </button>
      </div>

      {/* Main Image Viewport */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            maxHeight: scale === 1 ? '75vh' : 'none',
            maxWidth: scale === 1 ? '90vw' : 'none',
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            filter: inverted ? 'invert(1) hue-rotate(180deg)' : 'none',
            objectFit: 'contain',
            borderRadius: 6,
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          }}
        />
      </div>

      {/* Bottom Caption and metadata bar */}
      {(caption || credit || licence || sourceUrl) && (
        <div
          style={{
            padding: '10px 20px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            borderTop: '1px solid var(--line)',
            color: '#e2e8f0',
            fontSize: 13,
            lineHeight: 1.4,
          }}
        >
          {caption && <div style={{ fontWeight: 600 }}>{caption}</div>}
          <div className="muted small" style={{ marginTop: 2 }}>
            {credit && <span>{credit}</span>}
            {licence && <span> · {licence}</span>}
            {sourceUrl && (
              <span>
                {' · '}
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)' }}
                >
                  view source
                </a>
              </span>
            )}
            <span style={{ marginLeft: 16, opacity: 0.7 }}>
              Hint: Drag when zoomed in · Mouse wheel to zoom · Click Invert for negative X-ray view
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
