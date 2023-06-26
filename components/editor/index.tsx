"use client"

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Heading from '@tiptap/extension-heading'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import { Editor as EditorType } from '@tiptap/core'
import TextAlign from '@tiptap/extension-text-align'
import React from 'react'
import Paragraph from '@tiptap/extension-paragraph'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import { Button } from '../ui/button'
import { AlignCenter, AlignLeft, AlignRight, BoldIcon, ItalicIcon, StrikethroughIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const MenuBar = ({ editor }: {
  editor: EditorType | null
}) => {
  if (!editor) {
    return null
  }

  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        bold
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().setColor('#958DF1').run()}
        className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
      >
        purple
      </button>
    </>
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
    <div>
      <MenuBar editor={editor} />
      {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className='flex gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-md'>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-state={editor.isActive('bold') ? 'on' : 'off'}
          className={cn('px-2.5')}
        >
          <BoldIcon className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-state={editor.isActive('italic')}
          className={cn('px-2.5')}
        >
          <ItalicIcon className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          data-state={editor.isActive('strike')}
          className={cn('px-2.5')}
        >
          <StrikethroughIcon className="h-3.5 w-3.5" />
        </Button >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // If the selected node has style textAlign `center`, make it `left`
            if (editor.isActive({ textAlign: 'left' })) {
              editor.chain().focus().unsetTextAlign().run()
            } else {
              editor.chain().focus().setTextAlign('left').run()
            }
          }}
          className={cn('px-2.5', editor.isActive('strike') ? 'is-active' : '')}
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </Button >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // If the selected node has style textAlign `center`, make it `left`
            if (editor.isActive({ textAlign: 'center' })) {
              editor.chain().focus().unsetTextAlign().run()
            } else {
              editor.chain().focus().setTextAlign('center').run()
            }
          }}
          className={cn('px-2.5', editor.isActive('strike') ? 'is-active' : '')}
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </Button >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // If the selected node has style textAlign `center`, make it `left`
            if (editor.isActive({ textAlign: 'right' })) {
              editor.chain().focus().unsetTextAlign().run()
            } else {
              editor.chain().focus().setTextAlign('right').run()
            }
          }}
          className={cn('px-2.5', editor.isActive('strike') ? 'is-active' : '')}
        >
          <AlignRight className="h-3.5 w-3.5" />
        </Button >
      </BubbleMenu >}
      <EditorContent editor={editor} />
    </div >
  )
}
