import { CWButton, CWDialog } from './ui';

interface TwentyThreeAndMeInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TWENTY_THREE_URL = 'https://www.23andme.com/';

export function TwentyThreeAndMeInstructionsModal({
  isOpen,
  onClose,
}: TwentyThreeAndMeInstructionsModalProps) {
  return (
    <CWDialog
      isOpen={isOpen}
      onClose={onClose}
      title="How to find your 23andMe file"
      maxWidth={560}
    >
      <ol style={listStyle}>
        <li style={itemStyle}>
          From the home page, click on the icon at the top far right corner of the page and find the Settings link.
        </li>
        <li style={itemStyle}>
          Go to the bottom of the page and find the 'View' button for the 23andMe Data.
        </li>
        <li style={itemStyle}>
          Find the 'Download Raw Data' button.
        </li>
        <li style={itemStyle}>
          Select the 'Download raw genotyping data' button.
        </li>
      </ol>
      <div style={ctaRowStyle}>
        <CWButton
          variant="primary"
          onClick={() => window.open(TWENTY_THREE_URL, '_blank', 'noopener,noreferrer')}
        >
          Open 23andMe →
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
