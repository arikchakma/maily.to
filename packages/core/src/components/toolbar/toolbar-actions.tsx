import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';
import { MAILY_MARK_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import type { LucideIcon } from 'lucide-react';
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  Redo2Icon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
} from 'lucide-react';

import { useEditorInstance } from '~/hooks/use-editor-instance';

import { BubbleButton } from '../interface/bubble-button';
import { ToolbarAlign } from './toolbar-align';
import { ToolbarDirection } from './toolbar-direction';
import { ToolbarGroup } from './toolbar-group';

type MarkName = keyof Pick<
  Editor['commands'],
  | 'toggleBold'
  | 'toggleCode'
  | 'toggleItalic'
  | 'toggleStrike'
  | 'toggleUnderline'
>;

type MarkActionProps = {
  command: MarkName;
  icon: LucideIcon;
  label: string;
  name: string;
};

function MarkAction(props: MarkActionProps) {
  const { command, icon, label, name } = props;
  const editor = useEditorInstance();

  const isActive = useEditorState({
    editor,
    selector: ({ editor: instance }) => instance.isActive(name),
  });

  return (
    <BubbleButton
      render={<ToolbarPrimitive.Button />}
      icon={icon}
      isActive={isActive}
      label={label}
      onClick={() => editor.chain().focus()[command]().run()}
      tooltip={label}
    />
  );
}

export function ToolbarUndo() {
  const editor = useEditorInstance();

  const canUndo = useEditorState({
    editor,
    selector: ({ editor: instance }) => instance.can().undo(),
  });

  return (
    <BubbleButton
      render={<ToolbarPrimitive.Button />}
      disabled={!canUndo}
      icon={Undo2Icon}
      label="Undo"
      onClick={() => editor.chain().focus().undo().run()}
      tooltip="Undo"
    />
  );
}

export function ToolbarRedo() {
  const editor = useEditorInstance();

  const canRedo = useEditorState({
    editor,
    selector: ({ editor: instance }) => instance.can().redo(),
  });

  return (
    <BubbleButton
      render={<ToolbarPrimitive.Button />}
      disabled={!canRedo}
      icon={Redo2Icon}
      label="Redo"
      onClick={() => editor.chain().focus().redo().run()}
      tooltip="Redo"
    />
  );
}

export function ToolbarBold() {
  return (
    <MarkAction
      command="toggleBold"
      icon={BoldIcon}
      label="Bold"
      name={MAILY_MARK_TYPES.BOLD}
    />
  );
}

export function ToolbarItalic() {
  return (
    <MarkAction
      command="toggleItalic"
      icon={ItalicIcon}
      label="Italic"
      name={MAILY_MARK_TYPES.ITALIC}
    />
  );
}

export function ToolbarUnderline() {
  return (
    <MarkAction
      command="toggleUnderline"
      icon={UnderlineIcon}
      label="Underline"
      name={MAILY_MARK_TYPES.UNDERLINE}
    />
  );
}

export function ToolbarStrikethrough() {
  return (
    <MarkAction
      command="toggleStrike"
      icon={StrikethroughIcon}
      label="Strikethrough"
      name={MAILY_MARK_TYPES.STRIKE}
    />
  );
}

export function ToolbarCode() {
  return (
    <MarkAction
      command="toggleCode"
      icon={CodeIcon}
      label="Code"
      name={MAILY_MARK_TYPES.CODE}
    />
  );
}

export function ToolbarCommonActions() {
  return (
    <>
      <ToolbarGroup>
        <ToolbarUndo />
        <ToolbarRedo />
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarBold />
        <ToolbarItalic />
        <ToolbarUnderline />
        <ToolbarStrikethrough />
        <ToolbarCode />
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarAlign />
        <ToolbarDirection />
      </ToolbarGroup>
    </>
  );
}
