import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { Table } from '@tiptap/extension-table';

function getNumericAttribute(name: string) {
  return {
    default: 0,
    parseHTML: (element: HTMLElement) =>
      Number(element.getAttribute(name)) || 0,
    renderHTML: (attributes: Record<string, unknown>) => ({
      [name]: attributes[name],
    }),
  };
}

export const TableExtension = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      border: getNumericAttribute('border'),
      cellpadding: getNumericAttribute('cellpadding'),
      cellspacing: getNumericAttribute('cellspacing'),
      responsive: {
        default: false,
        parseHTML: (element) => {
          if (element.getAttribute('data-mly-responsive') === 'stack') {
            return true;
          }

          const cells = element.querySelectorAll(
            ':scope > tbody > tr > td[data-id="__react-email-column"]'
          );

          return cells.length > 1;
        },
        renderHTML: (attributes) =>
          attributes.responsive ? { 'data-mly-responsive': 'stack' } : {},
      },
    };
  },
}).configure({
  HTMLAttributes: {
    [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.TABLE,
  },
  resizable: false,
  View: null,
});
