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
    content: {
      "type": "doc",
      "content": [
        {
          "type": "paragraph",
          "attrs": {
            "textAlign": "left"
          }
        },
        {
          "type": "logo",
          "attrs": {
            "src": "https://binsta.dev/api/v1/files/4eR1893USp/transform?format=webp&size=lg&quality=md",
            "alt": null,
            "title": null,
            "mailbox-component": "logo",
            "size": "sm",
            "alignment": "left"
          }
        },
        {
          "type": "paragraph",
          "attrs": {
            "textAlign": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Hey "
            },
            {
              "type": "variable",
              "attrs": {
                "id": "username",
                "label": null
              }
            },
            {
              "type": "text",
              "text": ","
            }
          ]
        },
        {
          "type": "horizontalRule"
        },
        {
          "type": "paragraph",
          "attrs": {
            "textAlign": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Thank you so much for joining the waitlist. We are excited to welcome you to the [product name] community."
            }
          ]
        },
        {
          "type": "paragraph",
          "attrs": {
            "textAlign": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Stay tuned. And we're just an email away if you have any questions. We'd be more than happy to answer your questions."
            }
          ]
        },
        {
          "type": "spacer",
          "attrs": {
            "mailbox-component": "spacer",
            "height": "xl"
          }
        },
        {
          "type": "paragraph",
          "attrs": {
            "textAlign": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Cheers,"
            },
            {
              "type": "hardBreak"
            },
            {
              "type": "text",
              "text": "James, "
            },
            {
              "type": "text",
              "marks": [
                {
                  "type": "italic"
                }
              ],
              "text": "creator of [product name]"
            }
          ]
        },
        {
          "type": "horizontalRule"
        },
        {
          "type": "footer",
          "attrs": {
            "mailbox-component": "footer"
          },
          "content": [
            {
              "type": "text",
              "text": "You are receiving this email because you joined the waitlist for [product name]."
            }
          ]
        },
        {
          "type": "footer",
          "attrs": {
            "mailbox-component": "footer"
          },
          "content": [
            {
              "type": "text",
              "text": "© 2023 [Product name]"
            },
            {
              "type": "hardBreak"
            },
            {
              "type": "text",
              "text": "[address]"
            }
          ]
        },
        {
          "type": "footer",
          "attrs": {
            "mailbox-component": "footer"
          },
          "content": [
            {
              "type": "text",
              "text": "Unsubscribe from emails"
            }
          ]
        }
      ]
    },
  })

  console.log(editor?.getHTML())

  return (
    <div className="rounded border max-w-[600px]">
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
