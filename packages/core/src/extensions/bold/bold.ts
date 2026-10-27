import { Bold } from '@tiptap/extension-bold';

import { isBoldFontWeight } from '~/utils/style';

export const BoldExtension = Bold.extend({
  parseHTML() {
    return [
      { tag: 'strong' },
      {
        tag: 'b',
        getAttrs: (element) => {
          return element.style.fontWeight !== 'normal' && null;
        },
      },
      {
        style: 'font-weight=400',
        clearMark: (mark) => {
          return mark.type.name === this.name;
        },
      },
      {
        style: 'font-weight',
        getAttrs: (value) => {
          return isBoldFontWeight(value) && null;
        },
      },
    ];
  },
});
