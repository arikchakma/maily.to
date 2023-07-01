import { mergeAttributes, Node, wrappingInputRule } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

export interface SpacerOptions {
  height: "sm" | "md" | "lg" | "xl",
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    spacer: {
      setSpacer: (options: {
        height: SpacerOptions["height"]
      }) => ReturnType,

      /*
      * Change the spacer height
      */
      setSpacerSize: (height: SpacerOptions["height"]) => ReturnType,

      /*
      * Unset the spacer
      */
      unsetSpacer: () => ReturnType,
    },
  }
}

export const Spacer = Node.create<SpacerOptions>({
  name: 'spacer',

  addOptions() {
    return {
      height: "sm",
      HTMLAttributes: {},
    }
  },
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      'mailbox-component': {
        default: "spacer",
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
      height: {
        default: "sm",
        parseHTML: (element) => {
          return {
            height: element.dataset.height,
          }
        },
        renderHTML: (attributes) => {
          return {
            "data-height": attributes.height,
          }
        }
      },
    }
  },

  addCommands() {
    return {
      setSpacer: (options) => ({ chain }) => {
        return (
          chain().insertContent({
            type: this.name,
            attrs: {
              height: options.height,
            }
          })
            // set cursor after horizontal rule
            .command(({ tr, dispatch }) => {
              if (dispatch) {
                const { $to } = tr.selection
                const posAfter = $to.end()

                if ($to.nodeAfter) {
                  tr.setSelection(TextSelection.create(tr.doc, $to.pos))
                } else {
                  const node = $to.parent.type.contentMatch.defaultType?.create()

                  if (node) {
                    tr.insert(posAfter, node)
                    tr.setSelection(TextSelection.create(tr.doc, posAfter))
                  }
                }

                tr.scrollIntoView()
              }

              return true
            })
            .run()
        )
      },

      setSpacerSize: (height) => ({ commands }) => {
        if (!["sm", "md", "lg", "xl"].includes(height)) {
          throw new Error("Invalid spacer height")
        }
        return commands.updateAttributes('spacer', { height })
      },

      unsetSpacer: () => ({ commands }) => {
        return commands.deleteNode('spacer')
      }
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-0': () => this.editor.commands.setSpacer({ height: "sm" }),
      'Mod-Shift-1': () => this.editor.commands.setSpacer({ height: "md" }),
      'Mod-Shift-2': () => this.editor.commands.setSpacer({ height: "lg" }),
      'Mod-Shift-3': () => this.editor.commands.setSpacer({ height: "xl" }),
    }
  },

  renderHTML({ HTMLAttributes, node }) {
    const { height } = node.attrs as SpacerOptions
    switch (height) {
      case "sm":
        HTMLAttributes.style = "width: 100%; height: 8px;"
        break
      case "md":
        HTMLAttributes.style = "width: 100%; height: 16px;"
        break
      case "lg":
        HTMLAttributes.style = "width: 100%; height: 32px;"
        break
      case "xl":
        HTMLAttributes.style = "width: 100%; height: 64px;"
        break
      default:
        HTMLAttributes.style = "width: 100%; height: 8px;"
        break
    }
    return ['div', mergeAttributes(HTMLAttributes, {
      class: "spacer",
      contenteditable: false,
    })]
  },
  parseHTML() {
    return [{ tag: 'img[data-mailbox-component="spacer"]' }]
  },
})
