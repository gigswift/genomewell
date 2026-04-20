import type { ReactNode } from 'react';
import { GWPartnerButton, GWPriorityChip } from './ui';
import { buildAffiliateUrl } from '../lib/affiliateLinks';
import type { DesignCardSupplement } from '../lib/designDataAdapter';

interface SupplementCardProps {
  supp: DesignCardSupplement;
}

export function SupplementCard({ supp }: SupplementCardProps) {
  const { name, tag, priority, dose, snps, reason, partners, partnerOptions } = supp;
  const isGap = priority === 'gap';
  const isAvoid = priority === 'avoid';
  const suppressShop = isGap || isAvoid;

  function openPartner(index: number) {
    const opt = partnerOptions[index];
    if (!opt) return;
    const url = buildAffiliateUrl(opt.partner, opt.productSlug);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <article style={{
      background: 'var(--gw-surface)',
      border: '1px solid var(--gw-line)',
      borderRadius: 20,
      overflow: 'hidden',
      opacity: isGap ? 0.85 : 1,
    }}>
      <div style={{
        padding: '18px 22px',
        borderBottom: '1px solid var(--gw-line)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
        background: 'var(--gw-surface-alt)',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--gw-font-mono)', fontSize: 10,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--gw-ink-soft)', marginBottom: 4,
          }}>{tag}</div>
          <h3 style={{
            margin: 0, fontFamily: 'var(--gw-font-display)',
            fontWeight: 400, fontSize: 26, lineHeight: 1,
            letterSpacing: 'var(--gw-display-letter)', color: 'var(--gw-ink)',
          }}>{name}</h3>
        </div>
        <GWPriorityChip priority={priority} />
      </div>
      <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!suppressShop && (
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <FieldPair label="Dose">{dose}</FieldPair>
            {snps.length > 0 && <FieldPair label="Variants">{snps.join(' · ')}</FieldPair>}
          </div>
        )}
        {suppressShop && snps.length > 0 && (
          <FieldPair label="Variants">{snps.join(' · ')}</FieldPair>
        )}
        <p style={{
          margin: 0, fontFamily: 'var(--gw-font-body)',
          fontSize: 14, lineHeight: 1.6, color: 'var(--gw-ink-muted)',
        }}>{reason}</p>
        {!suppressShop && partners.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${partners.length}, 1fr)`,
            gap: 8,
          }}>
            {partners.map((p, i) => (
              <GWPartnerButton key={`${p}-${i}`} partner={p} onClick={() => openPartner(i)} />
            ))}
          </div>
        )}
        {isGap && <GapNote />}
      </div>
    </article>
  );
}

function FieldPair({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
      <span style={{
        fontFamily: 'var(--gw-font-mono)', fontSize: 10,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--gw-ink-soft)',
      }}>{label}</span>
      <span style={{
        fontFamily: 'var(--gw-font-body)', fontSize: 13,
        color: 'var(--gw-ink)',
      }}>{children}</span>
    </div>
  );
}

function GapNote() {
  return (
    <div style={{
      padding: '12px 14px',
      border: '1px dashed var(--gw-line)',
      borderRadius: 12,
      fontFamily: 'var(--gw-font-body)',
      fontSize: 13, color: 'var(--gw-ink-muted)',
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      <span style={{
        fontFamily: 'var(--gw-font-mono)', fontSize: 10,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--gw-ink-soft)', marginTop: 2, whiteSpace: 'nowrap',
      }}>No shop yet</span>
      <span>We'll email you when a partner we trust carries a third-party-tested version.</span>
    </div>
  );
}
