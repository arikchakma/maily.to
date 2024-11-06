import type { BlockItem } from './types';
import { ImageIcon } from 'lucide-react';

export const image: BlockItem = {
  title: 'Image',
  description: 'Full width image',
  searchTerms: ['image'],
  icon: <ImageIcon className="mly-h-4 mly-w-4" />,
  command: ({ editor, range }) => {
    const imageUrl = prompt('Image URL: ') || '';

    if (!imageUrl) {
      return;
    }

    editor.chain().focus().deleteRange(range).run();
    // @ts-ignore
    editor.chain().focus().setImage({ src: imageUrl }).run();
  },
};

export const logo: BlockItem = {
  title: 'Logo',
  description: 'Add your brand logo',
  searchTerms: ['image', 'logo'],
  icon: <ImageIcon className="mly-h-4 mly-w-4" />,
  command: ({ editor, range }) => {
    const logoUrl = prompt('Logo URL: ') || '';

    if (!logoUrl) {
      return;
    }

    editor.chain().focus().deleteRange(range).run();
    // @ts-ignore
    editor.chain().focus().setLogoImage({ src: logoUrl }).run();
  },
};
