<h1 align="center"><img height="150" src="https://maily.to/brand/icon.svg" /><br> @maily.to/core</h1>

<p align="center">
  <a href="https://github.com/arikchakma/maily.to/blob/main/license">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://maily.to">
    	<img src="https://img.shields.io/badge/%E2%9C%A8-Get%20Editor-0a0a0a.svg?style=flat&colorA=0a0a0a" alt="Get Maily Editor" />
    </a>
</p>

> Currently, this package is under development. You can follow the progress [here](https://github.com/arikchakma/maily.to).

## Installation

```bash
pnpm add @maily-to/core

# for types
pnpm add -D @tiptap/core
```

## Usage

```tsx
import { useState } from 'react';
import { Editor } from '@maily-to/core';
import type { Editor as TiptapEditor, JSONContent } from '@tiptap/core';

type AppProps = {
  contentJson: JSONContent;
};

function App(props: AppProps) {
  const { contentJson: defaultContentJson } = props;
  const [editor, setEditor] = useState<TiptapEditor>();

  return (
    <Editor
      contentJson={defaultContentJson}
      onCreate={setEditor}
      onUpdate={setEditor}
    />
  );
}
```

### Slash Commands

Slash commands are a way to interact with the editor using `/` followed by a command name. For example, `/heading1` will convert the current paragraph to a heading 1.

```tsx
// (Omitted repeated imports)
import { text, heading1 } from '@maily-to/core/blocks';

<Editor
  blocks={[text, heading1]}
/>
```

> Note: The order of the blocks matters. It will be shown in the order you provide.

### Variables

By default, the variables are required. You can make them optional by setting the `required` property to `false`. So it will show a placeholder if the variable is not provided.

For auto-suggestions of the variables in the editor when you type `@` and pass the variables as an array of objects to the `variables` prop. The `iterable` property is used to indicate that the variable is an array of objects and can be used in `For` loop. The `keys` property is used to show the keys of the object in the auto-suggestions.

```tsx
// (Omitted repeated imports)
<Editor
  triggerSuggestionCharacter="@"
  variables={[
    {
      name: 'currentDate',
      required: false,
    },
    {
      name: 'notifications',
      iterable: true,
      keys: ['id', 'title'],
    }
  ]}
/>
```

See the [@maily-to/render](../render) package for more information on how to render the editor content to HTML.

## License

MIT &copy; [Arik Chakma](https://twitter.com/imarikchakma)
