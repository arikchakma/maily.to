import type { HtmlCodeBlockAttributes } from '@maily-to/shared';
import {
  DATA_NODE_TYPE_KEY,
  DEFAULT_HTML_CODE_BLOCK_TAB,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { TextSelection } from '@tiptap/pm/state';
import { ReactNodeViewRenderer } from '@tiptap/react';
import html from 'highlight.js/lib/languages/xml';
import { common, createLowlight } from 'lowlight';

import { HtmlCodeBlockView } from './html-code-block-view';

const lowlight = createLowlight(common);
lowlight.register('html', html);

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    htmlCodeBlock: {
      setHtmlCodeBlock: (attrs?: { language: string }) => ReturnType;
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
      attrs: (props) => {
        const { node } = props;
        const { activeTab } = node.attrs as HtmlCodeBlockAttributes;

        return {
          'data-active-tab': activeTab,
          [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.HTML_CODE_BLOCK,
        };
      },
    });
  },

  addCommands() {
    return {
      setHtmlCodeBlock: (attrs) => {
        return ({ commands }) => {
          return commands.setNode(this.name, attrs);
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
      /**
       * Without this the browser selects the whole document from inside a code
       * block, because the block is one text node and nothing scopes the
       * selection to it.
       */
      'Mod-a': ({ editor }) => {
        const $pos = editor.state.selection.$anchor;
        if ($pos.node($pos.depth).type.name !== this.name) {
          return false;
        }

        let depth = $pos.depth;
        for (let level = depth; level > 0; level -= 1) {
          if ($pos.node(level).type.name === this.name) {
            depth = level;
            break;
          }
        }

        const from = editor.state.doc.resolve($pos.before(depth) + 1);
        const to = editor.state.doc.resolve($pos.after(depth) - 1);
        const transaction = editor.state.tr.setSelection(
          TextSelection.between(from, to)
        );
        editor.view.dispatch(transaction);

        return true;
      },
      'Mod-Backspace': ({ editor }) => {
        return editor.commands.deleteNode(this.name);
      },
    };
  },
}).configure({ lowlight });
