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

By default, variables are required. You can make them optional by setting the `required` property to `false`. When a variable is optional and not provided, a placeholder will be displayed in its place.

You can pass variables to the editor in two ways:

1. As an Array of Objects:

   For auto-suggestions of variables in the editor when you type `@`, pass the variables as an array of objects to the `variables` prop.

   ```tsx
   // (Omitted repeated imports)
   <Editor
     triggerSuggestionCharacter="@"
     variables={[
       {
         name: 'currentDate',
         required: false,
       },
     ]}
   />
   ```

2. As a Function:

   If the variables are dynamic and need to be generated based on the editor's state or other inputs, you can provide a function to the `variables` prop.

   ```tsx
   // (Omitted repeated imports)
   <Editor
     triggerSuggestionCharacter="@"
     variables={({ query, from, editor }) => {
       // magic goes here
       // query: the text after the trigger character
       // from: the context from where the variables are requested (for, variable)
       // editor: the editor instance
       if (from === 'for') {
         // return variables for the For block `each` key
         return [
           { name: 'notifications' },
           { name: 'comments' },
         ];
       }

       return [
         { name: 'currentDate' },
         { name: 'currentTime', required: false },
       ];
     }}
   />
   ```

> Keep it in mind that if you pass an array of variable object Maily will take care of the filtering based on the query. But if you pass a function you have to take care of the filtering.

See the [@maily-to/render](../render) package for more information on how to render the editor content to HTML.

## License

MIT &copy; [Arik Chakma](https://twitter.com/imarikchakma)
