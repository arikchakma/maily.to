<div align="center"><img height="150" src="https://maily.to/brand/icon.svg" /></div>
<br>

<div align="center"><strong>@arikchakma/maily</strong></div>
<div align="center">Transform <a href="https://maily.to">Maily</a> content into HTML email templates.</div>
<br />

<p align="center">
  <a href="https://github.com/arikchakma/maily/blob/main/license">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://maily.to">
    	<img src="https://img.shields.io/badge/%E2%9C%A8-Get%20Editor-0a0a0a.svg?style=flat&colorA=0a0a0a" alt="Get Maily Editor" />
    </a>
</p>

<br>

## Install

Install `maily` from your command line.

```sh
pnpm add @maily-to/render
```

<br>

## Getting started

Convert React components into a HTML string.

```jsx
import { renderSync } from '@maily-to/render';

const html = renderSync({
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

## Contributions

Feel free to submit pull requests, create issues, or spread the word.

## License

MIT &copy; [Arik Chakma](https://twitter.com/imarikchakma)
