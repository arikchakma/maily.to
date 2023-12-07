import { Maily, renderSync } from './index';

describe('renderSync', () => {
  it('should replace variables with values', () => {
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
    const result = maily.renderSync({
      plainText: true,
    });

    expect(result).toMatchInlineSnapshot(`"John Doe"`);
  });

  it('should replace variables with default formatted value', () => {
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
    const result = renderSync(content, {
      plainText: true,
    });
    expect(result).toMatchInlineSnapshot(`"{{name,fallback=Buddy}}"`);
  });

  it('should replace variables formatter with custom formatter', () => {
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
    const result = maily.renderSync({
      plainText: true,
    });

    expect(result).toMatchInlineSnapshot(`"[name,fallback=Buddy]"`);
  });

  it('should replace links with setLinkValue value', () => {
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
    const result = maily.renderSync({
      plainText: true,
    });

    expect(result).toMatchInlineSnapshot(
      `"maily.to [https://maily.to/playground]"`
    );
  });

  it("should replace unsubscribe_url in button's href", () => {
    const content = {
      type: 'doc',
      content: [
        {
          type: 'button',
          attrs: {
            mailyComponent: 'button',
            text: 'Unsubscribe',
            url: 'unsubscribe_url',
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
    const result = maily.renderSync({
      plainText: true,
    });

    expect(result).toMatchInlineSnapshot(
      `"Unsubscribe [https://maily.to/unsubscribe_url]"`
    );
  });
});
