import { invariant, MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/core';

import type { ImageUploadContext, ImageUploadOptions } from './image-upload';
import {
  IMAGE_UPLOAD_EXTENSION_NAME,
  IMAGE_UPLOAD_STATUSES,
} from './image-upload';

type FoundImage = {
  node: NonNullable<ReturnType<Editor['state']['doc']['nodeAt']>>;
  pos: number;
};

function notifyUploadStatusChanged(editor: Editor) {
  editor.view.dispatch(
    editor.state.tr.setMeta('__mly_image_upload_status_changed', true)
  );
}

function getUploadOptions(editor: Editor): ImageUploadOptions {
  const extension = editor.extensionManager.extensions.find(
    (candidate) => candidate.name === IMAGE_UPLOAD_EXTENSION_NAME
  );

  invariant(
    extension,
    `You must add the "${IMAGE_UPLOAD_EXTENSION_NAME}" extension to the editor to upload images.`
  );

  return extension.options as ImageUploadOptions;
}

function findImageByBlobUrl(editor: Editor, blobUrl: string) {
  let found: FoundImage | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (found) {
      return false;
    }

    if (
      node.type.name === MAILY_NODE_TYPES.IMAGE &&
      node.attrs.src === blobUrl
    ) {
      found = { node, pos };
      return false;
    }

    return true;
  });

  return found as FoundImage | null;
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

  editor.view.dispatch(
    editor.state.tr.delete(found.pos, found.pos + found.node.nodeSize)
  );
}

export function uploadImageFile(
  editor: Editor,
  file: File,
  position: number
): void {
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
    removeImage: () => removeImageByBlobUrl(editor, blobUrl),
  };
  const { uploads } = editor.storage.imageUpload;

  uploads.set(blobUrl, IMAGE_UPLOAD_STATUSES.LOADING);
  notifyUploadStatusChanged(editor);

  onImageUpload(file, context)
    .then((url) => {
      uploads.delete(blobUrl);
      notifyUploadStatusChanged(editor);
      updateImageByBlobUrl(editor, blobUrl, { src: url });
      URL.revokeObjectURL(blobUrl);
    })
    .catch((error: unknown) => {
      uploads.set(blobUrl, IMAGE_UPLOAD_STATUSES.ERROR);
      notifyUploadStatusChanged(editor);
      onImageUploadError?.(error, file, context);
      URL.revokeObjectURL(blobUrl);
    });
}
