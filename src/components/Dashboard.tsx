import { useEffect, useState } from 'react';
import { GWLogo, GWPrivacyLockup } from './ui';
import { SupplementCard } from './SupplementCard';
import { toDesignCards } from '../lib/designDataAdapter';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../lib/supplementLabels';
import type {
  Genotype,
  GroupedRecommendations,
  SNPResult,
  SupplementCategory,
  SupplementRecommendation,
} from '../types';

interface DashboardProps {
  grouped: GroupedRecommendations;
  parsedDNA: SNPResult[];
  snpMap: Map<string, Genotype>;
  onReset: () => void;
}

function useIsMobile(breakpoint = 780): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}

export function Dashboard({ grouped, parsedDNA, snpMap, onReset }: DashboardProps) {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<SupplementCategory>('daily-wellness');

  const allRecs: SupplementRecommendation[] = CATEGORY_ORDER.flatMap(
    (c) => grouped[c],
  );
  const snpsAnalyzed = parsedDNA.length;
  const variantsMatched = new Set(allRecs.flatMap((r) => r.firedPrimary)).size;
  const essentialPicks = allRecs.filter((r) => r.priority === 'essential').length;

  const recsForTab = grouped[tab];
  const cards = toDesignCards(recsForTab, snpMap);

  return (
    <div style={{
      background: 'var(--gw-bg)', color: 'var(--gw-ink)',
      fontFamily: 'var(--gw-font-body)', minHeight: '100vh',
    }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '28px 22px 14px' : '20px 48px',
        borderBottom: '1px solid var(--gw-line)',
        background: 'var(--gw-bg)',
        position: 'sticky', top: 0, zIndex: 5,
      }}>
        <GWLogo size={isMobile ? 16 : 18} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <GWPrivacyLockup variant="badge" dense />
          <button
            type="button"
            onClick={onReset}
            style={{
              padding: '6px 14px', borderRadius: 999,
              border: '1px solid var(--gw-line)', background: 'var(--gw-surface)',
              fontFamily: 'var(--gw-font-body)', fontSize: 13, color: 'var(--gw-ink)',
              cursor: 'pointer',
            }}
          >Re-analyze</button>
        </div>
      </header>

      <PlaceholderHero
        isMobile={isMobile}
        snpsAnalyzed={snpsAnalyzed}
        variantsMatched={variantsMatched}
        essentialPicks={essentialPicks}
      />

      <div style={{
        padding: isMobile ? '0 22px' : '0 48px',
        maxWidth: isMobile ? '100%' : 980,
        margin: '0 auto 8px',
      }}>
        <GWPrivacyLockup variant="rule" />
      </div>

      <TabNav
        isMobile={isMobile}
        tab={tab}
        setTab={setTab}
        counts={Object.fromEntries(
          CATEGORY_ORDER.map((c) => [c, grouped[c].length]),
        ) as Record<SupplementCategory, number>}
      />

      <section style={{
        padding: isMobile ? '20px 22px 48px' : '32px 48px 64px',
        maxWidth: isMobile ? '100%' : 980,
        margin: '0 auto',
        display: 'grid',
        gap: 16,
        gridTemplateColumns: '1fr',
      }}>
        {cards.length === 0 && (
          <div style={{
            padding: '40px 22px',
            textAlign: 'center',
            border: '1px dashed var(--gw-line)',
            borderRadius: 20,
            color: 'var(--gw-ink-muted)',
            fontSize: 14,
          }}>
            No recommendations in this category from your variants.
          </div>
        )}
        {cards.map((c) => (
          <SupplementCard key={c.name} supp={c} />
        ))}
      </section>
    </div>
  );
}

interface HeroProps {
  isMobile: boolean;
  snpsAnalyzed: number;
  variantsMatched: number;
  essentialPicks: number;
}

function PlaceholderHero({
  isMobile,
  snpsAnalyzed,
  variantsMatched,
  essentialPicks,
}: HeroProps) {
  const stats = [
    { k: 'SNPs analyzed', v: snpsAnalyzed.toLocaleString() },
    { k: 'Variants matched', v: variantsMatched.toString() },
    { k: 'Essential picks', v: essentialPicks.toString() },
    { k: 'Processed locally', v: '100%' },
  ];
  return (
    <section style={{
      padding: isMobile ? '28px 22px 24px' : '48px 48px 32px',
      maxWidth: isMobile ? '100%' : 980,
      margin: '0 auto',
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap',
        fontFamily: 'var(--gw-font-mono)', fontSize: 11,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--gw-ink-soft)', marginBottom: isMobile ? 14 : 20,
      }}>
        <span>Your results</span>
        <span style={{ color: 'var(--gw-accent)' }}>● Ready</span>
      </div>
      <h1 style={{
        margin: 0,
        fontFamily: 'var(--gw-font-display)',
        fontWeight: 400,
        fontSize: isMobile ? 36 : 56,
        lineHeight: 1.02,
        letterSpacing: 'var(--gw-display-letter)',
        color: 'var(--gw-ink)',
      }}>
        Your DNA analysis is{' '}
        <em style={{ fontStyle: 'italic', color: 'var(--gw-accent)' }}>complete.</em>
      </h1>
      <p style={{
        marginTop: isMobile ? 14 : 18,
        maxWidth: isMobile ? '100%' : 640,
        fontSize: isMobile ? 15 : 17,
        lineHeight: 1.55, color: 'var(--gw-ink-muted)',
      }}>
        We read your file on this device and ranked every supplement by how clearly your variants support it. Start with the essentials — the rest is honest context.
      </p>

      <div style={{
        marginTop: isMobile ? 22 : 32,
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? '18px 18px' : 0,
        borderTop: '1px solid var(--gw-line)',
        borderBottom: isMobile ? 'none' : '1px solid var(--gw-line)',
        paddingTop: 18,
        paddingBottom: isMobile ? 0 : 18,
      }}>
        {stats.map((s, i) => (
          <div key={s.k} style={{
            display: 'flex', flexDirection: 'column', gap: 4,
            paddingLeft: !isMobile && i > 0 ? 24 : 0,
            borderLeft: !isMobile && i > 0 ? '1px solid var(--gw-line)' : 'none',
          }}>
            <span style={{
              fontFamily: 'var(--gw-font-display)',
              fontWeight: 400,
              fontSize: isMobile ? 26 : 32,
              letterSpacing: 'var(--gw-display-letter)',
              color: 'var(--gw-ink)', lineHeight: 1,
            }}>{s.v}</span>
            <span style={{
              fontFamily: 'var(--gw-font-mono)', fontSize: 10,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--gw-ink-soft)',
            }}>{s.k}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

interface TabNavProps {
  isMobile: boolean;
  tab: SupplementCategory;
  setTab: (t: SupplementCategory) => void;
  counts: Record<SupplementCategory, number>;
}

function TabNav({ isMobile, tab, setTab, counts }: TabNavProps) {
  return (
    <div style={{
      padding: isMobile ? '12px 22px 0' : '16px 48px 0',
      maxWidth: isMobile ? '100%' : 980,
      margin: '0 auto',
    }}>
      <div style={{
        display: 'flex',
        background: 'var(--gw-surface-alt)',
        border: '1px solid var(--gw-line)',
        borderRadius: 14,
        padding: 4,
        gap: 2,
        overflowX: 'auto',
      }}>
        {CATEGORY_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            style={{
              flex: 1, minWidth: 'max-content',
              padding: isMobile ? '10px 12px' : '10px 16px',
              borderRadius: 10, border: 'none',
              background: tab === id ? 'var(--gw-surface)' : 'transparent',
              boxShadow: tab === id ? '0 1px 2px rgba(0,0,0,0.22)' : 'none',
              fontFamily: 'var(--gw-font-body)',
              fontSize: isMobile ? 12.5 : 13.5,
              color: tab === id ? 'var(--gw-ink)' : 'var(--gw-ink-muted)',
              fontWeight: tab === id ? 500 : 400,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              justifyContent: 'center',
            }}
          >
            <span>{CATEGORY_LABELS[id]}</span>
            <span style={{
              fontFamily: 'var(--gw-font-mono)',
              fontSize: 10, color: 'var(--gw-ink-soft)',
            }}>{counts[id]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
