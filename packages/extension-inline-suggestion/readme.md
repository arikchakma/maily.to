<div align="center"><img height="150" src="https://maily.to/brand/icon.svg" /></div>
<br>

<div align="center"><strong>@maily-to/extension-inline-suggestion</strong></div>
<div align="center">Tiptap extension for inline autocomplete suggestions in <a href="https://maily.to">Maily</a>.</div>
<br />

<p align="center">
  <a href="https://github.com/arikchakma/maily.to/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-222222.svg" />
  </a>
  <a href="https://buymeacoffee.com/arikchakma">
    	<img src="https://img.shields.io/badge/-buy_me_a%C2%A0coffee-222222?logo=buy-me-a-coffee" alt="Buy me a coffee" />
  </a>
</p>

<br>

### Install

Install `@maily-to/extension-inline-suggestion` from your command line.

```sh
pnpm add @maily-to/extension-inline-suggestion
```

#### Peer Dependencies

```sh
pnpm add @tiptap/core @tiptap/pm
```

### Usage

```ts
import { InlineSuggestion } from '@maily-to/extension-inline-suggestion';

const editor = new Editor({
  extensions: [
    InlineSuggestion.configure({
      // your configuration
    }),
  ],
});
```

This extension adds ghost-text style inline suggestions to the editor, similar to AI autocomplete in code editors. Users can accept suggestions with `Tab` or dismiss them by continuing to type.

### Contributions

Feel free to submit pull requests, create issues, or spread the word.

### License

MIT &copy; [Arik Chakma](https://x.com/imarikchakma)
