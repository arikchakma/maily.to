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

export type UseVariableOnlyEditorOptions = {
  content?: string | JSONContent;
  placeholder?: string;
  variables?: Variables;
} & Omit<UseEditorOptions, 'content'>;

export function useVariableOnlyEditor(
  options: UseVariableOnlyEditorOptions,
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
        Paragraph.extend({ content: 'text* variable?' }).configure({
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
        ProtectVariableTrigger,
      ],
      editorProps: {
        ...editorProps,
        attributes: {
          spellcheck: 'false',
          ...(typeof editorProps?.attributes === 'function'
            ? {}
            : editorProps?.attributes),
        },
        handleTextInput(view, from, _to, text) {
          const hasOpenTrigger = view.state.doc
            .textBetween(0, from, '')
            .includes('{{');

          if (text === '{') {
            return hasOpenTrigger;
          }

          return !hasOpenTrigger;
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
