// Supplement card — three layout variants: "editorial" (default), "compact", "stacked"

const GWSupplementCard = ({ supp, layout = 'editorial' }) => {
  const { name, tag, priority, dose, snps, reason, partners } = supp;
  const isGap = priority === 'gap';

  if (layout === 'compact') {
    return (
      <article style={{
        background: 'var(--gw-surface)',
        border: '1px solid var(--gw-line)',
        borderRadius: 18,
        padding: 18,
        display: 'flex', flexDirection: 'column', gap: 12,
        opacity: isGap ? 0.82 : 1,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--gw-font-mono)', fontSize: 10,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--gw-inkSoft)',
            }}>{tag}</div>
            <h3 style={{
              margin: 0, fontFamily: 'var(--gw-font-display)',
              fontWeight: 'var(--gw-display-weight)',
              fontSize: 22, lineHeight: 1.1,
              letterSpacing: 'var(--gw-display-letter)',
              color: 'var(--gw-ink)',
            }}>{name}</h3>
          </div>
          <GWPriorityChip priority={priority} />
        </div>
        <p style={{
          margin: 0, fontFamily: 'var(--gw-font-body)',
          fontSize: 13.5, lineHeight: 1.55, color: 'var(--gw-inkMuted)',
        }}>{reason}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontFamily: 'var(--gw-font-mono)', fontSize: 11, color: 'var(--gw-inkSoft)' }}>
          {!isGap && <><span>{dose}</span><span>·</span></>}
          <span>{snps.join(' · ')}</span>
        </div>
        {!isGap && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {partners.map(p => <GWPartnerButton key={p} partner={p} />)}
          </div>
        )}
        {isGap && <GapNote />}
      </article>
    );
  }

  if (layout === 'stacked') {
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
          background: 'var(--gw-surfaceAlt)',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--gw-font-mono)', fontSize: 10,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--gw-inkSoft)', marginBottom: 4,
            }}>{tag}</div>
            <h3 style={{
              margin: 0, fontFamily: 'var(--gw-font-display)',
              fontWeight: 'var(--gw-display-weight)', fontSize: 26, lineHeight: 1,
              letterSpacing: 'var(--gw-display-letter)', color: 'var(--gw-ink)',
            }}>{name}</h3>
          </div>
          <GWPriorityChip priority={priority} />
        </div>
        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!isGap && (
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
              <FieldPair label="Dose">{dose}</FieldPair>
              <FieldPair label="Variants">{snps.join(' · ')}</FieldPair>
            </div>
          )}
          {isGap && <FieldPair label="Variants">{snps.join(' · ')}</FieldPair>}
          <p style={{
            margin: 0, fontFamily: 'var(--gw-font-body)',
            fontSize: 14, lineHeight: 1.6, color: 'var(--gw-inkMuted)',
          }}>{reason}</p>
          {!isGap && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${partners.length}, 1fr)`, gap: 8 }}>
              {partners.map(p => <GWPartnerButton key={p} partner={p} />)}
            </div>
          )}
          {isGap && <GapNote />}
        </div>
      </article>
    );
  }

  // editorial (default)
  return (
    <article style={{
      background: 'var(--gw-surface)',
      border: '1px solid var(--gw-line)',
      borderRadius: 22,
      padding: 24,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '18px 22px',
      opacity: isGap ? 0.88 : 1,
      position: 'relative',
    }}>
      {/* priority chip — top right */}
      <div style={{ gridColumn: 2, gridRow: 1, alignSelf: 'start' }}>
        <GWPriorityChip priority={priority} />
      </div>

      {/* name + tag */}
      <div style={{ gridColumn: 1, gridRow: 1 }}>
        <div style={{
          fontFamily: 'var(--gw-font-mono)', fontSize: 10,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--gw-inkSoft)', marginBottom: 6,
        }}>{tag}</div>
        <h3 style={{
          margin: 0, fontFamily: 'var(--gw-font-display)',
          fontWeight: 'var(--gw-display-weight)',
          fontSize: 28, lineHeight: 1.05,
          letterSpacing: 'var(--gw-display-letter)',
          color: 'var(--gw-ink)',
        }}>{name}</h3>
      </div>

      {/* reason */}
      <p style={{
        gridColumn: '1 / -1',
        margin: 0,
        fontFamily: 'var(--gw-font-body)',
        fontSize: 14.5, lineHeight: 1.55, color: 'var(--gw-inkMuted)',
        textWrap: 'pretty',
      }}>{reason}</p>

      {/* meta row */}
      <div style={{
        gridColumn: '1 / -1',
        display: 'flex', gap: 24, flexWrap: 'wrap',
        paddingTop: 14, borderTop: '1px solid var(--gw-line)',
      }}>
        {!isGap && <FieldPair label="Dose">{dose}</FieldPair>}
        <FieldPair label={isGap ? 'Variant' : 'Your variants'}>{snps.join(' · ')}</FieldPair>
      </div>

      {/* partners or gap note */}
      <div style={{ gridColumn: '1 / -1' }}>
        {!isGap && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${partners.length}, 1fr)`, gap: 8 }}>
            {partners.map(p => <GWPartnerButton key={p} partner={p} />)}
          </div>
        )}
        {isGap && <GapNote />}
      </div>
    </article>
  );
};

const FieldPair = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
    <span style={{
      fontFamily: 'var(--gw-font-mono)', fontSize: 10,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color: 'var(--gw-inkSoft)',
    }}>{label}</span>
    <span style={{
      fontFamily: 'var(--gw-font-body)', fontSize: 13,
      color: 'var(--gw-ink)',
    }}>{children}</span>
  </div>
);

const GapNote = () => (
  <div style={{
    padding: '12px 14px',
    border: '1px dashed var(--gw-line)',
    borderRadius: 12,
    fontFamily: 'var(--gw-font-body)',
    fontSize: 13, color: 'var(--gw-inkMuted)',
    display: 'flex', alignItems: 'flex-start', gap: 10,
  }}>
    <span style={{ fontFamily: 'var(--gw-font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gw-inkSoft)', marginTop: 2 }}>No shop yet</span>
    <span style={{ textWrap: 'pretty' }}>We'll email you when a partner we trust carries a third-party-tested version.</span>
  </div>
);

Object.assign(window, { GWSupplementCard, FieldPair, GapNote });
