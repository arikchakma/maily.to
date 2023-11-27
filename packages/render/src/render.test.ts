import { render } from './index';

describe('render', () => {
  it('should return plain text version of the email', () => {
    const content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello World!',
            },
          ],
        },
      ],
    };
    const result = render(content, {
      options: {
        plainText: true,
      },
    });
    expect(result).toMatchInlineSnapshot(`"Hello World!"`);
  });
});
