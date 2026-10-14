import { Column, Row, Text } from '@react-email/components';
import { render } from '@react-email/render';

export function TwoCellLayout() {
  return (
    <Row style={{ width: '100%' }}>
      <Column style={{ backgroundColor: '#fee2e2', width: '50%' }}>
        <Text>Left column</Text>
      </Column>
      <Column style={{ backgroundColor: '#dbeafe', width: '50%' }}>
        <Text>Right column</Text>
      </Column>
    </Row>
  );
}

export function renderTwoCellLayout() {
  return render(<TwoCellLayout />);
}
