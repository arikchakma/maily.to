import { Extension } from '@tiptap/core';
import { FileHandler } from '@tiptap/extension-file-handler';

import { uploadImageFile } from './upload-image-file';

export const IMAGE_UPLOAD_EXTENSION_NAME = 'imageUpload';

export const IMAGE_UPLOAD_STATUSES = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
  LOADED: 'loaded',
} as const;

export type ImageUploadStatus =
  (typeof IMAGE_UPLOAD_STATUSES)[keyof typeof IMAGE_UPLOAD_STATUSES];

export type ImageUploadStorage = {
  uploads: Map<string, ImageUploadStatus>;
};

declare module '@tiptap/core' {
  interface Storage {
    imageUpload: ImageUploadStorage;
  }
}

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

export type ImageUploadContext = {
  position: number;
  removeImage: () => void;
};

export type ImageUploadOptions = {
  onImageUpload?: (file: File, context: ImageUploadContext) => Promise<string>;
  onImageUploadError?: (
    error: unknown,
    file: File,
    context: ImageUploadContext
  ) => void;
};

export const ImageUploadExtension = Extension.create<
  ImageUploadOptions,
  ImageUploadStorage
>({
  name: IMAGE_UPLOAD_EXTENSION_NAME,

  addOptions() {
    return {
      onImageUpload: undefined,
      onImageUploadError: undefined,
    };
  },

  addStorage() {
    return {
      uploads: new Map<string, ImageUploadStatus>(),
    };
  },

  addExtensions() {
    return [
      FileHandler.configure({
        allowedMimeTypes: [...ALLOWED_IMAGE_MIME_TYPES],
        onDrop: (editor, files, pos) => {
          for (const file of files) {
            uploadImageFile(editor, file, pos);
          }
        },
        onPaste: (editor, files) => {
          for (const file of files) {
            uploadImageFile(editor, file, editor.state.selection.from);
          }
        },
      }),
    ];
  },
});
