import { Editor as EditorType } from '@tiptap/core'
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, EraserIcon, SeparatorHorizontal } from 'lucide-react'
import { BubbleMenuItem } from './editor-bubble-menu'
import { BubbleMenuButton } from './bubble-menu-button'
import { useMemo } from 'react'


interface EditorMenuItem extends BubbleMenuItem {
  group: "alignment" | "image" | "mark" | "custom"
}
export const EditorMenuBar = ({ editor }: {
  editor: EditorType
}) => {
  const items: EditorMenuItem[] = useMemo(() => [
    {
      name: 'bold',
      command: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
      group: 'mark',
      icon: BoldIcon
    },
    {
      name: 'italic',
      command: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
      group: 'mark',
      icon: ItalicIcon
    },
    {
      name: "underline",
      command: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
      group: 'mark',
      icon: UnderlineIcon
    },
    {
      name: 'strike',
      command: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
      group: 'mark',
      icon: StrikethroughIcon
    },
    {
      name: 'delete-line',
      command: () => editor.chain().focus().selectParentNode().deleteSelection().run(),
      isActive: () => false,
      group: 'mark',
      icon: EraserIcon
    },
    {
      name: 'divider',
      command: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: () => editor.isActive('horizontalRule'),
      group: 'custom',
      icon: SeparatorHorizontal
    }
  ], [editor])

  const groups = useMemo(() => items.reduce((acc, item) => {
    if (!acc.includes(item.group)) {
      acc.push(item.group)
    }
    return acc
  }, [] as string[]), [items])

  if (!editor) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      {
        groups.map((group, index) => (
          <div key={index} className="flex items-center gap-2 bg-white p-1 border rounded-md">
            {
              items.filter((item) => item.group === group).map((item, index) => (
                <BubbleMenuButton
                  key={index}
                  {...item}
                />
              ))}
          </div>
        ))
      }
    </div>
  )
}
