import { Button } from '@/components/ui/button'
import { Editor as EditorType } from '@tiptap/core'
import { ListIcon, ListOrderedIcon, ImageIcon, AlignCenterIcon, SpaceIcon, FootprintsIcon } from 'lucide-react'


export const EditorMenuBar = ({ editor }: {
  editor: EditorType | null
}) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
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
        onClick={() => {
          editor.chain().focus().selectParentNode().deleteSelection().run()
        }}
      >
        Delete Line
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
        onClick={() => {
          editor.chain().focus().setSpacer({ height: "xl" }).run()
        }}
      >
        <SpaceIcon className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          editor.chain().focus().setFooter().run()
        }}
      >
        <FootprintsIcon className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => editor.chain().focus().setColor('#958DF1').run()}
        className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
      >
        purple
      </Button>
    </div >
  )
}
