import Mention from '@tiptap/extension-mention'

export const Variable = Mention.extend({
  name: 'variable',
  parseHTML() {
    return [
      {
        tag: 'span[data-type="variable"]',
      },
    ]
  }
})
