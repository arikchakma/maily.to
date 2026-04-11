import type { FontFamilyItem } from '@maily-to/shared';
import { DEFAULT_FONT_FAMILIES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useMemo } from 'react';

import type { FontStyleOptions } from '~/extensions/font-style/font-style';

import { useEditorInstance } from './use-editor-instance';

const FONT_STYLE_EXTENSION_NAME = 'fontStyle';

export function useFontStyleOptions(editor?: Editor): FontStyleOptions {
  const editorInstance = useEditorInstance(editor);

  return useMemo(() => {
    const extension = editorInstance.extensionManager.extensions.find(
      (ext) => ext.name === FONT_STYLE_EXTENSION_NAME
    );

    if (!extension) {
      return {
        types: [],
        fontFamilies: DEFAULT_FONT_FAMILIES,
      };
    }

    return extension.options as FontStyleOptions;
  }, [editorInstance]);
}

export function useFontFamilies(editor?: Editor): FontFamilyItem[] {
  const options = useFontStyleOptions(editor);
  return options.fontFamilies;
}
