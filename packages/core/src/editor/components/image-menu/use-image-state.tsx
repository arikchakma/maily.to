import { DEFAULT_LOGO_SIZE } from '@/editor/nodes/logo';
import { Editor, useEditorState } from '@tiptap/react';
import deepEql from 'fast-deep-equal';

export const useImageState = (editor: Editor) => {
  const states = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        width: ctx.editor.getAttributes('image').width,
        height: ctx.editor.getAttributes('image').height,
        isImageActive: ctx.editor.isActive('image'),
        isLogoActive: ctx.editor.isActive('logo'),
        alignment:
          ctx.editor.getAttributes('image')?.alignment ||
          ctx.editor.getAttributes('logo')?.alignment,

        logoSize: ctx.editor.getAttributes('logo')?.size || DEFAULT_LOGO_SIZE,
        imageSrc:
          ctx.editor.getAttributes('image')?.src ||
          ctx.editor.getAttributes('logo')?.src ||
          '',
        imageExternalLink:
          ctx.editor.getAttributes('image')?.externalLink || '',
      };
    },
    equalityFn: deepEql,
  });

  return states;
};
