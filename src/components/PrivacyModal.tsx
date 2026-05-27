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
          that file is read entirely by the JavaScript running in your
          browser. It's parsed on your laptop or phone, and the genotype
          data stays there. Your DNA is never transmitted to our servers,
          to Google, or to any other third party. This isn't just a policy
          — there is no endpoint anywhere in our code that accepts DNA
          files. We don't have a copy because we never receive one.
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

      <Section heading="WHAT DOES LEAVE YOUR BROWSER">
        <p style={paragraph}>
          Your DNA is the exception, not the rule. A handful of other
          things do leave your browser:
        </p>
        <ul style={list}>
          <li style={listItem}>
            <strong style={emphasis}>If you submit feedback</strong>, your
            email address and your message are sent to us via Resend (an
            email API) so we can read and reply.
          </li>
          <li style={listItem}>
            <strong style={emphasis}>When your file finishes parsing</strong>,
            an anonymous "file parsed" event is logged to{' '}
            <code style={mono}>/api/track</code> and counted as a Google Ads
            conversion via <code style={mono}>gtag.js</code>. This records only
            that a parse happened — never the file, your genotypes, or your
            results. The anonymous session ID and, if present, the Google
            ad-click ID are included; nothing else.
          </li>
          <li style={listItem}>
            <strong style={emphasis}>If you click a "Shop" button</strong>,
            the affiliate network (Rakuten LinkShare) records the click
            and any resulting purchase so we can earn a commission. They
            don't see your DNA or your recommendations — only that someone
            clicked through from us.
          </li>
          <li style={listItem}>
            <strong style={emphasis}>The same Shop click is also logged
            to our own server</strong> at <code style={mono}>/api/track</code>.
            The log line contains the supplement name, the brand, the
            time, an anonymous random session ID, and — if you arrived
            from a Google ad — the Google ad-click ID. Your browser's
            user-agent and referring page are recorded automatically as
            part of the HTTP request.
          </li>
          <li style={listItem}>
            <strong style={emphasis}>The same Shop click also pings
            Google Ads</strong> via <code style={mono}>gtag.js</code> so
            the conversion can be counted against our ad spend. Google
            sees that one of their ad clicks resulted in an outbound
            product click. They do not see your DNA or your
            recommendations.
          </li>
        </ul>
      </Section>

      <Section heading="WHAT WE TRACK AND WHAT WE DON'T">
        <p style={paragraph}>
          We do run Google Ads conversion tracking via gtag.js. That is
          the only third-party script we load. We don't run a Facebook
          Pixel, TikTok Pixel, Mixpanel, Segment, Amplitude, Heap,
          Hotjar, Plausible, FullStory, or any other analytics SDK. We
          don't fingerprint your browser.
        </p>
        <p style={paragraph}>We set two first-party cookies:</p>
        <ul style={list}>
          <li style={listItem}>
            <strong style={emphasis}><code style={mono}>cw_session</code></strong>
            {' '}(30 days) — a random ID so we can count unique visitors and
            group repeat clicks into one session.
          </li>
          <li style={listItem}>
            <strong style={emphasis}><code style={mono}>cw_gclid</code></strong>
            {' '}(90 days) — set only if you arrived from a Google ad, so we
            can attribute a downstream Shop click back to that ad.
          </li>
        </ul>
        <p style={paragraph}>
          Everything we log contains zero DNA, zero genotypes, no name,
          no email. As a concrete example: if you clicked the Solgar
          Vitamin D button on April 5th after arriving from a Google ad,
          our server log would contain that event, your anonymous
          session ID, and the ad-click ID — and nothing else identifying.
        </p>
      </Section>

      <Section heading="RIGHT TO BE FORGOTTEN">
        <p style={paragraph}>
          If you've sent us feedback and want it deleted, reply to the
          email thread and ask. We'll delete the message and confirm. To
          clear the <code style={mono}>cw_session</code> and{' '}
          <code style={mono}>cw_gclid</code> cookies, clear cookies for
          this site in your browser — the next visit will start a fresh
          anonymous session.
        </p>
      </Section>

      <Section heading="CONTACT" last>
        <p style={paragraph}>
          The fastest way to reach us is the feedback form on this page.
          We read everything and reply within a few days. A direct email
          path can be added later.
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

const mono = {
  fontFamily: 'var(--cw-font-mono)',
  fontSize: '0.92em',
} as const;
