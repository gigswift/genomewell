import { useEffect, useRef, useState } from 'react';
import { CWButton, CWLogo, CWPrivacyLockup, CWTooltip, SNP_DEF } from './ui';

export type ParseState = 'idle' | 'parsing' | 'done';

interface LandingProps {
  parseState: ParseState;
  progress: number;
  variantsMatched: number;
  errorMsg?: string;
  onFile: (file: File) => void;
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

export function Landing({
  parseState,
  progress,
  variantsMatched,
  errorMsg,
  onFile,
}: LandingProps) {
  const isMobile = useIsMobile();
  const surface = isMobile ? 'mobile' : 'desktop';

  return (
    <div style={{
      background: 'var(--cw-bg)',
      color: 'var(--cw-ink)',
      minHeight: '100vh',
      fontFamily: 'var(--cw-font-body)',
    }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: surface === 'mobile' ? '28px 22px 14px' : '22px 56px',
        borderBottom: '1px solid var(--cw-line)',
      }}>
        <CWLogo size={surface === 'mobile' ? 17 : 19} />
        <CWPrivacyLockup variant="inline" />
      </header>

      <HeroSplit surface={surface} />

      <section style={{
        padding: surface === 'mobile' ? '28px 22px 56px' : '40px 56px 80px',
        maxWidth: surface === 'mobile' ? '100%' : 980,
        margin: '0 auto',
      }}>
        {errorMsg && (
          <div style={{
            marginBottom: 20,
            padding: '12px 16px',
            border: '1px solid #C25B3F',
            borderRadius: 12,
            background: 'transparent',
            color: '#C25B3F',
            fontFamily: 'var(--cw-font-body)',
            fontSize: 13,
          }}>
            <strong>Couldn't parse that file.</strong> {errorMsg}
          </div>
        )}

        <UploadZone
          parseState={parseState}
          progress={progress}
          variantsMatched={variantsMatched}
          onFile={onFile}
          surface={surface}
        />

        <div style={{ margin: surface === 'mobile' ? '40px 0 28px' : '56px 0 36px' }}>
          <CWPrivacyLockup variant="rule" />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: surface === 'mobile' ? '1fr' : 'repeat(3, 1fr)',
          gap: surface === 'mobile' ? 20 : 36,
        }}>
          {[
            { n: '01', t: 'Parsed in your browser',
              d: "Your raw file is read on this device — no upload, no server, no copy. Close the tab and it's gone." },
            { n: '02', t: 'Built for your ancestry',
              d: 'Most DNA-wellness products train on European cohorts. We weight for variant frequencies across Black American profiles specifically.' },
            { n: '03', t: 'Honest about gaps',
              d: "If the research is thin — or if no partner we trust carries it — we tell you. No hype, no hedging." },
          ].map((item) => (
            <div key={item.n} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{
                fontFamily: 'var(--cw-font-mono)', fontSize: 11,
                letterSpacing: '0.12em', color: 'var(--cw-ink-soft)',
              }}>{item.n}</span>
              <h4 style={{
                margin: 0, fontFamily: 'var(--cw-font-display)',
                fontWeight: 400,
                fontSize: surface === 'mobile' ? 22 : 24,
                letterSpacing: 'var(--cw-display-letter)',
                color: 'var(--cw-ink)', lineHeight: 1.1,
              }}>{item.t}</h4>
              <p style={{
                margin: 0, fontSize: 14, lineHeight: 1.55,
                color: 'var(--cw-ink-muted)',
              }}>{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{
        padding: surface === 'mobile' ? '22px 22px 30px' : '28px 56px 36px',
        borderTop: '1px solid var(--cw-line)',
        display: 'flex', flexDirection: surface === 'mobile' ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: surface === 'mobile' ? 'flex-start' : 'center',
        gap: 12, color: 'var(--cw-ink-soft)',
        fontFamily: 'var(--cw-font-mono)', fontSize: 11,
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <span>© 2026 Chronic Wellness · Evidence-ranked · Privacy-first</span>
        <span>Not a medical device. Educational use.</span>
      </footer>
    </div>
  );
}

function HeroSplit({ surface }: { surface: 'mobile' | 'desktop' }) {
  return (
    <section style={{
      padding: surface === 'mobile' ? '32px 22px 12px' : '64px 56px 24px',
      maxWidth: surface === 'mobile' ? '100%' : 1200,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: surface === 'mobile' ? '1fr' : '1.3fr 1fr',
      gap: surface === 'mobile' ? 24 : 56,
      alignItems: 'end',
    }}>
      <h1 style={{
        margin: 0,
        fontFamily: 'var(--cw-font-display)',
        fontWeight: 400,
        fontSize: surface === 'mobile' ? 40 : 72,
        lineHeight: 1,
        letterSpacing: 'var(--cw-display-letter)',
        color: 'var(--cw-ink)',
      }}>
        Supplements,<br />picked by your<br />
        <em style={{ fontStyle: 'italic' }}>actual genome.</em>
      </h1>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 14,
        paddingLeft: surface === 'mobile' ? 0 : 24,
        borderLeft: surface === 'mobile' ? 'none' : '1px solid var(--cw-line)',
      }}>
        <p style={{
          margin: 0, fontSize: 15, lineHeight: 1.55,
          color: 'var(--cw-ink-muted)',
        }}>
          Drop in your raw file from 23andMe or Ancestry. In about fifteen seconds you'll get a priority-ranked list of supplements — each tied to a specific variant in your file.
        </p>
        <p style={{
          margin: 0, fontSize: 15, lineHeight: 1.55,
          color: 'var(--cw-ink-muted)',
        }}>
          The file is parsed in your browser. It isn't uploaded anywhere. It can't be — we don't have a place to put it.
        </p>
      </div>
    </section>
  );
}

interface UploadZoneProps {
  parseState: ParseState;
  progress: number;
  variantsMatched: number;
  onFile: (file: File) => void;
  surface: 'mobile' | 'desktop';
}

function UploadZone({
  parseState,
  progress,
  variantsMatched,
  onFile,
  surface,
}: UploadZoneProps) {
  const active = parseState === 'parsing';
  const done = parseState === 'done';
  const fileInput = useRef<HTMLInputElement>(null);

  function handleBrowse() {
    fileInput.current?.click();
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) onFile(f);
    e.target.value = '';
  }
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  }

  const ringProgress = active ? progress : done ? 100 : 0;

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        position: 'relative',
        padding: surface === 'mobile' ? '36px 22px' : '56px 40px',
        background: 'var(--cw-surface)',
        border: `1.5px dashed ${active ? 'var(--cw-accent)' : 'var(--cw-line)'}`,
        borderRadius: 24,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
        textAlign: 'center',
        transition: 'border-color 0.2s ease',
      }}>
      <LockRing progress={ringProgress} pulsing={active} done={done} />

      {!active && !done && (
        <>
          <div>
            <div style={{
              fontFamily: 'var(--cw-font-display)',
              fontWeight: 400,
              fontSize: surface === 'mobile' ? 24 : 30,
              letterSpacing: 'var(--cw-display-letter)',
              color: 'var(--cw-ink)', marginBottom: 6,
            }}>Drop your raw DNA file</div>
            <div style={{ fontSize: 13, color: 'var(--cw-ink-muted)' }}>
              .txt or .zip from 23andMe or AncestryDNA · up to 30 MB
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <CWButton variant="primary" onClick={handleBrowse}>Choose a file</CWButton>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept=".txt,.zip"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
        </>
      )}

      {active && (
        <div>
          <div style={{
            fontFamily: 'var(--cw-font-display)',
            fontWeight: 400,
            fontSize: 22, letterSpacing: 'var(--cw-display-letter)',
            color: 'var(--cw-ink)', marginBottom: 6,
          }}>Reading on this device…</div>
          <div style={{
            fontFamily: 'var(--cw-font-mono)', fontSize: 11,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--cw-ink-soft)',
          }}>
            {progress < 40 && (
              <>Parsing 637,294 <CWTooltip content={SNP_DEF}>SNPs</CWTooltip></>
            )}
            {progress >= 40 && progress < 80 && 'Matching your variants'}
            {progress >= 80 && 'Ranking recommendations'}
            <span style={{ marginLeft: 8, color: 'var(--cw-accent)' }}>{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {done && (
        <div>
          <div style={{
            fontFamily: 'var(--cw-font-display)',
            fontWeight: 400,
            fontSize: 22, letterSpacing: 'var(--cw-display-letter)',
            color: 'var(--cw-ink)', marginBottom: 6,
          }}>Done. Nothing was transmitted.</div>
          <div style={{ fontSize: 13, color: 'var(--cw-ink-muted)' }}>
            {variantsMatched} variants matched · taking you to your results…
          </div>
        </div>
      )}
    </div>
  );
}

interface LockRingProps {
  progress: number;
  pulsing: boolean;
  done: boolean;
}

function LockRing({ progress, pulsing, done }: LockRingProps) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  return (
    <div style={{
      width: 104, height: 104, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="104" height="104" viewBox="0 0 104 104" style={{ position: 'absolute', inset: 0 }}>
        <circle cx="52" cy="52" r={r} fill="none" stroke="var(--cw-line)" strokeWidth="2" />
        <circle
          cx="52" cy="52" r={r}
          fill="none" stroke="var(--cw-accent)" strokeWidth="2"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 52 52)"
          style={{ transition: 'stroke-dashoffset 0.15s linear' }}
        />
      </svg>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'var(--cw-surface-alt)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: pulsing ? 'cwPulse 1.6s ease-in-out infinite' : 'none',
      }}>
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
          <rect x="2" y="12" width="20" height="14" rx="2" stroke="var(--cw-ink)" strokeWidth="1.5" />
          <path d="M6 12 V8 a6 6 0 0 1 12 0 V12" stroke="var(--cw-ink)" strokeWidth="1.5" strokeLinecap="round" />
          {done && (
            <path d="M8 18 L11 21 L16 15" stroke="var(--cw-accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </div>
    </div>
  );
}
