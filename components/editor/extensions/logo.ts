import { mergeAttributes } from '@tiptap/core'
import TiptapImage, { ImageOptions } from '@tiptap/extension-image'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    logo: {
      /**
       * Comments will be added to the autocomplete.
       */
      setLogoImage: (options: {
        src: string;
        alt?: string;
        title?: string;
      }) => ReturnType,

      setLogoAttributes: (attributes: {
        size?: "sm" | "md" | "lg"
        alignment?: "left" | "center" | "right"
      }) => ReturnType,
    }
  }
}

export interface TiptapLogoAttributes {
  size: "sm" | "md" | "lg"
  alignment: "left" | "center" | "right"
}

export const TiptapLogoExtension = TiptapImage.extend<TiptapLogoAttributes>({
  name: 'logo',
  addAttributes() {
    return {
      ...this.parent?.(),
      'mailbox-component': {
        default: "logo",
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
      size: {
        default: "sm",
        parseHTML: (element) => {
          return {
            size: element.dataset.size,
          }
        },
        renderHTML: (attributes) => {
          return {
            "data-size": attributes.size,
          }
        }
      },
      alignment: {
        default: "left",
        parseHTML: (element) => {
          return {
            alignment: element.dataset.alignment,
          }
        },
        renderHTML: (attributes) => {
          return {
            "data-alignment": attributes.alignment,
          }
        }
      }
    }
  },
  addCommands() {
    return {
      setLogoImage: (options) => ({ tr, dispatch }) => {
        const { selection } = tr
        const node = this.type.create(options)

        if (dispatch) {
          tr.replaceRangeWith(selection.from, selection.to, node)
        }

        return true
      },
      setLogoAttributes: (attributes) => ({ commands }) => {
        return commands.updateAttributes("logo", attributes)
      }
    }
  },
  renderHTML({ HTMLAttributes, node }) {
    const { size, alignment } = node.attrs as TiptapLogoAttributes
    switch (size) {
      case "sm":
        HTMLAttributes.class = "h-10"
        break
      case "md":
        HTMLAttributes.class = "h-12"
        break
      case "lg":
        HTMLAttributes.class = "h-16"
        break
      default:
        HTMLAttributes.class = "h-10"
        break
    }

    switch (alignment) {
      case "left":
        HTMLAttributes.style = "position:relative; margin-top:0; margin-right:auto; margin-left:0;"
        break
      case "center":
        HTMLAttributes.style = "position:relative; margin-top:0; margin-right:auto; margin-left:auto;"
        break
      case "right":
        HTMLAttributes.style = "position:relative; margin-top:0; margin-right:0; margin-left:auto;"
        break
      default:
        HTMLAttributes.style = "position:relative; margin-top:0; margin-right:auto; margin-left:0;"
        break
    }
    return ['img', mergeAttributes(HTMLAttributes)]
  },
  parseHTML() {
    return [
      {
        tag: 'img[data-mailbox-component="logo"]',
      },
    ]
  }
})

// {
//   "doc": {
//     "type": "doc",
//       "content": [
//         {
//           "type": "paragraph",
//           "attrs": {
//             "textAlign": "left"
//           }
//         },
//         {
//           "type": "logo",
//           "attrs": {
//             "src": "https://binsta.dev/api/v1/files/4eR1893USp/transform?format=webp&size=lg&quality=md",
//             "alt": "",
//             "size": "lg",
//             "alignment": "center",
//             "mailed-component": "logo"
//           }
//         }
//       ]
//   }
// }
