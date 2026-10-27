import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { HorizontalRule as TiptapHorizontalRule } from '@tiptap/extension-horizontal-rule';

export const HorizontalRuleExtension = TiptapHorizontalRule.configure({
  HTMLAttributes: {
    [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.HORIZONTAL_RULE,
  },
});
