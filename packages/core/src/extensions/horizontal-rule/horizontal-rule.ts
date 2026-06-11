import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { mergeAttributes } from '@tiptap/core';
import { HorizontalRule as TiptapHorizontalRule } from '@tiptap/extension-horizontal-rule';

export const HorizontalRuleExtension = TiptapHorizontalRule.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        {
          [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.HORIZONTAL_RULE,
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      ['hr'],
    ];
  },
});
