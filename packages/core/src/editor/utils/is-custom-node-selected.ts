import { Editor } from '@tiptap/core';
import { HorizontalRule } from '../extensions/horizontal-rule';
import Image from '@tiptap/extension-image';
import { Spacer } from '../nodes/spacer';
import { ResizableImageExtension } from '../extensions/image-resize';
import { LinkCardExtension } from '../extensions/link-card';
import { TiptapLogoExtension } from '../nodes/logo';
import { ButtonExtension } from '../nodes/button/button';
import { VariableExtension } from '../nodes/variable/variable';

export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
  const customNodes = [
    HorizontalRule.name,
    Image.name,
    Spacer.name,
    ResizableImageExtension.name,
    VariableExtension.name,
    LinkCardExtension.name,
    TiptapLogoExtension.name,
    ButtonExtension.name,
  ];

  return customNodes.some((type) => editor.isActive(type));
};
