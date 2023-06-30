"use client"

import { EditorContent, useEditor } from '@tiptap/react'
import { Editor as EditorType } from '@tiptap/core'
import React from 'react'
import { Button } from '../ui/button'
import { ListIcon, ListOrderedIcon, ImageIcon, AlignCenterIcon } from 'lucide-react'
import { EditorBubbleMenu } from './components/editor-bubble-menu'
import { TiptapExtensions } from './extensions'
import { LogoBubbleMenu } from './components/logo-bubble-menu'

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
          {/* editor.chain().focus().updateAttributes('image', { 'data-mailbox': 'logo', src: imageUrl }).run() */ }
          editor.chain().focus().setImage({ src: imageUrl }).run()
        }}
      >
        <ImageIcon className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          editor.chain().focus().setLogoImage({ src: 'https://binsta.dev/api/v1/files/4eR1893USp/transform?format=webp&size=lg&quality=md' }).run()
        }}
      >
        <ImageIcon className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          editor.chain().focus().setLogoAttributes({ size: "lg" }).run()
        }}
      >
        <AlignCenterIcon className="h-3.5 w-3.5" />
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
    extensions: TiptapExtensions,
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
        {editor && <LogoBubbleMenu editor={editor} />}
        <EditorContent editor={editor} />
      </div >
    </div>
  )
}
