// Results dashboard — archetype hero + tab navigation + supplement list
// Supports three nav layouts: "tabs" (segmented), "underline" (classic tabs), "sidebar" (desktop)

const CWDashboard = ({ surface = 'mobile', navStyle = 'underline', cardLayout = 'editorial', density = 'comfortable' }) => {
  const [tab, setTab] = React.useState('daily');
  const isMobile = surface === 'mobile';
  const supplements = GW_SUPPLEMENTS[tab] || [];

  // show sidebar only on desktop
  const effectiveNav = isMobile && navStyle === 'sidebar' ? 'underline' : navStyle;

  return (
    <div style={{
      background: 'var(--cw-bg)', color: 'var(--cw-ink)',
      fontFamily: 'var(--cw-font-body)', minHeight: '100%',
    }}>
      {/* top bar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '68px 22px 14px' : '20px 48px',
        borderBottom: '1px solid var(--cw-line)',
        background: 'var(--cw-bg)',
        position: 'sticky', top: 0, zIndex: 5,
      }}>
        <CWLogo size={isMobile ? 16 : 18} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CWPrivacyLockup variant="badge" dense />
          {!isMobile && (
            <button style={{
              padding: '6px 14px', borderRadius: 999,
              border: '1px solid var(--cw-line)', background: 'var(--cw-surface)',
              fontFamily: 'var(--cw-font-body)', fontSize: 13, color: 'var(--cw-ink)',
              cursor: 'pointer',
            }}>Re-analyze</button>
          )}
        </div>
      </header>

      <div style={{
        display: effectiveNav === 'sidebar' && !isMobile ? 'grid' : 'block',
        gridTemplateColumns: effectiveNav === 'sidebar' && !isMobile ? '240px 1fr' : undefined,
      }}>
        {/* sidebar (desktop only) */}
        {effectiveNav === 'sidebar' && !isMobile && (
          <aside style={{
            borderRight: '1px solid var(--cw-line)',
            padding: '32px 18px', position: 'sticky', top: 60,
            alignSelf: 'start', height: 'calc(100vh - 60px)',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{
              fontFamily: 'var(--cw-font-mono)', fontSize: 10,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--cw-inkSoft)', padding: '0 12px 12px',
            }}>Your plan</div>
            {GW_TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 10,
                background: tab === t.id ? 'var(--cw-surfaceAlt)' : 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'var(--cw-font-body)', fontSize: 14,
                color: tab === t.id ? 'var(--cw-ink)' : 'var(--cw-inkMuted)',
                fontWeight: tab === t.id ? 500 : 400,
              }}>
                <span style={{ fontFamily: 'var(--cw-font-mono)', color: 'var(--cw-accent)' }}>{t.glyph}</span>
                <span>{t.label}</span>
                <span style={{
                  marginLeft: 'auto', fontFamily: 'var(--cw-font-mono)', fontSize: 11,
                  color: 'var(--cw-inkSoft)',
                }}>{GW_SUPPLEMENTS[t.id].length}</span>
              </button>
            ))}
          </aside>
        )}

        {/* main column */}
        <main>
          {/* Archetype hero */}
          <ArchetypeHero surface={surface} />

          {/* tab nav (horizontal modes) */}
          {effectiveNav !== 'sidebar' && (
            <TabNav surface={surface} tab={tab} setTab={setTab} style={effectiveNav} />
          )}

          {/* card list */}
          <section style={{
            padding: isMobile ? '20px 22px 48px' : '32px 48px 64px',
            maxWidth: isMobile ? '100%' : (effectiveNav === 'sidebar' ? 820 : 980),
            margin: '0 auto',
            display: 'grid',
            gap: density === 'compact' ? 12 : 16,
            gridTemplateColumns:
              !isMobile && cardLayout === 'compact' ? 'repeat(2, 1fr)' : '1fr',
          }}>
            {supplements.map((s, i) => (
              <CWSupplementCard key={s.name} supp={s} layout={cardLayout} />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

const ArchetypeHero = ({ surface }) => {
  const isMobile = surface === 'mobile';
  return (
    <section style={{
      padding: isMobile ? '28px 22px 24px' : '48px 48px 32px',
      maxWidth: isMobile ? '100%' : 980,
      margin: '0 auto',
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap',
        fontFamily: 'var(--cw-font-mono)', fontSize: 11,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--cw-inkSoft)', marginBottom: isMobile ? 14 : 20,
      }}>
        <span>Your archetype</span>
        <span style={{ color: 'var(--cw-accent)' }}>● Ready</span>
      </div>
      <h1 style={{
        margin: 0,
        fontFamily: 'var(--cw-font-display)',
        fontWeight: 'var(--cw-display-weight)',
        fontSize: isMobile ? 36 : 56,
        lineHeight: 1.02,
        letterSpacing: 'var(--cw-display-letter)',
        color: 'var(--cw-ink)',
        textWrap: 'balance',
      }}>
        <em style={{ fontStyle: 'italic', color: 'var(--cw-accent)' }}>{GW_ARCHETYPE.name.split(',')[0]}</em>,<br/>
        <span>{GW_ARCHETYPE.name.split(',')[1]?.trim()}.</span>
      </h1>
      <p style={{
        marginTop: isMobile ? 14 : 18,
        maxWidth: isMobile ? '100%' : 640,
        fontSize: isMobile ? 15 : 17,
        lineHeight: 1.55, color: 'var(--cw-inkMuted)',
        textWrap: 'pretty',
      }}>{GW_ARCHETYPE.subtitle}</p>

      {/* stats row */}
      <div style={{
        marginTop: isMobile ? 22 : 32,
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? '18px 18px' : 0,
        borderTop: '1px solid var(--cw-line)',
        borderBottom: isMobile ? 'none' : '1px solid var(--cw-line)',
        paddingTop: 18, paddingBottom: isMobile ? 0 : 18,
      }}>
        {GW_ARCHETYPE.stats.map((s, i) => (
          <div key={s.k} style={{
            display: 'flex', flexDirection: 'column', gap: 4,
            paddingLeft: !isMobile && i > 0 ? 24 : 0,
            borderLeft: !isMobile && i > 0 ? '1px solid var(--cw-line)' : 'none',
          }}>
            <span style={{
              fontFamily: 'var(--cw-font-display)',
              fontWeight: 'var(--cw-display-weight)',
              fontSize: isMobile ? 26 : 32,
              letterSpacing: 'var(--cw-display-letter)',
              color: 'var(--cw-ink)', lineHeight: 1,
            }}>{s.v}</span>
            <span style={{
              fontFamily: 'var(--cw-font-mono)', fontSize: 10,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--cw-inkSoft)',
            }}>{s.k}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const TabNav = ({ surface, tab, setTab, style }) => {
  const isMobile = surface === 'mobile';

  if (style === 'segmented') {
    return (
      <div style={{
        padding: isMobile ? '0 22px' : '0 48px',
        maxWidth: isMobile ? '100%' : 980,
        margin: '0 auto',
      }}>
        <div style={{
          display: 'flex',
          background: 'var(--cw-surfaceAlt)',
          border: '1px solid var(--cw-line)',
          borderRadius: 14,
          padding: 4,
          gap: 2,
          overflowX: 'auto',
        }}>
          {GW_TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, minWidth: 'max-content',
              padding: isMobile ? '10px 12px' : '10px 16px',
              borderRadius: 10, border: 'none',
              background: tab === t.id ? 'var(--cw-surface)' : 'transparent',
              boxShadow: tab === t.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              fontFamily: 'var(--cw-font-body)',
              fontSize: isMobile ? 12.5 : 13.5,
              color: tab === t.id ? 'var(--cw-ink)' : 'var(--cw-inkMuted)',
              fontWeight: tab === t.id ? 500 : 400,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}>{t.label}</button>
          ))}
        </div>
      </div>
    );
  }

  // underline (default)
  return (
    <div style={{
      padding: isMobile ? '0' : '0 48px',
      maxWidth: isMobile ? '100%' : 980,
      margin: '0 auto',
      borderBottom: '1px solid var(--cw-line)',
      overflowX: 'auto',
    }}>
      <div style={{
        display: 'flex', gap: isMobile ? 20 : 32,
        padding: isMobile ? '0 22px' : '0',
        minWidth: 'max-content',
      }}>
        {GW_TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: isMobile ? '14px 0 12px' : '16px 0 14px',
            border: 'none', background: 'transparent',
            borderBottom: `2px solid ${tab === t.id ? 'var(--cw-accent)' : 'transparent'}`,
            fontFamily: 'var(--cw-font-body)',
            fontSize: isMobile ? 13.5 : 14.5,
            color: tab === t.id ? 'var(--cw-ink)' : 'var(--cw-inkMuted)',
            fontWeight: tab === t.id ? 500 : 400,
            cursor: 'pointer', whiteSpace: 'nowrap',
            transition: 'color 0.15s ease, border-color 0.15s ease',
          }}>
            {t.label}
            <span style={{
              marginLeft: 8,
              fontFamily: 'var(--cw-font-mono)', fontSize: 11,
              color: 'var(--cw-inkSoft)',
            }}>{GW_SUPPLEMENTS[t.id].length}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { CWDashboard, ArchetypeHero, TabNav });
