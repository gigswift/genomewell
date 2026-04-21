import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';

type DesignPriority = 'essential' | 'recommended' | 'optional' | 'gap' | 'avoid';

interface LogoProps {
  size?: number;
  color?: string;
}

export const CWMark = ({ size = 22, color }: LogoProps) => {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="11" cy="11" r="10" stroke={color || 'var(--cw-ink)'} strokeWidth="1.2" />
      <path d="M3 8 C 8 8, 14 14, 19 14" stroke={color || 'var(--cw-ink)'} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M3 14 C 8 14, 14 8, 19 8" stroke={color || 'var(--cw-ink)'} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};

export const CWLogo = ({ size = 20, color }: LogoProps) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    fontFamily: 'var(--cw-font-display)',
    fontWeight: 400,
    fontSize: size, letterSpacing: 'var(--cw-display-letter)',
    color: color || 'var(--cw-ink)', lineHeight: 1,
  }}>
    <CWMark size={Math.round(size * 1.1)} color={color} />
    <span>Chronic Wellness</span>
  </div>
);

type PrivacyVariant = 'inline' | 'badge' | 'rule';
interface PrivacyLockupProps {
  variant?: PrivacyVariant;
  dense?: boolean;
}

export const CWPrivacyLockup = ({ variant = 'inline', dense = false }: PrivacyLockupProps) => {
  const lockIcon = (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <rect x="1" y="6" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3 6 V4 a3 3 0 0 1 6 0 V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6" cy="9.5" r="0.9" fill="currentColor" />
    </svg>
  );

  if (variant === 'badge') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: dense ? '4px 9px' : '6px 12px',
        border: '1px solid var(--cw-line)',
        borderRadius: 999,
        fontFamily: 'var(--cw-font-mono)',
        fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase',
        color: 'var(--cw-ink-muted)', background: 'transparent',
      }}>
        {lockIcon}
        <span>Processed locally</span>
      </span>
    );
  }
  if (variant === 'rule') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        fontFamily: 'var(--cw-font-mono)',
        fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--cw-ink-soft)',
      }}>
        <span style={{ flex: 1, height: 1, background: 'var(--cw-line)' }} />
        {lockIcon}
        <span>Your DNA never leaves your device</span>
        <span style={{ flex: 1, height: 1, background: 'var(--cw-line)' }} />
      </div>
    );
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: 'var(--cw-font-mono)',
      fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
      color: 'var(--cw-ink-muted)',
    }}>
      {lockIcon}
      <span>100% on-device</span>
    </span>
  );
};

type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost' | 'quiet';
type ButtonSize = 'sm' | 'md' | 'lg';
interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export const CWButton = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  full,
  disabled,
  style = {},
  type = 'button',
}: ButtonProps) => {
  const sizes: Record<ButtonSize, { p: string; fs: number }> = {
    sm: { p: '9px 14px', fs: 13 },
    md: { p: '13px 18px', fs: 14 },
    lg: { p: '16px 24px', fs: 15 },
  };
  const s = sizes[size];
  const base: CSSProperties = {
    fontFamily: 'var(--cw-font-body)',
    fontSize: s.fs,
    padding: s.p,
    borderRadius: 999,
    border: '1px solid transparent',
    fontWeight: 500,
    letterSpacing: '-0.005em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: full ? '100%' : undefined,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'transform 0.12s ease, background 0.18s ease, border-color 0.18s ease',
  };
  const variants: Record<ButtonVariant, CSSProperties> = {
    primary: { background: 'var(--cw-ink)', color: 'var(--cw-surface)', borderColor: 'var(--cw-ink)' },
    accent: { background: 'var(--cw-accent)', color: 'var(--cw-surface)', borderColor: 'var(--cw-accent)' },
    outline: { background: 'transparent', color: 'var(--cw-ink)', borderColor: 'var(--cw-ink)' },
    ghost: { background: 'transparent', color: 'var(--cw-ink)', borderColor: 'var(--cw-line)' },
    quiet: { background: 'var(--cw-surface-alt)', color: 'var(--cw-ink)', borderColor: 'transparent' },
  };
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.985)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = ''; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
    >
      {children}
    </button>
  );
};

const GW_PARTNER_META: Record<string, { tint: string; initial: string }> = {
  Thorne: { tint: 'var(--cw-surface-alt)', initial: 'T' },
  BioTrust: { tint: 'var(--cw-surface-alt)', initial: 'B' },
  Organifi: { tint: 'var(--cw-surface-alt)', initial: 'O' },
};

interface PartnerButtonProps {
  partner: string;
  onClick?: () => void;
}

export const CWPartnerButton = ({ partner, onClick }: PartnerButtonProps) => {
  const meta = GW_PARTNER_META[partner] || { tint: 'var(--cw-surface-alt)', initial: partner.charAt(0) };
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 10, padding: '11px 14px 11px 11px',
        borderRadius: 12, border: '1px solid var(--cw-line)',
        background: 'var(--cw-surface)',
        fontFamily: 'var(--cw-font-body)', fontSize: 13, color: 'var(--cw-ink)',
        cursor: 'pointer', width: '100%', textAlign: 'left',
        transition: 'background 0.15s ease, border-color 0.15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--cw-ink)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--cw-line)'; }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 26, height: 26, borderRadius: 6,
          background: meta.tint,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--cw-font-display)', fontSize: 13,
          color: 'var(--cw-ink)', letterSpacing: '-0.02em',
        }}>{meta.initial}</span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 10, fontFamily: 'var(--cw-font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cw-ink-soft)' }}>Shop at</span>
          <span style={{ fontWeight: 500, fontSize: 13.5 }}>{partner}</span>
        </span>
      </span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M4 10 L10 4 M5 4 H10 V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </button>
  );
};

interface PriorityChipProps {
  priority: DesignPriority;
}

const AVOID_RED = '#C25B3F';

export const CWPriorityChip = ({ priority }: PriorityChipProps) => {
  const labels: Record<DesignPriority, string> = {
    essential: 'Essential',
    recommended: 'Recommended',
    optional: 'Optional',
    gap: 'Gap — no partner yet',
    avoid: 'Avoid',
  };
  const bg: Record<DesignPriority, string> = {
    essential: 'var(--cw-accent)',
    recommended: 'var(--cw-surface-alt)',
    optional: 'var(--cw-surface-alt)',
    gap: 'transparent',
    avoid: 'transparent',
  };
  const fg: Record<DesignPriority, string> = {
    essential: 'var(--cw-surface)',
    recommended: 'var(--cw-ink)',
    optional: 'var(--cw-ink-muted)',
    gap: 'var(--cw-ink-soft)',
    avoid: AVOID_RED,
  };
  const border: Record<DesignPriority, string> = {
    essential: 'var(--cw-accent)',
    recommended: 'transparent',
    optional: 'transparent',
    gap: 'var(--cw-line)',
    avoid: AVOID_RED,
  };
  const markers: Record<DesignPriority, string> = {
    essential: '●',
    recommended: '◐',
    optional: '○',
    gap: '—',
    avoid: '⚠',
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px',
      borderRadius: 999,
      border: `1px solid ${border[priority]}`,
      background: bg[priority],
      color: fg[priority],
      fontFamily: 'var(--cw-font-mono)',
      fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500,
    }}>
      <span>{markers[priority]}</span>
      <span style={{ marginLeft: 1 }}>{labels[priority]}</span>
    </span>
  );
};

export const SNP_DEF =
  'Single-nucleotide polymorphism — a spot in your DNA where people differ by one letter. Small change, sometimes big effect.';

interface CWTooltipProps {
  children: ReactNode;
  content: ReactNode;
  placement?: 'top' | 'bottom';
}

export const CWTooltip = ({ children, content, placement = 'top' }: CWTooltipProps) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setCoords({
        top: placement === 'top' ? r.top : r.bottom,
        left: r.left + r.width / 2,
      });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, placement]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      const el = triggerRef.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const popoverStyle: CSSProperties = coords
    ? {
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        transform:
          placement === 'top'
            ? 'translate(-50%, calc(-100% - 8px))'
            : 'translate(-50%, 8px)',
        background: 'var(--cw-surface)',
        color: 'var(--cw-ink)',
        border: '1px solid var(--cw-line)',
        borderRadius: 'var(--cw-r-sm)',
        boxShadow: 'var(--cw-shadow-md)',
        fontFamily: 'var(--cw-font-body)',
        fontSize: 12.5,
        lineHeight: 1.5,
        padding: '8px 12px',
        maxWidth: 280,
        zIndex: 100,
        pointerEvents: 'none',
      }
    : { display: 'none' };

  return (
    <>
      <span
        ref={triggerRef}
        tabIndex={0}
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        style={{
          textDecoration: 'underline dotted var(--cw-ink-soft)',
          textUnderlineOffset: 2,
          cursor: 'help',
        }}
      >
        {children}
      </span>
      {open && typeof document !== 'undefined'
        ? createPortal(
            <span id={tooltipId} role="tooltip" style={popoverStyle}>
              {content}
            </span>,
            document.body,
          )
        : null}
    </>
  );
};

export type { DesignPriority };
