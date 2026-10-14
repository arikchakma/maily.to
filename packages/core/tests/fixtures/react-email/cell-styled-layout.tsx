import { Body, Column, Container, Row, Text } from '@react-email/components';
import { render } from '@react-email/render';

export function CellStyledLayout() {
  return (
    <Body style={{ backgroundColor: '#f9fafb' }}>
      <Container style={{ maxWidth: '600px' }}>
        <Row style={{ marginTop: '72px' }}>
          <Column style={{ paddingLeft: '40px', paddingRight: '40px' }}>
            <Text style={{ margin: 0 }}>Padded by its own cell</Text>
          </Column>
        </Row>
      </Container>
    </Body>
  );
}

export function renderCellStyledLayout() {
  return render(<CellStyledLayout />);
}
