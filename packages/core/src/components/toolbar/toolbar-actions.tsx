import { MAILY_MARK_TYPES } from '@maily-to/shared';
import { useEditorState } from '@tiptap/react';
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
import { cn } from '~/utils/classname';

import { BubbleButton } from '../interface/bubble-button';
import { Group } from './toolbar';
import { ToolbarAlign } from './toolbar-align';
import { useToolbarContext } from './toolbar-context';
import { ToolbarDirection } from './toolbar-direction';

type ToolbarActionProps = {
  className?: string;
};

export function ToolbarUndo(props: ToolbarActionProps) {
  const { className } = props;
  const editor = useEditorInstance();
  const { container } = useToolbarContext();

  const canUndo = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.can().undo(),
  });

  return (
    <BubbleButton
      label="Undo"
      icon={Undo2Icon}
      tooltip="Undo"
      container={container}
      disabled={!canUndo}
      className={cn(className)}
      onClick={() => editor.chain().focus().undo().run()}
    />
  );
}

export function ToolbarRedo(props: ToolbarActionProps) {
  const { className } = props;
  const editor = useEditorInstance();
  const { container } = useToolbarContext();

  const canRedo = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.can().redo(),
  });

  return (
    <BubbleButton
      label="Redo"
      icon={Redo2Icon}
      tooltip="Redo"
      container={container}
      disabled={!canRedo}
      className={cn(className)}
      onClick={() => editor.chain().focus().redo().run()}
    />
  );
}

export function ToolbarBold(props: ToolbarActionProps) {
  const { className } = props;
  const editor = useEditorInstance();
  const { container } = useToolbarContext();

  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive(MAILY_MARK_TYPES.BOLD),
  });

  return (
    <BubbleButton
      label="Bold"
      icon={BoldIcon}
      tooltip="Bold"
      container={container}
      isActive={isActive}
      className={cn(className)}
      onClick={() => editor.chain().focus().toggleBold().run()}
    />
  );
}

export function ToolbarItalic(props: ToolbarActionProps) {
  const { className } = props;
  const editor = useEditorInstance();
  const { container } = useToolbarContext();

  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive(MAILY_MARK_TYPES.ITALIC),
  });

  return (
    <BubbleButton
      label="Italic"
      icon={ItalicIcon}
      tooltip="Italic"
      container={container}
      isActive={isActive}
      className={cn(className)}
      onClick={() => editor.chain().focus().toggleItalic().run()}
    />
  );
}

export function ToolbarUnderline(props: ToolbarActionProps) {
  const { className } = props;
  const editor = useEditorInstance();
  const { container } = useToolbarContext();

  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive(MAILY_MARK_TYPES.UNDERLINE),
  });

  return (
    <BubbleButton
      label="Underline"
      icon={UnderlineIcon}
      tooltip="Underline"
      container={container}
      isActive={isActive}
      className={cn(className)}
      onClick={() => editor.chain().focus().toggleUnderline().run()}
    />
  );
}

export function ToolbarStrikethrough(props: ToolbarActionProps) {
  const { className } = props;
  const editor = useEditorInstance();
  const { container } = useToolbarContext();

  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive(MAILY_MARK_TYPES.STRIKE),
  });

  return (
    <BubbleButton
      label="Strikethrough"
      icon={StrikethroughIcon}
      tooltip="Strikethrough"
      container={container}
      isActive={isActive}
      className={cn(className)}
      onClick={() => editor.chain().focus().toggleStrike().run()}
    />
  );
}

export function ToolbarCode(props: ToolbarActionProps) {
  const { className } = props;
  const editor = useEditorInstance();
  const { container } = useToolbarContext();

  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive(MAILY_MARK_TYPES.CODE),
  });

  return (
    <BubbleButton
      label="Code"
      icon={CodeIcon}
      tooltip="Code"
      container={container}
      isActive={isActive}
      className={cn(className)}
      onClick={() => editor.chain().focus().toggleCode().run()}
    />
  );
}

export function ToolbarCommonActions() {
  return (
    <>
      <Group>
        <ToolbarUndo />
        <ToolbarRedo />
      </Group>
      <Group>
        <ToolbarBold />
        <ToolbarItalic />
        <ToolbarUnderline />
        <ToolbarStrikethrough />
        <ToolbarCode />
      </Group>
      <Group>
        <ToolbarAlign />
        <ToolbarDirection />
      </Group>
    </>
  );
}
