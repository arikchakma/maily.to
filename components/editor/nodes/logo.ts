import { mergeAttributes } from "@tiptap/core";
import TiptapImage, { ImageOptions } from "@tiptap/extension-image";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    logo: {
      setLogoImage: (options: {
        src: string;
        alt?: string;
        title?: string;
      }) => ReturnType;

      setLogoAttributes: (attributes: {
        size?: "sm" | "md" | "lg";
        alignment?: "left" | "center" | "right";
      }) => ReturnType;
    };
  }
}

export interface TiptapLogoAttributes {
  size: "sm" | "md" | "lg";
  alignment: "left" | "center" | "right";
  HTMLAttributes: Record<string, any>;
}

export const TiptapLogoExtension = TiptapImage.extend<TiptapLogoAttributes>({
  name: "logo",
  priority: 1000,
  addAttributes() {
    return {
      ...this.parent?.(),
      "mailbox-component": {
        default: "logo",
        renderHTML: (attributes) => {
          return {
            "data-mailbox-component": attributes["mailbox-component"],
          };
        },
        parseHTML: (element) => {
          return {
            "data-mailbox-component": element.dataset.mailboxComponent,
          };
        },
      },
      size: {
        default: "sm",
        parseHTML: (element) => {
          return {
            size: element.dataset.size,
          };
        },
        renderHTML: (attributes) => {
          return {
            "data-size": attributes.size,
          };
        },
      },
      alignment: {
        default: "left",
        parseHTML: (element) => {
          return {
            alignment: element.dataset.alignment,
          };
        },
        renderHTML: (attributes) => {
          return {
            "data-alignment": attributes.alignment,
          };
        },
      },
    };
  },
  addCommands() {
    return {
      setLogoImage:
        (options) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          },
      setLogoAttributes:
        (attributes) =>
          ({ commands }) => {
            return commands.updateAttributes("logo", attributes);
          },
    };
  },
  renderHTML({ HTMLAttributes, node }) {
    const { size, alignment } = node.attrs as TiptapLogoAttributes;
    const style = ["position:relative", "margin-top:0"];
    switch (size) {
      case "sm":
        style.push("height:40px");
        break;
      case "md":
        style.push("height:48px");
        break;
      case "lg":
        style.push("height:64px");
        break;
      default:
        style.push("height:40px");
        break;
    }

    switch (alignment) {
      case "left":
        style.push("margin-right:auto");
        style.push("margin-left:0");
        break;
      case "center":
        style.push("margin-right:auto");
        style.push("margin-left:auto");
        break;
      case "right":
        style.push("margin-right:0");
        style.push("margin-left:auto");
        break;
      default:
        style.push("margin-right:auto");
        style.push("margin-left:0");
        break;
    }

    HTMLAttributes.style = style.join(";");
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },
  parseHTML() {
    return [
      {
        tag: `img[data-mailbox-component="${this.name}"]`
      },
    ];
  },
});
