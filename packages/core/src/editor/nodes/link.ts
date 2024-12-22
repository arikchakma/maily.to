import TiptapLink from '@tiptap/extension-link';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customLink: {
      setIsUrlVariable: (isUrlVariable: boolean) => ReturnType;
    };
  }
}

export const LinkExtension = TiptapLink.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      isUrlVariable: {
        default: false,
      },
    };
  },
  addCommands() {
    return {
      ...this.parent?.(),

      setIsUrlVariable:
        (isUrlVariable) =>
        ({ chain }) => {
          return chain().setMark('link', { isUrlVariable }).run();
        },
    };
  },
});
