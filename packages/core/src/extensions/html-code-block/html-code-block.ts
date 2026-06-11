import type { HtmlCodeBlockAttributes } from '@maily-to/shared';
import {
  DATA_NODE_TYPE_KEY,
  DATA_VISIBILITY_RULE_KEY,
  DEFAULT_HTML_CODE_BLOCK_TAB,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { TextSelection } from '@tiptap/pm/state';
import { ReactNodeViewRenderer } from '@tiptap/react';
import html from 'highlight.js/lib/languages/xml';
import { createLowlight, common } from 'lowlight';

import { HtmlCodeBlockView } from './html-code-block-view';

const lowlight = createLowlight(common);
lowlight.register('html', html);

export type HtmlCodeBlockOptions = {
  HTMLAttributes: Record<string, any>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    htmlCodeBlock: {
      setHtmlCodeBlock: (attributes?: { language: string }) => ReturnType;
      updateHtmlCodeBlock: (
        attrs: Partial<HtmlCodeBlockAttributes>
      ) => ReturnType;
    };
  }
}

export const HtmlCodeBlockExtension = CodeBlockLowlight.extend({
  name: MAILY_NODE_TYPES.HTML_CODE_BLOCK,
  content: '(text|variable)*',

  addAttributes() {
    return {
      ...this.parent?.(),
      activeTab: {
        default: DEFAULT_HTML_CODE_BLOCK_TAB,
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(HtmlCodeBlockView, {
      className: 'mly:relative',
      attrs: (props) => {
        const { node } = props;
        const { activeTab } = node.attrs as HtmlCodeBlockAttributes;

        return {
          'data-active-tab': activeTab,
          [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.HTML_CODE_BLOCK,
          ...(node.attrs.visibilityRule
            ? { [DATA_VISIBILITY_RULE_KEY]: '' }
            : {}),
        };
      },
    });
  },

  addCommands() {
    return {
      setHtmlCodeBlock: (attributes) => {
        return ({ commands }) => {
          return commands.setNode(this.name, attributes);
        };
      },
      updateHtmlCodeBlock: (attrs) => {
        return ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        };
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      'Mod-a': ({ editor }) => {
        const { selection } = editor.state;
        const $pos = selection.$anchor;

        const node = $pos.node($pos.depth);
        if (node.type.name !== this.name) {
          return false;
        }

        let depth = $pos.depth;
        for (let d = depth; d > 0; d--) {
          if ($pos.node(d).type.name === this.name) {
            depth = d;
            break;
          }
        }

        const start = $pos.before(depth) + 1;
        const end = $pos.after(depth) - 1;

        const from = editor.state.doc.resolve(start);
        const to = editor.state.doc.resolve(end);
        if (from && to) {
          const transaction = editor.state.tr.setSelection(
            TextSelection.between(from, to)
          );
          editor.view.dispatch(transaction);
          return true;
        }

        return false;
      },
      'Mod-Backspace': ({ editor }) => {
        return editor.commands.deleteNode(this.name);
      },
    };
  },
}).configure({
  lowlight,
});
