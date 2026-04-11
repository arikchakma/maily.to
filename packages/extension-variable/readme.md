<div align="center"><img height="150" src="https://maily.to/brand/icon.svg" /></div>
<br>

<div align="center"><strong>@maily-to/extension-variable</strong></div>
<div align="center">Tiptap extension for template variables in <a href="https://maily.to">Maily</a>.</div>
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

Install `@maily-to/extension-variable` from your command line.

```sh
pnpm add @maily-to/extension-variable
```

#### Peer Dependencies

```sh
pnpm add @tiptap/core @tiptap/pm @tiptap/suggestion
```

### Usage

```ts
import { Variable } from '@maily-to/extension-variable';

const editor = new Editor({
  extensions: [
    Variable.configure({
      suggestion: {
        // your suggestion configuration
      },
    }),
  ],
});
```

This extension adds a `variable` inline node to the editor, allowing users to insert dynamic template variables (e.g. `{{name}}`, `{{currentDate}}`) that get replaced at render time.

### Contributions

Feel free to submit pull requests, create issues, or spread the word.

### License

MIT &copy; [Arik Chakma](https://twitter.com/imarikchakma)
