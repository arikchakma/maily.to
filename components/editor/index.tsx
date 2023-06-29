"use client"

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Heading from '@tiptap/extension-heading'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import { Editor as EditorType, isTextSelection } from '@tiptap/core'
import TextAlign from '@tiptap/extension-text-align'
import React from 'react'
import Paragraph from '@tiptap/extension-paragraph'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import { Button } from '../ui/button'
import { AlignCenter, AlignLeft, AlignRight, BoldIcon, ItalicIcon, StrikethroughIcon, ListIcon, ListOrderedIcon, ImageIcon, UnderlineIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import Underline from '@tiptap/extension-underline'
import { EditorBubbleMenu } from './components/editor-bubble-menu'

const MenuBar = ({ editor }: {
  editor: EditorType | null
}) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm" onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </Button>
      <Button
        variant="secondary"
        size="sm" onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        <ListIcon className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        <ListOrderedIcon className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          const imageUrl = prompt('Image URL: ') || ''
          if (!imageUrl) {
            return
          }
          editor.chain().focus().setImage({ src: imageUrl }).run()
        }}
      >
        <ImageIcon className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => editor.chain().focus().setColor('#958DF1').run()}
        className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
      >
        purple
      </Button>
    </div>
  )
}

export function Editor() {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'prose',
        spellCheck: 'false',
      }
    },
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Strike,
      Underline,
      HorizontalRule,
      BulletList,
      OrderedList,
      ListItem,
      Image,
      Dropcursor.configure({
        color: "#555",
        width: 2
      }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure(),
      TextAlign.configure({ types: [Paragraph.name, Heading.name] }),
      Heading.extend({
        levels: [1, 2, 3],
      }),
    ],
    content: `
      <h1>
        Hi there,
      </h1>
    `,
  })

  console.log(editor?.getJSON())

  return (
    <div className="rounded border">
      <div className="p-2">
        <MenuBar editor={editor} />
      </div>
      <div className="p-2 border-t">
        {editor && <EditorBubbleMenu editor={editor} />}
        <EditorContent editor={editor} />
      </div >
    </div>
  )
}
