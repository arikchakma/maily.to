import { Editor } from '@tiptap/core';
import { HorizontalRule } from '../extensions/horizontal-rule';
import Image from '@tiptap/extension-image';
import { Spacer } from '../nodes/spacer';
import { ResizableImageExtension } from '../extensions/image-resize';
import { Variable } from '../extensions/variable-extension';
import { ButtonExtension } from '../extensions/button-extension';
import { LinkCardExtension } from '../extensions/link-card';
import { TiptapLogoExtension } from '../nodes/logo';

export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
  const customNodes = [
    HorizontalRule.name,
    Image.name,
    Spacer.name,
    ResizableImageExtension.name,
    Variable.name,
    ButtonExtension.name,
    LinkCardExtension.name,
    TiptapLogoExtension.name,
  ];

  return customNodes.some((type) => editor.isActive(type));
};
