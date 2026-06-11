import type { VariableNodeAttrs } from '@maily-to/extension-variable';
import { MAILY_NODE_TYPES, serializeVariableToText } from '@maily-to/shared';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { Placeholder } from '@tiptap/extensions';
import type { Editor, JSONContent, UseEditorOptions } from '@tiptap/react';
import { useEditor } from '@tiptap/react';
import type { DependencyList } from 'react';

import { Document } from '~/extensions/document/document';
import { ProtectVariableTrigger } from '~/extensions/variable/protect-variable-trigger';
import { VariableExtension } from '~/extensions/variable/variable';
import { getVariableSuggestions } from '~/extensions/variable/variable-suggestion';
import type { Variables } from '~/utils/variable';

type UseVariableOnlyEditorOptions = {
  placeholder?: string;
  content?: string | JSONContent;
  variables?: Variables;
} & Omit<UseEditorOptions, 'content'>;

export function useVariableOnlyEditor(
  options: UseVariableOnlyEditorOptions,
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
        Paragraph.extend({
          content: 'text* variable?',
        }).configure({
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
        ProtectVariableTrigger,
      ],
      editorProps: {
        ...editorProps,
        attributes: {
          spellcheck: 'false',
          ...(typeof editorProps?.attributes !== 'function'
            ? editorProps?.attributes
            : {}),
        },
        handleTextInput(view, from, _to, text) {
          const textBefore = view.state.doc.textBetween(0, from, '');
          const hasOpenTrigger = textBefore.includes('{{');

          if (text === '{') {
            return hasOpenTrigger;
          }

          if (hasOpenTrigger) {
            return false;
          }

          return true;
        },
      },
      immediatelyRender: false,
      ...rest,
    },
    dependencies
  );
}

export function getVariableOnlyContent(editor: Editor): string {
  const variables: string[] = [];

  editor.state.doc.descendants((node) => {
    if (node.type.name === MAILY_NODE_TYPES.VARIABLE) {
      variables.push(serializeVariableToText(node.attrs as VariableNodeAttrs));
    }
  });

  return variables.join('');
}
