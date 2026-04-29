import { useState, type ReactNode } from 'react';
import { CWPriorityChip, CWTooltip, SNP_DEF } from './ui';
import { getPartnerDisplayName } from '../lib/affiliateLinks';
import type { PartnerOption } from '../types';
import type { DesignCardSupplement, DesignCardVariant } from '../lib/designDataAdapter';

interface SupplementCardProps {
  supp: DesignCardSupplement;
}

export function SupplementCard({ supp }: SupplementCardProps) {
  const { name, tag, priority, dose, variants, reason, healthEffect, culturalContext, partnerOptions } = supp;
  const isGap = priority === 'gap';
  const isAvoid = priority === 'avoid';
  const suppressShop = isGap || isAvoid;

  return (
    <article style={{
      background: 'var(--cw-surface)',
      border: '1px solid var(--cw-line)',
      borderRadius: 20,
      overflow: 'hidden',
      opacity: isGap ? 0.85 : 1,
    }}>
      <div style={{
        padding: '18px 22px',
        borderBottom: '1px solid var(--cw-line)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
        background: 'var(--cw-surface-alt)',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--cw-font-mono)', fontSize: 10,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--cw-ink-soft)', marginBottom: 4,
          }}>{tag}</div>
          <h3 style={{
            margin: 0, fontFamily: 'var(--cw-font-display)',
            fontWeight: 400, fontSize: 26, lineHeight: 1,
            letterSpacing: 'var(--cw-display-letter)', color: 'var(--cw-ink)',
          }}>{name}</h3>
        </div>
        <CWPriorityChip priority={priority} />
      </div>
      <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!suppressShop && (
          <FieldPair label="Dose">{dose}</FieldPair>
        )}
        {variants.length > 0 && (
          <VariantList variants={variants} />
        )}
        <p style={{
          margin: 0, fontFamily: 'var(--cw-font-body)',
          fontSize: 14, lineHeight: 1.6, color: 'var(--cw-ink-muted)',
        }}>{reason}</p>
        {healthEffect && (
          <p style={{
            margin: 0, fontFamily: 'var(--cw-font-body)',
            fontSize: 14, lineHeight: 1.6, color: 'var(--cw-ink)',
          }}>{healthEffect}</p>
        )}
        {culturalContext && (
          <p style={{
            margin: 0,
            paddingLeft: 12,
            borderLeft: '2px solid var(--cw-accent-soft)',
            fontFamily: 'var(--cw-font-body)',
            fontSize: 13, lineHeight: 1.6,
            fontStyle: 'italic',
            color: 'var(--cw-ink-muted)',
          }}>{culturalContext}</p>
        )}
        {!suppressShop && partnerOptions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {partnerOptions.map((opt, i) => (
              <PartnerRow key={`${opt.partner}-${i}`} opt={opt} />
            ))}
          </div>
        )}
        {isGap && <GapNote />}
      </div>
    </article>
  );
}

function PartnerRow({ opt }: { opt: PartnerOption }) {
  const partnerLabel = getPartnerDisplayName(opt.partner);
  const hasStrike =
    !!opt.originalPriceDisplay && opt.originalPriceDisplay !== opt.priceDisplay;

  function openProduct() {
    window.open(opt.productUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: 10,
      border: '1px solid var(--cw-line)',
      borderRadius: 14,
      background: 'var(--cw-surface)',
    }}>
      <div style={{
        width: 60, height: 60,
        flexShrink: 0,
        borderRadius: 10,
        background: 'var(--cw-surface-alt)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <img
          src={opt.imageUrl}
          alt=""
          style={{
            maxWidth: '100%', maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
          loading="lazy"
        />
      </div>
      <div style={{
        flex: 1, minWidth: 0,
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <span style={{
          fontFamily: 'var(--cw-font-mono)', fontSize: 10,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--cw-ink-soft)',
        }}>{partnerLabel}</span>
        <span
          title={opt.productName}
          style={{
            fontFamily: 'var(--cw-font-body)', fontSize: 13.5,
            color: 'var(--cw-ink)', fontWeight: 500,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}
        >{opt.productName}</span>
        <span style={{
          display: 'flex', alignItems: 'baseline', gap: 6,
          fontFamily: 'var(--cw-font-body)',
        }}>
          <span style={{ fontSize: 14, color: 'var(--cw-ink)', fontWeight: 500 }}>
            {opt.priceDisplay}
          </span>
          {hasStrike && (
            <span style={{
              fontSize: 12,
              color: 'var(--cw-ink-soft)',
              textDecoration: 'line-through',
            }}>
              {opt.originalPriceDisplay}
            </span>
          )}
        </span>
      </div>
      <button
        type="button"
        onClick={openProduct}
        style={{
          flexShrink: 0,
          padding: '9px 16px',
          borderRadius: 999,
          border: '1px solid var(--cw-ink)',
          background: 'transparent',
          color: 'var(--cw-ink)',
          fontFamily: 'var(--cw-font-body)',
          fontSize: 13, fontWeight: 500,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          transition: 'background 0.15s ease, color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--cw-ink)';
          e.currentTarget.style.color = 'var(--cw-surface)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--cw-ink)';
        }}
      >
        <span>Shop</span>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M4 10 L10 4 M5 4 H10 V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function VariantList({ variants }: { variants: DesignCardVariant[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <span style={{
        fontFamily: 'var(--cw-font-mono)', fontSize: 10,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--cw-ink-soft)',
      }}>
        <CWTooltip content={SNP_DEF}>Your Variants</CWTooltip>
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {variants.map((v) => (
          <VariantRow key={`${v.variantLabel}-${v.firedGenotype}`} v={v} />
        ))}
      </div>
    </div>
  );
}

function VariantRow({ v }: { v: DesignCardVariant }) {
  const [hover, setHover] = useState(false);
  const labelColor = hover ? 'var(--cw-accent)' : 'var(--cw-ink)';
  const descColor = hover ? 'var(--cw-accent)' : 'var(--cw-ink-muted)';
  const borderColor = hover ? 'var(--cw-accent)' : 'var(--cw-ink-muted)';
  const tagStyle = {
    fontFamily: 'var(--cw-font-mono)',
    fontSize: 10,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'var(--cw-ink-soft)',
  };
  return (
    <a
      href={v.citationUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        display: 'block',
        padding: '6px 0',
        textDecoration: 'none',
        borderBottom: `1px dashed ${borderColor}`,
        fontFamily: 'var(--cw-font-body)',
        fontSize: 13,
        lineHeight: 1.5,
        transition: 'border-color 0.15s ease',
      }}
    >
      <strong style={{ fontWeight: 600, color: labelColor, transition: 'color 0.15s ease' }}>
        {v.variantLabel}
      </strong>
      <span style={{ color: 'var(--cw-ink-soft)' }}>
        {' ('}
      </span>
      <span style={tagStyle}>Normal:</span>
      <span style={{ color: labelColor, transition: 'color 0.15s ease' }}>
        {' '}{v.referenceGenotype}
      </span>
      <span style={{ color: 'var(--cw-ink-soft)' }}>{' · '}</span>
      <span style={tagStyle}>Yours:</span>
      <span style={{ color: labelColor, transition: 'color 0.15s ease' }}>
        {' '}{v.firedGenotype}
      </span>
      <span style={{ color: 'var(--cw-ink-soft)' }}>{')'}</span>
      <span style={{ color: descColor, transition: 'color 0.15s ease' }}>
        : {v.description}
      </span>
    </a>
  );
}

function FieldPair({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
      <span style={{
        fontFamily: 'var(--cw-font-mono)', fontSize: 10,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--cw-ink-soft)',
      }}>{label}</span>
      <span style={{
        fontFamily: 'var(--cw-font-body)', fontSize: 13,
        color: 'var(--cw-ink)',
      }}>{children}</span>
    </div>
  );
}

function GapNote() {
  return (
    <div style={{
      padding: '12px 14px',
      border: '1px dashed var(--cw-line)',
      borderRadius: 12,
      fontFamily: 'var(--cw-font-body)',
      fontSize: 13, color: 'var(--cw-ink-muted)',
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      <span style={{
        fontFamily: 'var(--cw-font-mono)', fontSize: 10,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--cw-ink-soft)', marginTop: 2, whiteSpace: 'nowrap',
      }}>No shop yet</span>
      <span>We'll email you when a partner we trust carries a third-party-tested version.</span>
    </div>
  );
}
