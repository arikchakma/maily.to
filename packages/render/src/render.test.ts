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
    const result = render(content, {
      variableValues: {
        name: 'John Doe',
      },
      options: {
        plainText: true,
      },
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
    const result = render(content, {
      options: {
        plainText: true,
      },
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
    const result = render(content, {
      options: {
        plainText: true,
      },
      variableFormatter(options) {
        const { fallback, variable } = options;
        return `[${variable},fallback=${fallback}]`;
      },
    });
    expect(result).toMatchInlineSnapshot(`"[name,fallback=Buddy]"`);
  });
});
