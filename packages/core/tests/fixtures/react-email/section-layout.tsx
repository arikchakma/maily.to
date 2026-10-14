import { Body, Container, Section, Text } from '@react-email/components';
import { render } from '@react-email/render';

export function SectionLayout() {
  return (
    <Body style={{ backgroundColor: '#f9fafb' }}>
      <Container style={{ maxWidth: '600px' }}>
        <Section style={{ backgroundColor: '#ffffff' }}>
          <Text style={{ margin: 0 }}>Inside a section</Text>
        </Section>
      </Container>
    </Body>
  );
}

export function renderSectionLayout() {
  return render(<SectionLayout />);
}
