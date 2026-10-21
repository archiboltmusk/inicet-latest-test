import React, { Component, ErrorInfo, ReactNode } from 'react';
import { KEY } from '../state';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetCache = () => {
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem('inicet-os-v4');
      localStorage.removeItem('inicet-sound-enabled');
      window.location.hash = '#/today';
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 50% 20%, #162044 0%, #0b1220 80%)',
            color: '#f8fafc',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '24px',
            boxSizing: 'border-box',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              maxWidth: 580,
              width: '100%',
              background: 'rgba(30, 41, 59, 0.75)',
              border: '1.5px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 16,
              padding: '28px 24px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🛡️</div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px 0', color: '#f87171' }}>
              Crash Shield Activated
            </h1>
            <p style={{ fontSize: '0.92rem', color: '#cbd5e1', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              The Revision OS intercepted an unexpected issue during rendering. You can safely restore the session below.
            </p>

            {this.state.error && (
              <div
                style={{
                  textAlign: 'left',
                  background: '#050914',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  padding: '12px 14px',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  color: '#fb7185',
                  overflowX: 'auto',
                  marginBottom: 20,
                  maxHeight: 140,
                }}
              >
                <b>Error:</b> {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                🔄 Reload App
              </button>

              <button
                onClick={this.handleResetCache}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  padding: '10px 20px',
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                🧹 Clear Local Cache & Restart
              </button>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '20px 0 0 0' }}>
              If deployed on GitHub Pages, verify that your repository Pages settings are set to deploy from GitHub Actions or gh-pages branch.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
