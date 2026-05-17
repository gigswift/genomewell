import { CWButton, CWDialog } from './ui';

interface AncestryInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ANCESTRY_URL = 'https://www.ancestry.com/';

export function AncestryInstructionsModal({ isOpen, onClose }: AncestryInstructionsModalProps) {
  return (
    <CWDialog
      isOpen={isOpen}
      onClose={onClose}
      title="How to find your AncestryDNA file"
      maxWidth={560}
    >
      <ol style={listStyle}>
        <li style={itemStyle}>
          Find the DNA link at the top of the page and select 'Your Results Summary'.
        </li>
        <li style={itemStyle}>
          Select the button with a gear called 'DNA Settings'. It is at the far right of the page.
        </li>
        <li style={itemStyle}>
          Scroll to the bottom of the page and select 'Download DNA Data'.
        </li>
        <li style={itemStyle}>
          Select 'Continue' on the next page and they will send a verification code via email; find the code and input it where it says 'Enter code'.
        </li>
        <li style={itemStyle}>
          They will send you an email to get your DNA file. It should take 5–10 minutes to receive the email.
        </li>
      </ol>
      <div style={ctaRowStyle}>
        <CWButton
          variant="primary"
          onClick={() => window.open(ANCESTRY_URL, '_blank', 'noopener,noreferrer')}
        >
          Open AncestryDNA →
        </CWButton>
      </div>
    </CWDialog>
  );
}

const listStyle = {
  margin: '4px 0 0',
  paddingLeft: 22,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
} as const;

const itemStyle = {
  fontFamily: 'var(--cw-font-body)',
  fontSize: 15,
  lineHeight: 1.55,
  color: 'var(--cw-ink-muted)',
} as const;

const ctaRowStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 18,
} as const;
