import { Text } from '@react-email/components';
import { render } from '@react-email/render';

const PARAGRAPH_STYLE = {
  background: 'linear-gradient(90deg, #f8fafc, #ffffff)',
  color: '#0f172a',
  margin: '12px 8px 4px',
  padding: '6px 10px',
  WebkitFontSmoothing: 'antialiased',
  '--brand-accent': '#7c3aed',
  '--maily-unknown-property': 'preserved',
} as React.CSSProperties;

export function StyledParagraph() {
  return <Text style={PARAGRAPH_STYLE}>A styled React Email paragraph</Text>;
}

export function renderStyledParagraph() {
  return render(<StyledParagraph />);
}
