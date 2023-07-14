import { FC } from 'react';
import { BubbleMenu, BubbleMenuProps, isTextSelection } from '@tiptap/react';
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react';

import { BubbleMenuButton } from './bubble-menu-button';
import { BubbleMenuItem, EditorBubbleMenuProps } from './editor-bubble-menu';

export const LogoBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  const items: BubbleMenuItem[] = [
    {
      name: 'left',
      isActive: () => props.editor.isActive('logo', { alignment: 'left' }),
      command: () => {
        if (props.editor.isActive('logo', { alignment: 'left' })) {
          props.editor
            .chain()
            .focus()
            .setLogoAttributes({ alignment: 'left' })
            .run();
        } else {
          props.editor
            .chain()
            .focus()
            .setLogoAttributes({ alignment: 'left' })
            .run();
        }
      },
      icon: AlignLeftIcon,
    },
    {
      name: 'center',
      isActive: () => props.editor.isActive('logo', { alignment: 'center' }),
      command: () => {
        console.log(props.editor.isActive('logo', { alignment: 'center' }));
        if (props.editor.isActive('logo', { alignment: 'center' })) {
          props.editor
            .chain()
            .focus()
            .setLogoAttributes({ alignment: 'left' })
            .run();
        } else {
          props.editor
            .chain()
            .focus()
            .setLogoAttributes({ alignment: 'center' })
            .run();
        }
      },
      icon: AlignCenterIcon,
    },
    {
      name: 'right',
      isActive: () => props.editor.isActive('logo', { alignment: 'right' }),
      command: () => {
        if (props.editor.isActive('logo', { alignment: 'right' })) {
          props.editor
            .chain()
            .focus()
            .setLogoAttributes({ alignment: 'left' })
            .run();
        } else {
          props.editor
            .chain()
            .focus()
            .setLogoAttributes({ alignment: 'right' })
            .run();
        }
      },
      icon: AlignRightIcon,
    },
    {
      name: 'sm',
      isActive: () => props.editor.isActive('logo', { size: 'sm' }),
      command: () => {
        if (props.editor.isActive('logo', { size: 'sm' })) {
          props.editor.chain().focus().setLogoAttributes({ size: 'sm' }).run();
        } else {
          props.editor.chain().focus().setLogoAttributes({ size: 'sm' }).run();
        }
      },
    },
    {
      name: 'md',
      isActive: () => props.editor.isActive('logo', { size: 'md' }),
      command: () => {
        if (props.editor.isActive('logo', { size: 'md' })) {
          props.editor.chain().focus().setLogoAttributes({ size: 'sm' }).run();
        } else {
          props.editor.chain().focus().setLogoAttributes({ size: 'md' }).run();
        }
      },
    },
    {
      name: 'lg',
      isActive: () => props.editor.isActive('logo', { size: 'lg' }),
      command: () => {
        if (props.editor.isActive('logo', { size: 'lg' })) {
          props.editor.chain().focus().setLogoAttributes({ size: 'sm' }).run();
        } else {
          props.editor.chain().focus().setLogoAttributes({ size: 'lg' }).run();
        }
      },
    },
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor, view, state, oldState, from, to }) => {
      if (!editor.isActive('logo')) {
        return false;
      }

      return true;
    },
    tippyOptions: {
      moveTransition: 'transform 0.15s ease-out',
    },
  };

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="flex gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-md"
    >
      {items.map((item, index) => (
        <BubbleMenuButton key={index} {...item} />
      ))}
    </BubbleMenu>
  );
};
