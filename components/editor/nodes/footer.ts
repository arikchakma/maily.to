import { Node, mergeAttributes } from '@tiptap/core'


export interface FooterOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    footer: {
      setFooter: () => ReturnType,
    }
  }
}

export const Footer = Node.create<FooterOptions>({
  name: 'footer',
  group: 'block',
  content: 'inline*',
  addAttributes() {
    return {
      'mailbox-component': {
        default: "footer",
        renderHTML: (attributes) => {
          return {
            'data-mailbox-component': attributes['mailbox-component'],
          }
        },
        parseHTML: (element) => {
          return {
            'data-mailbox-component': element.dataset.mailboxComponent,
          }
        }
      },
    }
  },

  addCommands() {
    return {
      setFooter: () => ({ commands }) => {
        return commands.setNode(this.name)
      }
    }
  },

  parseHTML() {
    return [{ tag: 'small[data-mailbox-component="footer"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['small', mergeAttributes(HTMLAttributes, {
      class: "text-slate-500 footer",
    }), 0]
  }
})
