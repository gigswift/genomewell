// Shared GenomeWell UI pieces — wordmark, privacy lockup, buttons, glyphs, placeholders.

const GWLogo = ({ size = 20, color }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    fontFamily: 'var(--gw-font-display)',
    fontWeight: 'var(--gw-display-weight)',
    fontSize: size, letterSpacing: 'var(--gw-display-letter)',
    color: color || 'var(--gw-ink)', lineHeight: 1,
  }}>
    <GWMark size={Math.round(size * 1.1)} />
    <span>genomewell</span>
  </div>
);

// Brand mark: an inward-spiraling ring — double-helix reference kept abstract
const GWMark = ({ size = 22, color }) => {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="11" cy="11" r="10" stroke={color || 'var(--gw-ink)'} strokeWidth="1.2" />
      <path d="M3 8 C 8 8, 14 14, 19 14" stroke={color || 'var(--gw-ink)'} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M3 14 C 8 14, 14 8, 19 8" stroke={color || 'var(--gw-ink)'} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
};

// Privacy lockup — three variants. Used in header, hero, and cards.
const GWPrivacyLockup = ({ variant = 'inline', dense = false }) => {
  const lockIcon = (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <rect x="1" y="6" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M3 6 V4 a3 3 0 0 1 6 0 V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="6" cy="9.5" r="0.9" fill="currentColor"/>
    </svg>
  );

  if (variant === 'badge') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: dense ? '4px 9px' : '6px 12px',
        border: '1px solid var(--gw-line)',
        borderRadius: 999,
        fontFamily: 'var(--gw-font-mono)',
        fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase',
        color: 'var(--gw-inkMuted)', background: 'transparent',
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
        fontFamily: 'var(--gw-font-mono)',
        fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--gw-inkSoft)',
      }}>
        <span style={{ flex: 1, height: 1, background: 'var(--gw-line)' }}/>
        {lockIcon}
        <span>Your DNA never leaves your device</span>
        <span style={{ flex: 1, height: 1, background: 'var(--gw-line)' }}/>
      </div>
    );
  }
  // inline
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: 'var(--gw-font-mono)',
      fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
      color: 'var(--gw-inkMuted)',
    }}>
      {lockIcon}
      <span>100% on-device</span>
    </span>
  );
};

// Primary / secondary / ghost button
const GWButton = ({ variant = 'primary', size = 'md', children, onClick, full, disabled, style = {} }) => {
  const sizes = {
    sm: { p: '9px 14px', fs: 13 },
    md: { p: '13px 18px', fs: 14 },
    lg: { p: '16px 24px', fs: 15 },
  };
  const s = sizes[size];
  const base = {
    fontFamily: 'var(--gw-font-body)',
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
  const variants = {
    primary: { background: 'var(--gw-ink)', color: 'var(--gw-surface)', borderColor: 'var(--gw-ink)' },
    accent: { background: 'var(--gw-accent)', color: 'var(--gw-surface)', borderColor: 'var(--gw-accent)' },
    outline: { background: 'transparent', color: 'var(--gw-ink)', borderColor: 'var(--gw-ink)' },
    ghost: { background: 'transparent', color: 'var(--gw-ink)', borderColor: 'var(--gw-line)' },
    quiet: { background: 'var(--gw-surfaceAlt)', color: 'var(--gw-ink)', borderColor: 'transparent' },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.985)')}
      onMouseUp={e => (e.currentTarget.style.transform = '')}
      onMouseLeave={e => (e.currentTarget.style.transform = '')}
    >
      {children}
    </button>
  );
};

// Partner shop CTA — no logos, just the label and a small neutral chip.
// Partner visual order: rotate through a muted chip color per partner.
const GW_PARTNER_META = {
  Thorne:   { tint: 'var(--gw-surfaceAlt)', initial: 'T' },
  BioTrust: { tint: 'var(--gw-surfaceAlt)', initial: 'B' },
  Organifi: { tint: 'var(--gw-surfaceAlt)', initial: 'O' },
};

const GWPartnerButton = ({ partner, onClick }) => {
  const meta = GW_PARTNER_META[partner] || { tint: 'var(--gw-surfaceAlt)', initial: partner[0] };
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 10, padding: '11px 14px 11px 11px',
      borderRadius: 12, border: '1px solid var(--gw-line)',
      background: 'var(--gw-surface)',
      fontFamily: 'var(--gw-font-body)', fontSize: 13, color: 'var(--gw-ink)',
      cursor: 'pointer', width: '100%', textAlign: 'left',
      transition: 'background 0.15s ease, border-color 0.15s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gw-ink)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gw-line)'; }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 26, height: 26, borderRadius: 6,
          background: meta.tint,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--gw-font-display)', fontSize: 13,
          color: 'var(--gw-ink)', letterSpacing: '-0.02em',
        }}>{meta.initial}</span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 10, fontFamily: 'var(--gw-font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gw-inkSoft)' }}>Shop at</span>
          <span style={{ fontWeight: 500, fontSize: 13.5 }}>{partner}</span>
        </span>
      </span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M4 10 L10 4 M5 4 H10 V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </button>
  );
};

// Priority chip (essential / recommended / optional / gap)
const GWPriorityChip = ({ priority }) => {
  const labels = {
    essential: 'Essential',
    recommended: 'Recommended',
    optional: 'Optional',
    gap: 'Gap — no partner yet',
  };
  const bg = {
    essential: 'var(--gw-accent)',
    recommended: 'var(--gw-surfaceAlt)',
    optional: 'var(--gw-surfaceAlt)',
    gap: 'transparent',
  };
  const fg = {
    essential: 'var(--gw-surface)',
    recommended: 'var(--gw-ink)',
    optional: 'var(--gw-inkMuted)',
    gap: 'var(--gw-inkSoft)',
  };
  const border = {
    essential: 'var(--gw-accent)',
    recommended: 'transparent',
    optional: 'transparent',
    gap: 'var(--gw-line)',
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px',
      borderRadius: 999,
      border: `1px solid ${border[priority]}`,
      background: bg[priority],
      color: fg[priority],
      fontFamily: 'var(--gw-font-mono)',
      fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500,
    }}>
      {priority === 'essential' && '●'}
      {priority === 'recommended' && '◐'}
      {priority === 'optional' && '○'}
      {priority === 'gap' && '—'}
      <span style={{ marginLeft: 1 }}>{labels[priority]}</span>
    </span>
  );
};

// Stripe placeholder for anywhere we'd have imagery
const GWStripe = ({ label = 'imagery', height = 120, angle = -35, style = {} }) => (
  <div style={{
    height, borderRadius: 14, overflow: 'hidden', position: 'relative',
    background: `repeating-linear-gradient(${angle}deg, var(--gw-surfaceAlt) 0 14px, var(--gw-surface) 14px 28px)`,
    border: '1px solid var(--gw-line)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    ...style,
  }}>
    <span style={{
      fontFamily: 'var(--gw-font-mono)', fontSize: 10,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: 'var(--gw-inkSoft)',
      background: 'var(--gw-surface)', padding: '4px 10px', borderRadius: 999,
      border: '1px solid var(--gw-line)',
    }}>{label}</span>
  </div>
);

Object.assign(window, {
  GWLogo, GWMark, GWPrivacyLockup, GWButton,
  GWPartnerButton, GWPriorityChip, GWStripe,
});
