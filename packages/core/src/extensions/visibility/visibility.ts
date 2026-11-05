import type { VisibilityRule } from '@maily-to/shared';
import {
  getVisibilityRule,
  getVisibilityValueSupport,
  MAILY_EXTENSION_TYPES,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import { Extension } from '@tiptap/core';

export const VISIBILITY_SUPPORTED_TYPES: string[] = [
  MAILY_NODE_TYPES.PARAGRAPH,
  MAILY_NODE_TYPES.HEADING,
  MAILY_NODE_TYPES.IMAGE,
  MAILY_NODE_TYPES.SPACER,
  MAILY_NODE_TYPES.SECTION,
  MAILY_NODE_TYPES.COLUMNS,
  MAILY_NODE_TYPES.BULLET_LIST,
  MAILY_NODE_TYPES.ORDERED_LIST,
  MAILY_NODE_TYPES.HORIZONTAL_RULE,
  MAILY_NODE_TYPES.BUTTON,
  MAILY_NODE_TYPES.REPEAT,
  MAILY_NODE_TYPES.HTML_CODE_BLOCK,
  MAILY_NODE_TYPES.LINK_CARD,
];

export type VisibilityOptions = {
  types: string[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    visibility: {
      setVisibilityRule: (
        typeOrName: string,
        rule: VisibilityRule
      ) => ReturnType;
      unsetVisibilityRule: (typeOrName: string) => ReturnType;
    };
  }
}

function getRuleAttributes(rule: VisibilityRule): Record<string, string> {
  const attributes: Record<string, string> = {
    'data-visibility-action': rule.action,
    'data-visibility-operator': rule.operator,
    'data-visibility-variable': rule.variable,
  };

  if (getVisibilityValueSupport(rule.operator)) {
    attributes['data-visibility-value'] = rule.value;
  }

  return attributes;
}

export const VisibilityExtension = Extension.create<VisibilityOptions>({
  name: MAILY_EXTENSION_TYPES.VISIBILITY,

  addOptions() {
    return {
      types: VISIBILITY_SUPPORTED_TYPES,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          visibilityRule: {
            default: null,
            keepOnSplit: false,
            parseHTML: (element) =>
              getVisibilityRule({
                action: element.getAttribute('data-visibility-action'),
                operator: element.getAttribute('data-visibility-operator'),
                value: element.getAttribute('data-visibility-value'),
                variable: element.getAttribute('data-visibility-variable'),
              }),
            renderHTML: (attributes) => {
              const rule = attributes.visibilityRule as VisibilityRule | null;

              return rule ? getRuleAttributes(rule) : {};
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setVisibilityRule:
        (typeOrName, rule) =>
        ({ commands }) =>
          commands.updateAttributes(typeOrName, { visibilityRule: rule }),

      unsetVisibilityRule:
        (typeOrName) =>
        ({ commands }) =>
          commands.updateAttributes(typeOrName, { visibilityRule: null }),
    };
  },
});
