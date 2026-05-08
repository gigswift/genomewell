import { useState } from 'react';
import type { CSSProperties } from 'react';
import { CWButton, CWDialog } from './ui';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacy: () => void;
}

type Status = 'idle' | 'submitting' | 'success' | 'validation-error' | 'server-error';

const TOPICS = [
  'General feedback',
  'A specific recommendation',
  'Bug report',
  'Partnership inquiry',
  'Privacy or security',
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FeedbackModal({ isOpen, onClose, onOpenPrivacy }: FeedbackModalProps) {
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [topic, setTopic] = useState<string>('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');

  function reset() {
    setEmail('');
    setComment('');
    setTopic('');
    setWebsite('');
    setStatus('idle');
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email) || comment.trim().length < 10) {
      setStatus('validation-error');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          comment,
          topic: topic || undefined,
          website,
        }),
      });
      if (res.ok) {
        setStatus('success');
      } else if (res.status === 400) {
        setStatus('validation-error');
      } else {
        setStatus('server-error');
      }
    } catch {
      setStatus('server-error');
    }
  }

  return (
    <CWDialog
      isOpen={isOpen}
      onClose={handleClose}
      title="TELL US WHAT YOU THINK"
      maxWidth={520}
    >
      {status === 'success' ? (
        <SuccessState onClose={handleClose} />
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <Field label="Email" required>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={inputStyle}
            />
          </Field>

          <Field label="Topic" hint="Optional">
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select a topic…</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field label="Comment" required>
            <textarea
              required
              minLength={10}
              maxLength={5000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 110, lineHeight: 1.5 }}
            />
          </Field>

          {/* Honeypot — invisible to humans, bots fill it */}
          <div aria-hidden="true" style={{
            position: 'absolute', left: '-9999px', width: 1, height: 1,
            overflow: 'hidden', opacity: 0,
          }}>
            <label>
              Website (leave empty)
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>

          {status === 'validation-error' && (
            <div style={errorStyle}>
              Please enter a valid email and a comment of at least 10 characters.
            </div>
          )}
          {status === 'server-error' && (
            <div style={errorStyle}>
              Couldn't send right now. Please try again or email hello@chronicwellness.ai.
            </div>
          )}

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, marginTop: 18, flexWrap: 'wrap',
          }}>
            <button
              type="button"
              onClick={() => {
                handleClose();
                onOpenPrivacy();
              }}
              style={privacyLinkStyle}
            >
              How is your data handled? →
            </button>
            <CWButton
              variant="primary"
              type="submit"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending…' : 'Send feedback'}
            </CWButton>
          </div>
        </form>
      )}
    </CWDialog>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      padding: '12px 0 4px',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16,
    }}>
      <p style={{
        margin: 0,
        fontFamily: 'var(--cw-font-body)',
        fontSize: 16, lineHeight: 1.55,
        color: 'var(--cw-ink)',
      }}>
        Thanks — we'll reply within a few days.
      </p>
      <CWButton variant="ghost" size="sm" onClick={onClose}>Close</CWButton>
    </div>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, required, hint, children }: FieldProps) {
  return (
    <label style={{
      display: 'flex', flexDirection: 'column', gap: 6,
      marginBottom: 14,
    }}>
      <span style={{
        display: 'flex', alignItems: 'baseline', gap: 8,
        fontFamily: 'var(--cw-font-mono)',
        fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--cw-ink-soft)',
      }}>
        <span>{label}{required ? ' *' : ''}</span>
        {hint && <span style={{ color: 'var(--cw-ink-soft)', opacity: 0.7 }}>{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const inputStyle: CSSProperties = {
  fontFamily: 'var(--cw-font-body)',
  fontSize: 14,
  padding: '10px 12px',
  background: 'var(--cw-surface-alt)',
  border: '1px solid var(--cw-line)',
  borderRadius: 10,
  color: 'var(--cw-ink)',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
};

const errorStyle: CSSProperties = {
  marginTop: 4,
  padding: '10px 12px',
  border: '1px solid #C25B3F',
  borderRadius: 10,
  background: 'transparent',
  color: '#C25B3F',
  fontFamily: 'var(--cw-font-body)',
  fontSize: 13,
  lineHeight: 1.5,
};

const privacyLinkStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
  padding: 0,
  fontFamily: 'var(--cw-font-body)',
  fontSize: 13,
  color: 'var(--cw-ink-muted)',
  cursor: 'pointer',
  textDecoration: 'underline',
  textDecorationColor: 'var(--cw-line)',
  textUnderlineOffset: 3,
};
