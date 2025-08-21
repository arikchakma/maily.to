import { Maily, render } from './index';
import { Preheader } from './preheader';

describe('render', () => {
  it('should replace variables with values', async () => {
    const content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'variable',
              attrs: {
                id: 'name',
                fallback: 'Buddy',
              },
            },
          ],
        },
      ],
    };

    const maily = new Maily(content);
    maily.setVariableValue('name', 'John Doe');
    const result = await maily.render({
      plainText: true,
    });

    expect(result).toMatchInlineSnapshot(`"John Doe"`);
  });

  it('should replace variables with default formatted value', async () => {
    const content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'variable',
              attrs: {
                id: 'name',
                fallback: 'Buddy',
              },
            },
          ],
        },
      ],
    };
    const result = await render(content, {
      plainText: true,
    });
    expect(result).toMatchInlineSnapshot(`"{{name,fallback=Buddy}}"`);
  });

  it('should replace variables formatter with custom formatter', async () => {
    const content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'variable',
              attrs: {
                id: 'name',
                fallback: 'Buddy',
              },
            },
          ],
        },
      ],
    };

    const maily = new Maily(content);
    maily.setVariableFormatter((options) => {
      const { fallback, variable } = options;
      return `[${variable},fallback=${fallback}]`;
    });
    const result = await maily.render({
      plainText: true,
    });

    expect(result).toMatchInlineSnapshot(`"[name,fallback=Buddy]"`);
  });

  it('should replace variables with fallback value', async () => {
    const content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'variable',
              attrs: {
                id: 'name',
                fallback: 'Buddy',
              },
            },
          ],
        },
      ],
    };

    const maily = new Maily(content);
    maily.setShouldReplaceVariableValues(true);
    const result = await maily.render({
      plainText: true,
    });

    expect(result).toMatchInlineSnapshot(`"Buddy"`);
  });

  it('should replace links with setLinkValue value', async () => {
    const content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: {
            textAlign: 'left',
          },
          content: [
            {
              type: 'text',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://maily.to',
                    target: '_blank',
                    rel: 'noopener noreferrer nofollow',
                    class: null,
                  },
                },
              ],
              text: 'maily.to',
            },
          ],
        },
      ],
    };

    const maily = new Maily(content);
    maily.setLinkValue('https://maily.to', 'https://maily.to/playground');
    const result = await maily.render({
      plainText: true,
    });

    expect(result).toMatchInlineSnapshot(
      `"maily.to https://maily.to/playground"`
    );
  });

  it("should replace unsubscribe_url in button's href", async () => {
    const content = {
      type: 'doc',
      content: [
        {
          type: 'button',
          attrs: {
            mailyComponent: 'button',
            text: 'Unsubscribe',
            url: 'unsubscribe_url',
            isUrlVariable: true,
            alignment: 'left',
            variant: 'filled',
            borderRadius: 'smooth',
            buttonColor: 'rgb(0, 0, 0)',
            textColor: 'rgb(255, 255, 255)',
          },
        },
      ],
    };

    const maily = new Maily(content);
    maily.setVariableValue(
      'unsubscribe_url',
      'https://maily.to/unsubscribe_url'
    );
    const result = await maily.render({
      plainText: true,
    });

    expect(result).toMatchInlineSnapshot(
      `"Unsubscribe https://maily.to/unsubscribe_url"`
    );
  });

  it('should apply custom theme', async () => {
    const content = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Custom Heading' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Custom Paragraph' }],
        },
      ],
    };

    const customTheme = {
      colors: {
        heading: 'rgb(255, 0, 0)',
        paragraph: 'rgb(0, 255, 0)',
      },
      fontSize: {
        paragraph: { size: '18px' },
      },
    };

    const maily = new Maily(content);
    maily.setTheme(customTheme);
    const result = await maily.render();

    expect(result).toContain('color:rgb(255, 0, 0)');
    expect(result).toContain('color:rgb(0, 255, 0)');
    expect(result).toContain('font-size:18px');
  });

  describe('preheader', () => {
    const content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Email content' }],
        },
      ],
    };

    it('should render preheader with string content', async () => {
      const preheaderText = 'This is a preview text';

      const maily = new Maily(content);
      const preheader = new Preheader(maily);
      const result = preheader.render(preheaderText);

      expect(result).toBe('This is a preview text');
    });

    it('should render preheader with JSONContent', async () => {
      const preheaderContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'JSON preview text' }],
          },
        ],
      };

      const maily = new Maily(content);
      const preheader = new Preheader(maily);
      const result = preheader.render(preheaderContent);

      expect(result).toBe('JSON preview text');
    });

    it('should render preheader with variables', async () => {
      const preheaderContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Hello ' },
              {
                type: 'variable',
                attrs: {
                  id: 'name',
                  fallback: 'there',
                },
              },
              { type: 'text', text: '!' },
            ],
          },
        ],
      };

      const maily = new Maily(content);
      const preheader = new Preheader(maily);
      maily.setVariableValue('name', 'John');
      const result = preheader.render(preheaderContent);

      expect(result).toBe('Hello John!');
    });

    it('should render preheader with variable fallback', async () => {
      const preheaderContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Welcome ' },
              {
                type: 'variable',
                attrs: {
                  id: 'username',
                  fallback: 'valued customer',
                },
              },
            ],
          },
        ],
      };

      const maily = new Maily(content);
      const preheader = new Preheader(maily);
      maily.setShouldReplaceVariableValues(true);
      const result = preheader.render(preheaderContent);

      expect(result).toBe('Welcome valued customer');
    });

    it('should not render preheader when preview is not set', async () => {
      const maily = new Maily(content);
      const preheader = new Preheader(maily);
      const result = preheader.render('');

      expect(result).toBe('');
    });

    it('should handle empty preheader content', async () => {
      const emptyPreheaderContent = {
        type: 'doc',
        content: [],
      };

      const maily = new Maily(content);
      const preheader = new Preheader(maily);
      const result = preheader.render(emptyPreheaderContent);

      expect(result).toBe('');
    });

    it('should handle complex nested preheader content', async () => {
      const complexPreheaderContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Order #' },
              {
                type: 'variable',
                attrs: {
                  id: 'order_id',
                  fallback: '12345',
                },
              },
              { type: 'text', text: ' for ' },
              {
                type: 'variable',
                attrs: {
                  id: 'customer_name',
                  fallback: 'customer',
                },
              },
            ],
          },
        ],
      };

      const maily = new Maily(content);
      const preheader = new Preheader(maily);
      maily.setVariableValue('order_id', 'ORD-789');
      maily.setVariableValue('customer_name', 'Alice Smith');
      const result = preheader.render(complexPreheaderContent);

      expect(result).toBe('Order #ORD-789 for Alice Smith');
    });
  });
});
