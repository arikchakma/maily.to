import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';

import { getSingleCell } from '~/utils/table';

export const ContainerExtension = Node.create({
  name: MAILY_NODE_TYPES.CONTAINER,
  group: 'block',
  content: 'block+',
  defining: true,
  // A document renders exactly one `<body>`, so nothing may split the
  // container it holds: an empty paragraph left at the end would otherwise
  // lift out and tear it in two.
  isolating: true,

  parseHTML() {
    return [
      { tag: `div[${DATA_NODE_TYPE_KEY}="${MAILY_NODE_TYPES.CONTAINER}"]` },
      {
        tag: 'table',
        priority: 60,
        getAttrs: (element) => {
          if (!element.style.maxWidth) {
            return false;
          }

          return getSingleCell(element) ? null : false;
        },
        contentElement: (element) =>
          getSingleCell(element as HTMLElement) ?? (element as HTMLElement),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.CONTAINER },
        HTMLAttributes
      ),
      0,
    ];
  },
});
