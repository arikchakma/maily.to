import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { Button } from '~/index';

describe('<Button />', () => {
  it('keeps native button behavior without adding Maily visual styles', () => {
    const onClick = vi.fn();
    const view = render(
      <Button
        className="consumer-button"
        onClick={onClick}
        style={{ backgroundColor: 'rgb(1, 2, 3)' }}
      >
        Save
      </Button>
    );
    const button = view.getByRole('button', { name: 'Save' });

    fireEvent.click(button);

    expect({
      backgroundColor: button.style.backgroundColor,
      className: button.className,
      mailyPart: button.getAttribute('data-mly-button'),
      onClick: onClick.mock.calls.length,
      type: button.getAttribute('type'),
    }).toEqual({
      backgroundColor: 'rgb(1, 2, 3)',
      className: 'consumer-button',
      mailyPart: '',
      onClick: 1,
      type: 'button',
    });
  });
});
