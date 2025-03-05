import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export type ImageUploadOptions = {
  onImageUpload?: (file: Blob) => Promise<string>;
};

// Store the upload function globally for each editor instance
const imageUploadFunctions = new WeakMap<
  object,
  (file: Blob) => Promise<string>
>();

export const ImageUploadExtension = Extension.create<ImageUploadOptions>({
  name: 'imageUpload',

  addOptions() {
    return {
      onImageUpload: undefined,
    };
  },

  onBeforeCreate() {
    const { onImageUpload } = this.options;
    if (onImageUpload) {
      // Store the upload function for this editor instance
      imageUploadFunctions.set(this.editor, onImageUpload);
    }
  },

  addProseMirrorPlugins() {
    const { onImageUpload } = this.options;

    if (!onImageUpload) {
      return [];
    }

    return [
      new Plugin({
        key: new PluginKey('imageUpload'),
        props: {
          handleDOMEvents: {
            drop: (view, event) => {
              // We'll handle drops in the ImageView component
              // This is just for dropping images in empty areas
              if (!event.dataTransfer?.files?.length) {
                return false;
              }

              const images = Array.from(event.dataTransfer.files).filter(
                (file) =>
                  /image\/(jpeg|jpg|png|gif|webp|svg\+xml)/.test(file.type)
              );

              if (images.length === 0) {
                return false;
              }

              // Check if the drop is on an image node
              const pos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });

              if (!pos) {
                return false;
              }

              const node = view.state.doc.nodeAt(pos.pos);

              // If we're dropping on an image node, let the node handle it
              if (
                node &&
                (node.type.name === 'image' || node.type.name === 'logo')
              ) {
                return false;
              }

              event.preventDefault();

              // Handle each dropped image
              images.forEach(async (image) => {
                try {
                  // Upload the image
                  const imageUrl = await onImageUpload(image);

                  // Insert the image at the drop position
                  const { schema } = view.state;
                  const imageNode = schema.nodes.image.create({
                    src: imageUrl,
                  });

                  const transaction = view.state.tr.insert(pos.pos, imageNode);
                  view.dispatch(transaction);
                } catch (error) {
                  console.error('Error uploading image:', error);
                }
              });

              return true;
            },
            paste: (view, event) => {
              if (!event.clipboardData?.files?.length) {
                return false;
              }

              const images = Array.from(event.clipboardData.files).filter(
                (file) =>
                  /image\/(jpeg|jpg|png|gif|webp|svg\+xml)/.test(file.type)
              );

              if (images.length === 0) {
                return false;
              }

              event.preventDefault();

              // Handle each pasted image
              images.forEach(async (image) => {
                try {
                  // Upload the image
                  const imageUrl = await onImageUpload(image);

                  // Insert the image at the current cursor position
                  const { schema } = view.state;
                  const imageNode = schema.nodes.image.create({
                    src: imageUrl,
                  });

                  const transaction =
                    view.state.tr.replaceSelectionWith(imageNode);
                  view.dispatch(transaction);
                } catch (error) {
                  console.error('Error uploading image:', error);
                }
              });

              return true;
            },
          },
        },
      }),
    ];
  },
});

// Helper function to get the upload function for an editor
export function getImageUploadFunction(
  editor: any
): ((file: Blob) => Promise<string>) | undefined {
  return imageUploadFunctions.get(editor);
}
