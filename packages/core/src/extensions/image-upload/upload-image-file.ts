import { MAILY_ERROR_PREFIX, MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/core';

import {
  IMAGE_UPLOAD_EXTENSION_NAME,
  IMAGE_UPLOAD_STATUSES,
} from './image-upload';
import type { ImageUploadContext, ImageUploadOptions } from './image-upload';

function notifyImageUploadStatusChanged(editor: Editor) {
  editor.view.dispatch(
    editor.state.tr.setMeta('__mly_image_upload_status_changed', true)
  );
}

function getUploadOptions(editor: Editor): Required<ImageUploadOptions> {
  const ext = editor.extensionManager.extensions.find(
    (e) => e.name === IMAGE_UPLOAD_EXTENSION_NAME
  );

  if (!ext) {
    throw new Error(
      `${MAILY_ERROR_PREFIX}: You must add the "${IMAGE_UPLOAD_EXTENSION_NAME}" extension to the editor to use the image upload feature.`
    );
  }

  return ext.options;
}

type ImageNode = ReturnType<Editor['state']['doc']['nodeAt']>;

type FoundImage = { pos: number; node: NonNullable<ImageNode> };

function findImageByBlobUrl(
  editor: Editor,
  blobUrl: string
): FoundImage | null {
  let result: FoundImage | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (result) {
      return false;
    }

    if (
      node.type.name === MAILY_NODE_TYPES.IMAGE &&
      node.attrs.src === blobUrl
    ) {
      result = { pos, node };
      return false;
    }

    return true;
  });

  return result;
}

function updateImageByBlobUrl(
  editor: Editor,
  blobUrl: string,
  attrs: Record<string, unknown>
) {
  const found = findImageByBlobUrl(editor, blobUrl);
  if (!found) {
    return;
  }

  const { tr } = editor.state;
  tr.setNodeMarkup(found.pos, undefined, { ...found.node.attrs, ...attrs });
  editor.view.dispatch(tr);
}

function removeImageByBlobUrl(editor: Editor, blobUrl: string) {
  const found = findImageByBlobUrl(editor, blobUrl);
  if (!found) {
    return;
  }

  const { tr } = editor.state;
  tr.delete(found.pos, found.pos + found.node.nodeSize);
  editor.view.dispatch(tr);
}

export function uploadImageFile(editor: Editor, file: File, position: number) {
  const { onImageUpload, onImageUploadError } = getUploadOptions(editor);
  if (!onImageUpload) {
    return;
  }

  const blobUrl = URL.createObjectURL(file);

  const inserted = editor
    .chain()
    .insertContentAt(position, {
      type: MAILY_NODE_TYPES.IMAGE,
      attrs: { src: blobUrl },
    })
    .run();

  if (!inserted) {
    URL.revokeObjectURL(blobUrl);
    return;
  }

  const context: ImageUploadContext = {
    position,
    removeImage: () => {
      removeImageByBlobUrl(editor, blobUrl);
    },
  };

  const uploads = editor.storage.imageUpload.uploads;

  uploads.set(blobUrl, IMAGE_UPLOAD_STATUSES.LOADING);
  notifyImageUploadStatusChanged(editor);

  onImageUpload(file, context)
    .then((url) => {
      uploads.delete(blobUrl);
      notifyImageUploadStatusChanged(editor);

      updateImageByBlobUrl(editor, blobUrl, { src: url });
      URL.revokeObjectURL(blobUrl);
    })
    .catch((error: unknown) => {
      uploads.set(blobUrl, IMAGE_UPLOAD_STATUSES.ERROR);
      notifyImageUploadStatusChanged(editor);

      onImageUploadError?.(error, file, context);
      URL.revokeObjectURL(blobUrl);
    });
}
