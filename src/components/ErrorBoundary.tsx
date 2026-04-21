import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const AVOID_RED = '#C25B3F';

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div style={{
          margin: 40,
          padding: 32,
          background: 'var(--cw-surface)',
          border: `1px solid ${AVOID_RED}`,
          borderRadius: 20,
          textAlign: 'center',
          fontFamily: 'var(--cw-font-body)',
        }}>
          <h3 style={{
            margin: '0 0 12px',
            fontFamily: 'var(--cw-font-display)',
            fontSize: 28,
            fontWeight: 400,
            color: 'var(--cw-ink)',
            letterSpacing: 'var(--cw-display-letter)',
          }}>Something went wrong.</h3>
          <p style={{
            margin: '0 auto',
            maxWidth: 520,
            fontSize: 14,
            lineHeight: 1.55,
            color: 'var(--cw-ink-muted)',
          }}>
            {this.state.error?.message ?? 'Unknown error'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: 20,
              padding: '10px 18px',
              borderRadius: 999,
              border: '1px solid var(--cw-ink)',
              background: 'var(--cw-ink)',
              color: 'var(--cw-surface)',
              fontFamily: 'var(--cw-font-body)',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
