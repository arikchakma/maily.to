import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Editor, Extension, Range } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';
import {
  FootprintsIcon,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  MoveVertical,
  Text,
} from 'lucide-react';
import tippy, { GetReferenceClientRect } from 'tippy.js';

import { cn } from '@/editor/utils/classname';
import { SlashCommandItem } from '../provider';

interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface CommandProps {
  editor: Editor;
  range: Range;
}

export const SlashCommand = Extension.create({
  name: 'slash-command',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

const DEFAULT_SLASH_COMMANDS: SlashCommandItem[] = [
  {
    title: 'Text',
    description: 'Just start typing with plain text.',
    searchTerms: ['p', 'paragraph'],
    icon: <Text className="mly-h-4 mly-w-4" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode('paragraph', 'paragraph')
        .run();
    },
  },
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    searchTerms: ['title', 'big', 'large'],
    icon: <Heading1 className="mly-h-4 mly-w-4" />,
    command: ({ editor, range }: CommandProps) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    searchTerms: ['subtitle', 'medium'],
    icon: <Heading2 className="mly-h-4 mly-w-4" />,
    command: ({ editor, range }: CommandProps) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run();
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    searchTerms: ['subtitle', 'small'],
    icon: <Heading3 className="mly-h-4 mly-w-4" />,
    command: ({ editor, range }: CommandProps) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list.',
    searchTerms: ['unordered', 'point'],
    icon: <List className="mly-h-4 mly-w-4" />,
    command: ({ editor, range }: CommandProps) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering.',
    searchTerms: ['ordered'],
    icon: <ListOrdered className="mly-h-4 mly-w-4" />,
    command: ({ editor, range }: CommandProps) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Image',
    description: 'Full width image',
    searchTerms: ['image'],
    icon: <ImageIcon className="mly-h-4 mly-w-4" />,
    command: ({ editor, range }: CommandProps) => {
      const imageUrl = prompt('Image URL: ') || '';

      if (!imageUrl) {
        return;
      }

      editor.chain().focus().deleteRange(range).run();
      editor.chain().focus().setImage({ src: imageUrl }).run();
    },
  },
  // {
  //   title: 'Logo',
  //   description: 'Add your brand logo',
  //   searchTerms: ['image', 'logo'],
  //   icon: <ImageIcon className="mly-h-4 mly-w-4" />,
  //   command: ({ editor, range }: CommandProps) => {
  //     const logoUrl = prompt('Logo URL: ') || '';

  //     if (!logoUrl) {
  //       return;
  //     }
  //     editor.chain().focus().deleteRange(range).run();
  //     editor.chain().focus().setLogoImage({ src: logoUrl }).run();
  //   },
  // },
  // {
  //   title: 'Columns',
  //   description: 'Add columns to email.',
  //   searchTerms: ['layout', 'columns'],
  //   icon: <ColumnsIcon className="mly-h-4 mly-w-4" />,
  //   shouldBeHidden: (editor) => {
  //     return editor.isActive('columns');
  //   },
  //   command: ({ editor, range }: CommandProps) => {
  //     editor
  //       .chain()
  //       .focus()
  //       .deleteRange(range)
  //       .setColumns()
  //       .focus(editor.state.selection.head - 2)
  //       .run();
  //   },
  // },
  // {
  //   title: 'Section',
  //   description: 'Add a section to email.',
  //   searchTerms: ['layout', 'section'],
  //   icon: <SectionIcon className="mly-h-4 mly-w-4" />,
  //   shouldBeHidden: (editor) => {
  //     return editor.isActive('columns');
  //   },
  //   command: ({ editor, range }: CommandProps) => {
  //     editor.chain().focus().deleteRange(range).setSection().run();
  //   },
  // },
  // {
  //   title: 'For',
  //   description: 'Loop over an array of items.',
  //   searchTerms: ['for', 'loop'],
  //   icon: <Repeat2 className="mly-h-4 mly-w-4" />,
  //   command: ({ editor, range }: CommandProps) => {
  //     editor.chain().focus().deleteRange(range).setFor().run();
  //   },
  // },
  // {
  //   title: 'Show',
  //   description: 'Show when a condition is true.',
  //   searchTerms: ['show', 'if'],
  //   icon: <EyeIcon className="mly-h-4 mly-w-4" />,
  //   command: ({ editor, range }: CommandProps) => {
  //     editor.chain().focus().deleteRange(range).setShow().run();
  //   },
  // },
  {
    title: 'Spacer',
    description:
      'Add a spacer to email. Useful for adding space between sections.',
    searchTerms: ['space', 'gap', 'divider'],
    icon: <MoveVertical className="mly-h-4 mly-w-4" />,
    command: ({ editor, range }: CommandProps) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setSpacer({ height: 'sm' })
        .run();
    },
  },
  // {
  //   title: 'Button',
  //   description: 'Add a call to action button to email.',
  //   searchTerms: ['link', 'button', 'cta'],
  //   icon: <MousePointer className="mly-h-4 mly-w-4" />,
  //   command: ({ editor, range }: CommandProps) => {
  //     editor.chain().focus().deleteRange(range).setButton().run();
  //   },
  // },
  // {
  //   title: 'Link Card',
  //   description: 'Add a link card to email.',
  //   searchTerms: ['link', 'button', 'image'],
  //   icon: <ArrowUpRightSquare className="mly-h-4 mly-w-4" />,
  //   command: ({ editor, range }: CommandProps) => {
  //     editor.chain().focus().deleteRange(range).setLinkCard().run();
  //   },
  // },
  // {
  //   title: 'Hard Break',
  //   description: 'Add a break between lines.',
  //   searchTerms: ['break', 'line'],
  //   icon: <DivideIcon className="mly-h-4 mly-w-4" />,
  //   command: ({ editor, range }: CommandProps) => {
  //     editor.chain().focus().deleteRange(range).setHardBreak().run();
  //   },
  // },
  // {
  //   title: 'Blockquote',
  //   description: 'Add blockquote.',
  //   searchTerms: ['quote', 'blockquote'],
  //   icon: <TextQuote className="mly-h-4 mly-w-4" />,
  //   command: ({ editor, range }: CommandProps) => {
  //     editor.chain().focus().deleteRange(range).toggleBlockquote().run();
  //   },
  // },
  {
    title: 'Footer',
    description: 'Add a footer text to email.',
    searchTerms: ['footer', 'text'],
    icon: <FootprintsIcon className="mly-h-4 mly-w-4" />,
    command: ({ editor, range }: CommandProps) => {
      editor.chain().focus().deleteRange(range).setFooter().run();
    },
  },
  // {
  //   title: 'Clear Line',
  //   description: 'Clear the current line.',
  //   searchTerms: ['clear', 'line'],
  //   icon: <EraserIcon className="mly-h-4 mly-w-4" />,
  //   command: ({ editor, range }: CommandProps) => {
  //     editor.chain().focus().selectParentNode().deleteSelection().run();
  //   },
  // },
];

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};

const CommandList = ({
  items,
  command,
  editor,
}: {
  items: CommandItemProps[];
  command: (item: CommandItemProps) => void;
  editor: Editor;
  range: any;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) {
        command(item);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [command, editor, items]
  );

  useEffect(() => {
    const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [items, selectedIndex, setSelectedIndex, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const commandListContainer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = commandListContainer?.current;

    const item = container?.children[selectedIndex] as HTMLElement;

    if (item && container) updateScrollView(container, item);
  }, [selectedIndex]);

  return items.length > 0 ? (
    <div className="mly-z-50 mly-w-72 mly-rounded-md mly-border mly-border-gray-200 mly-bg-white mly-shadow-md mly-transition-all">
      <div
        id="slash-command"
        ref={commandListContainer}
        className="mly-no-scrollbar mly-h-auto mly-max-h-[330px] mly-overflow-y-auto mly-scroll-smooth mly-px-1 mly-py-2"
      >
        {items.map((item: CommandItemProps, index: number) => {
          return (
            <button
              className={cn(
                'mly-flex mly-w-full mly-items-center mly-space-x-2 mly-rounded-md mly-px-2 mly-py-1 mly-text-left mly-text-sm mly-text-gray-900 hover:mly-bg-gray-100 hover:mly-text-gray-900',
                index === selectedIndex
                  ? 'mly-bg-gray-100 mly-text-gray-900'
                  : 'mly-bg-transparent'
              )}
              key={index}
              onClick={() => selectItem(index)}
              type="button"
            >
              <div className="mly-flex mly-h-6 mly-w-6 mly-shrink-0 mly-items-center mly-justify-center">
                {item.icon}
              </div>
              <div>
                <p className="mly-font-medium">{item.title}</p>
                <p className="mly-text-xs mly-text-gray-400">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mly-border-t mly-border-gray-200 mly-px-1 mly-py-3 mly-pl-4">
        <div className="mly-flex mly-items-center">
          <p className="mly-text-center mly-text-xs mly-text-gray-400">
            <kbd className="mly-rounded mly-border mly-p-1 mly-px-2 mly-font-medium">
              ↑
            </kbd>
            <kbd className="mly-ml-1 mly-rounded mly-border mly-p-1 mly-px-2 mly-font-medium">
              ↓
            </kbd>{' '}
            to navigate
          </p>
          <span aria-hidden="true" className="mly-select-none mly-px-1">
            ·
          </span>
          <p className="mly-text-center mly-text-xs mly-text-gray-400">
            <kbd className="mly-rounded mly-border mly-p-1 mly-px-1.5 mly-font-medium">
              Enter
            </kbd>{' '}
            to select
          </p>
        </div>
      </div>
    </div>
  ) : null;
};

export function getSlashCommandSuggestions(
  commands: SlashCommandItem[] = []
): Omit<SuggestionOptions, 'editor'> {
  return {
    items: ({ query, editor }) => {
      return [...DEFAULT_SLASH_COMMANDS, ...commands].filter((item) => {
        if (typeof query === 'string' && query.length > 0) {
          const search = query.toLowerCase();

          if (item?.shouldBeHidden?.(editor)) {
            return false;
          }

          return (
            item.title.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search) ||
            (item.searchTerms &&
              item.searchTerms.some((term: string) => term.includes(search)))
          );
        }
        return true;
      });
    },
    render: () => {
      let component: ReactRenderer<any>;
      let popup: InstanceType<any> | null = null;

      return {
        onStart: (props) => {
          component = new ReactRenderer(CommandList, {
            props,
            editor: props.editor,
          });

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect as GetReferenceClientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
          });
        },
        onUpdate: (props) => {
          component?.updateProps(props);

          popup &&
            popup[0].setProps({
              getReferenceClientRect: props.clientRect,
            });
        },
        onKeyDown: (props) => {
          if (props.event.key === 'Escape') {
            popup?.[0].hide();

            return true;
          }

          return component?.ref?.onKeyDown(props);
        },
        onExit: () => {
          if (!popup || !popup?.[0] || !component) {
            return;
          }

          popup?.[0].destroy();
          component?.destroy();
        },
      };
    },
  };
}
