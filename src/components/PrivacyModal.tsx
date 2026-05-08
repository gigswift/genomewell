import type { ReactNode } from 'react';
import { CWDialog } from './ui';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <CWDialog
      isOpen={isOpen}
      onClose={onClose}
      title="HOW WE HANDLE YOUR DATA"
      maxWidth={620}
    >
      <Section heading="YOUR DNA NEVER LEAVES YOUR DEVICE">
        <p style={paragraph}>
          When you upload a 23andMe or AncestryDNA file to Chronic Wellness,
          that file is read entirely by the JavaScript running in your browser.
          It's parsed locally — on your laptop, on your phone — and the
          genotype data stays there. None of it is transmitted to our servers,
          an analytics service, or any third party. We don't have a copy
          because we never receive one.
        </p>
      </Section>

      <Section heading="WHY THIS ARCHITECTURE">
        <p style={paragraph}>
          Holding your raw DNA on our servers would create real liability —
          for you, and for us. A breach, a subpoena, a misconfigured backup,
          a future acquisition that changes the rules: all real risks the
          moment we have the file. We don't want that exposure, and you
          shouldn't either. So we built it so the file never reaches us.
          There's nothing to leak because there's nothing to hold.
        </p>
      </Section>

      <Section heading="WHAT WE DO COLLECT">
        <p style={paragraph}>
          Almost nothing. There are exactly two cases where information leaves
          your browser:
        </p>
        <ul style={list}>
          <li style={listItem}>
            <strong style={emphasis}>If you submit feedback</strong> through
            the form on this site, your email address and your message are
            sent to us via Resend (an email API). We use this to read your
            feedback and reply to you.
          </li>
          <li style={listItem}>
            <strong style={emphasis}>If you click a "shop" link</strong>, the
            affiliate network (Rakuten LinkShare) records the click and any
            resulting purchase so we can earn a commission. They don't see
            your DNA or your recommendations — only that someone clicked
            through from us.
          </li>
        </ul>
        <p style={paragraph}>That's the whole list.</p>
      </Section>

      <Section heading="NO ANALYTICS, NO TRACKING, NO COOKIES">
        <p style={paragraph}>
          We don't run Google Analytics. No Facebook Pixel. No third-party
          scripts. We don't set tracking cookies. We don't fingerprint your
          browser. We don't know how many tabs you have open or which page
          you came from.
        </p>
      </Section>

      <Section heading="RIGHT TO BE FORGOTTEN">
        <p style={paragraph}>
          If you've sent us feedback and want it deleted, reply to the email
          thread and ask. We'll delete the message and confirm.
        </p>
      </Section>

      <Section heading="CONTACT" last>
        <p style={paragraph}>
          The fastest way to reach us is the feedback form on this page. We
          read everything and reply within a few days. A direct email path
          can be added later.
        </p>
      </Section>
    </CWDialog>
  );
}

interface SectionProps {
  heading: string;
  children: ReactNode;
  last?: boolean;
}

function Section({ heading, children, last }: SectionProps) {
  return (
    <section style={{ marginBottom: last ? 0 : 22 }}>
      <h3 style={{
        margin: 0,
        marginBottom: 8,
        fontFamily: 'var(--cw-font-mono)',
        fontSize: 11,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--cw-ink-soft)',
        fontWeight: 500,
      }}>{heading}</h3>
      {children}
    </section>
  );
}

const paragraph = {
  margin: '0 0 10px',
  fontFamily: 'var(--cw-font-body)',
  fontSize: 15,
  lineHeight: 1.55,
  color: 'var(--cw-ink-muted)',
} as const;

const list = {
  margin: '6px 0 10px',
  paddingLeft: 18,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
} as const;

const listItem = {
  fontFamily: 'var(--cw-font-body)',
  fontSize: 15,
  lineHeight: 1.55,
  color: 'var(--cw-ink-muted)',
} as const;

const emphasis = {
  color: 'var(--cw-ink)',
  fontWeight: 500,
} as const;
