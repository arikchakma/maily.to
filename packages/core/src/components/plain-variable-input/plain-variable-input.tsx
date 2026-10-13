import type { VariableNodeAttrs } from '@maily-to/extension-variable';
import {
  buildDocFromVariableText,
  serializeVariableToText,
} from '@maily-to/shared';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { Placeholder } from '@tiptap/extensions';
import type { EditorOptions } from '@tiptap/react';
import { EditorContent, useCurrentEditor, useEditor } from '@tiptap/react';

import { Document } from '~/extensions/document/document';
import { VariableExtension } from '~/extensions/variable/variable';
import { getVariableSuggestions } from '~/extensions/variable/variable-suggestion';
import type { Variables } from '~/utils/variable';
import { VARIABLE_SUGGESTION_POPOVER_ID } from '~/utils/variable';

export type PlainVariableInputProps = {
  'aria-label'?: string;
  autofocus?: EditorOptions['autofocus'];
  content: string;
  id?: string;
  onContentChange?: (content: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  variables?: Variables;
};

export function PlainVariableInput(props: PlainVariableInputProps) {
  const {
    'aria-label': ariaLabel,
    autofocus = false,
    content,
    id,
    onContentChange,
    onEnter,
    placeholder,
    variables,
  } = props;

  const { editor: parentEditor } = useCurrentEditor();

  const editor = useEditor({
    autofocus,
    content: content ? buildDocFromVariableText(content) : '',
    extensions: [
      Document.extend({ content: 'paragraph' }),
      Paragraph.configure({
        HTMLAttributes: { 'data-mly-plain-variable-input-line': '' },
      }),
      Text,
      Placeholder.configure({ placeholder }),
      VariableExtension.configure({
        addSpaceSuffix: false,
        renderText(renderProps) {
          return serializeVariableToText(
            renderProps.node.attrs as VariableNodeAttrs
          );
        },
        shouldScrollIntoView: true,
        suggestion: { ...getVariableSuggestions(), allowedPrefixes: null },
        variables: variables ?? parentEditor?.storage.variable?.variables ?? [],
      }),
    ],
    editorProps: {
      attributes: {
        role: 'textbox',
        spellcheck: 'false',
        ...(id ? { id } : {}),
        ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
      },
      handleKeyDown: (_view, event) => {
        if (event.key !== 'Enter') {
          return false;
        }

        if (document.getElementById(VARIABLE_SUGGESTION_POPOVER_ID)) {
          return false;
        }

        event.preventDefault();
        onEnter?.();

        return true;
      },
      transformPastedText: (text) => text.replace(/\s*\n\s*/g, ' '),
    },
    immediatelyRender: false,
    onUpdate: ({ editor: instance }) => {
      onContentChange?.(instance.getText());
    },
  });

  return (
    <div data-mly-plain-variable-input="">
      <EditorContent editor={editor} />
    </div>
  );
}
