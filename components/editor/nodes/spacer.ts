import { mergeAttributes, Node } from "@tiptap/core";

export interface SpacerOptions {
  height: "sm" | "md" | "lg" | "xl";
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    spacer: {
      setSpacer: (options: { height: SpacerOptions["height"] }) => ReturnType;

      /*
       * Change the spacer height
       */
      setSpacerSize: (height: SpacerOptions["height"]) => ReturnType;

      /*
       * Unset the spacer
       */
      unsetSpacer: () => ReturnType;
    };
  }
}

export const Spacer = Node.create<SpacerOptions>({
  name: "spacer",
  priority: 1000,

  group: "block",
  draggable: true,
  addAttributes() {
    return {
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-height"),
        renderHTML: (attributes) => {
          return {
            "data-height": attributes.height,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setSpacer:
        (options) =>
          ({ chain, commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: {
                height: options.height,
              },
            });
          },

      setSpacerSize:
        (height) =>
          ({ commands }) => {
            if (!["sm", "md", "lg", "xl"].includes(height)) {
              throw new Error("Invalid spacer height");
            }
            return commands.updateAttributes("spacer", { height });
          },

      unsetSpacer:
        () =>
          ({ commands }) => {
            return commands.deleteNode("spacer");
          },
    };
  },
  renderHTML({ HTMLAttributes, node }) {
    const { height } = node.attrs as SpacerOptions;
    switch (height) {
      case "sm":
        HTMLAttributes.style = "width: 100%; height: 8px;";
        break;
      case "md":
        HTMLAttributes.style = "width: 100%; height: 16px;";
        break;
      case "lg":
        HTMLAttributes.style = "width: 100%; height: 32px;";
        break;
      case "xl":
        HTMLAttributes.style = "width: 100%; height: 64px;";
        break;
      default:
        HTMLAttributes.style = "width: 100%; height: 8px;";
        break;
    }
    return [
      "div",
      mergeAttributes({
        "data-mailbox-component": this.name,
      }, this.options.HTMLAttributes, HTMLAttributes, {
        class: "spacer",
        contenteditable: false,
      }),
    ];
  },
  parseHTML() {
    return [{ tag: `div[data-mailbox-component="${this.name}"]` }];
  },
});
