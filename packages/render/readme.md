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

### Install

Install `@maily-to/render` from your command line.

```sh
pnpm add @maily-to/render
```

<br>

### Getting started

Convert Maily editor JSON into an HTML string.

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

#### Variables

All user-provided data lives under a single `variables` key — string substitution, visibility checks, repeat arrays, and link overrides.

```ts
import { render } from '@maily-to/render';

const html = await render(doc, {
  variables: {
    name: 'Alice', // string → variable substitution
    active: true, // boolean → visibility rules
    items: [{ id: 1 }], // array → repeat iteration
    cta: 'https://example.com', // string → link href override
  },
});
```

Variable resolution follows a 3-stage priority chain:

1. `item` — per-iteration data set by repeat nodes
2. `variables` — the map above
3. `variableFormatter` — fallback that produces a placeholder string

### Contributions

Feel free to submit pull requests, create issues, or spread the word.

### License

MIT &copy; [Arik Chakma](https://x.com/imarikchakma)
