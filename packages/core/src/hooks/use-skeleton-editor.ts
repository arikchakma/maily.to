import type { VariableNodeAttrs } from '@maily-to/extension-variable';
import { serializeVariableToText } from '@maily-to/shared';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { Placeholder } from '@tiptap/extensions';
import type { JSONContent, UseEditorOptions } from '@tiptap/react';
import { useEditor } from '@tiptap/react';
import type { DependencyList } from 'react';

import { Document } from '~/extensions/document/document';
import { VariableExtension } from '~/extensions/variable/variable';
import { getVariableSuggestions } from '~/extensions/variable/variable-suggestion';
import type { Variables } from '~/utils/variable';

type UseSkeletonEditorOptions = {
  placeholder?: string;
  content?: string | JSONContent;
  variables?: Variables;
} & Omit<UseEditorOptions, 'content'>;

export function useSkeletonEditor(
  options: UseSkeletonEditorOptions,
  dependencies?: DependencyList
) {
  const {
    content,
    placeholder,
    variables,
    extensions: _,
    editorProps,
    ...rest
  } = options;

  return useEditor(
    {
      content: content ?? '',
      extensions: [
        Document.extend({
          content: 'block',
        }),
        Paragraph.configure({
          HTMLAttributes: {
            class:
              'not-prose mly:hide-scrollbar mly:h-7 mly:overflow-x-scroll mly:rounded-none mly:pt-1 mly:text-sm mly:whitespace-nowrap mly:focus-visible:border-gray-300 mly:focus-visible:ring-0 mly:focus-visible:ring-offset-0',
          },
        }),
        Text,
        Placeholder.configure({
          placeholder,
        }),
        VariableExtension.configure({
          variables,
          shouldScrollIntoView: true,
          addSpaceSuffix: false,
          suggestion: {
            ...getVariableSuggestions(),
            allowedPrefixes: null,
          },
          renderText(props) {
            return serializeVariableToText(
              props.node.attrs as VariableNodeAttrs
            );
          },
        }),
      ],
      editorProps: {
        ...editorProps,
        attributes: {
          spellcheck: 'false',
          ...(typeof editorProps?.attributes !== 'function'
            ? editorProps?.attributes
            : {}),
        },
      },
      // on create the editor view is not created
      // but using `immediatelyRender: false` renders the editor view
      // so it fixes the focus issue:
      //    `editor.commands.focus()` - without updating the editor
      immediatelyRender: false,
      ...rest,
    },
    dependencies
  );
}
