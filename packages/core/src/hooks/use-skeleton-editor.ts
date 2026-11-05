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

export type UseSkeletonEditorOptions = {
  content?: string | JSONContent;
  placeholder?: string;
  variables?: Variables;
} & Omit<UseEditorOptions, 'content'>;

export function useSkeletonEditor(
  options: UseSkeletonEditorOptions,
  dependencies?: DependencyList
) {
  const {
    content,
    editorProps,
    extensions: _extensions,
    placeholder,
    variables,
    ...rest
  } = options;

  return useEditor(
    {
      content: content ?? '',
      extensions: [
        Document.extend({ content: 'block' }),
        Paragraph.configure({
          HTMLAttributes: { 'data-mly-variable-only-line': '' },
        }),
        Text,
        Placeholder.configure({ placeholder }),
        VariableExtension.configure({
          addSpaceSuffix: false,
          renderText(props) {
            return serializeVariableToText(
              props.node.attrs as VariableNodeAttrs
            );
          },
          shouldScrollIntoView: true,
          suggestion: { ...getVariableSuggestions(), allowedPrefixes: null },
          variables,
        }),
      ],
      editorProps: {
        ...editorProps,
        attributes: {
          spellcheck: 'false',
          ...(typeof editorProps?.attributes === 'function'
            ? {}
            : editorProps?.attributes),
        },
      },
      immediatelyRender: false,
      ...rest,
    },
    dependencies
  );
}
