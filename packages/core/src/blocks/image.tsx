import { NodeSelection, Selection, TextSelection } from '@tiptap/pm/state';
import type { BlockItem } from './types';
import { ImageIcon } from 'lucide-react';

export const image: BlockItem = {
  title: 'Image',
  description: 'Full width image',
  searchTerms: ['image'],
  icon: <ImageIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setImage({ src: '' }).run();
  },
};

export const logo: BlockItem = {
  title: 'Logo',
  description: 'Add your brand logo',
  searchTerms: ['image', 'logo'],
  icon: <ImageIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setLogoImage({ src: '' }).run();
  },
};

export const inlineImage: BlockItem = {
  title: 'Inline Image',
  description: 'Inline image',
  searchTerms: ['image', 'inline'],
  icon: <ImageIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor
      .chain()
      .focus()
      .deleteRange(range)
      // @ts-ignore
      .setInlineImage({
        src: 'https://maily.to/brand/logo.png',
      })
      // @ts-ignore
      .command((props) => {
        const { tr, state, view, editor } = props;
        const { from } = range;

        const node = state.doc.nodeAt(from);
        if (!node) {
          return false;
        }

        const selection = TextSelection.create(
          tr.doc,
          from,
          from + node.nodeSize
        );
        tr.setSelection(selection);
        return true;
      })
      .run();
  },
};
