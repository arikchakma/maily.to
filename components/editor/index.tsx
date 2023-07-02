"use client"

import { EditorContent, useEditor } from '@tiptap/react'
import React from 'react'
import { EditorBubbleMenu } from './components/editor-bubble-menu'
import { TiptapExtensions } from './extensions'
import { LogoBubbleMenu } from './components/logo-bubble-menu'
import { EditorMenuBar } from './components/editor-menu-bar'
import { SpacerBubbleMenu } from './components/spacer-bubble-menu'

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
        <EditorMenuBar editor={editor} />
      </div>
      <div className="p-2 border-t">
        {editor && <EditorBubbleMenu editor={editor} />}
        {editor && <LogoBubbleMenu editor={editor} />}
        {editor && <SpacerBubbleMenu editor={editor} />}
        <EditorContent editor={editor} />
      </div >
    </div>
  )
}
