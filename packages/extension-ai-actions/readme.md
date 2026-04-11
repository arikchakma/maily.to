<div align="center"><img height="150" src="https://maily.to/brand/icon.svg" /></div>
<br>

<div align="center"><strong>@maily-to/extension-ai-actions</strong></div>
<div align="center">Tiptap extension for AI-powered content actions in <a href="https://maily.to">Maily</a>.</div>
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

Install `@maily-to/extension-ai-actions` from your command line.

```sh
pnpm add @maily-to/extension-ai-actions
```

#### Peer Dependencies

```sh
pnpm add @tiptap/core @tiptap/pm
```

### Usage

```ts
import { AiActions } from '@maily-to/extension-ai-actions';

const editor = new Editor({
  extensions: [
    AiActions.configure({
      // your configuration
    }),
  ],
});
```

This extension adds AI-powered content transformation capabilities to the editor, enabling actions like rewriting, summarizing, and expanding selected text.

### Contributions

Feel free to submit pull requests, create issues, or spread the word.

### License

MIT &copy; [Arik Chakma](https://x.com/imarikchakma)
