import type { FontFamilyItem } from '@maily-to/shared';
import { DEFAULT_FONT_FAMILIES, MAILY_EXTENSION_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useMemo } from 'react';

import type { StyleOptions } from '~/extensions/style/style';

import { useEditorInstance } from './use-editor-instance';

export function useFontFamilies(editor?: Editor): FontFamilyItem[] {
  const editorInstance = useEditorInstance(editor);

  return useMemo(() => {
    const extension = editorInstance.extensionManager.extensions.find(
      (candidate) => {
        return candidate.name === MAILY_EXTENSION_TYPES.STYLE;
      }
    );

    if (!extension) {
      return DEFAULT_FONT_FAMILIES;
    }

    return (extension.options as StyleOptions).fontFamilies;
  }, [editorInstance]);
}
