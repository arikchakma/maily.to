<div align="center"><img height="150" src="https://maily.to/brand/icon.svg" /></div>
<br>

<div align="center"><strong>@maily-to/render</strong></div>
<div align="center">Transform <a href="https://maily.to">Maily</a> content into HTML email templates.</div>
<br />

<p align="center">
  <a href="https://github.com/arikchakma/maily.to/blob/main/license">
    <img src="https://img.shields.io/badge/License-MIT-222222.svg" />
  </a>
  <a href="https://buymeacoffee.com/arikchakma">
    	<img src="https://img.shields.io/badge/-buy_me_a%C2%A0coffee-222222?logo=buy-me-a-coffee" alt="Buy me a coffee" />
  </a>
</p>

<br>

## Install

Install `@maily-to/render` from your command line.

```sh
pnpm add @maily-to/render
```

<br>

## Getting started

Convert React components into a HTML string.

```ts
import { render } from '@maily-to/render';

const html = await render({
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
});
```

### Variables

You can replace variables in the content.

```ts
import { Maily } from '@maily-to/render';

const maily = new Maily({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      attrs: { textAlign: 'left' },
      content: [
        {
          type: 'variable',
          attrs: {
            id: 'currentDate',
            fallback: 'now',
            showIfKey: null,
          },
        },
      ],
    },
  ],
});

maily.setVariableValue('currentDate', new Date().toISOString());
const html = await maily.render();
```

### Payloads

Payload values are used for the `Repeat` and `Show If` blocks.

```ts
// (Omitted repeated imports)

const maily = new Maily({
  type: 'doc',
  content: [
    {
      type: 'repeat',
      attrs: { each: 'items', showIfKey: null },
      content: [
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [{ type: 'text', text: 'Hello' }],
        },
      ],
    },
  ],
});

maily.setPayloadValue('items', ['Alice', 'Bob', 'Charlie']);
const html = await maily.render();
```

## Contributions

Feel free to submit pull requests, create issues, or spread the word.

## License

MIT &copy; [Arik Chakma](https://twitter.com/imarikchakma)
