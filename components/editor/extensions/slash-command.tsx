import React, {
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
  DivideIcon,
  EraserIcon,
  FootprintsIcon,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  MousePointer,
  MoveVertical,
  Text,
} from 'lucide-react';
import tippy, { GetReferenceClientRect } from 'tippy.js';

import { cn } from '@/components/editor/utils/tailwind';

interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface CommandProps {
  editor: Editor;
  range: Range;
}

const Command = Extension.create({
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

const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: 'Text',
      description: 'Just start typing with plain text.',
      searchTerms: ['p', 'paragraph'],
      icon: <Text className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
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
      icon: <Heading1 className="h-4 w-4" />,
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
      icon: <Heading2 className="h-4 w-4" />,
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
      icon: <Heading3 className="h-4 w-4" />,
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
      icon: <List className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      searchTerms: ['ordered'],
      icon: <ListOrdered className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: 'Logo',
      description: 'Add your brand logo',
      searchTerms: ['image', 'logo'],
      icon: <ImageIcon className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        const logoUrl = prompt('Logo URL: ') || '';

        if (!logoUrl) {
          return;
        }
        editor.chain().focus().deleteRange(range).run();
        editor.chain().focus().setLogoImage({ src: logoUrl }).run();
      },
    },
    {
      title: 'Image',
      description: 'Full width image',
      searchTerms: ['image'],
      icon: <ImageIcon className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        const imageUrl = prompt('Image URL: ') || '';

        if (!imageUrl) {
          return;
        }
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setImage({ src: imageUrl })
          .run();
      },
    },
    {
      title: 'Spacer',
      description:
        'Add a spacer to the page. Useful for adding space between sections.',
      searchTerms: ['space', 'gap', 'divider'],
      icon: <MoveVertical className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setSpacer({ height: 'sm' })
          .run();
      },
    },
    {
      title: 'Button',
      description: 'Add a call to action button to the page.',
      searchTerms: ['link', 'button', 'cta'],
      icon: <MousePointer className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setButton().run();
      },
    },
    {
      title: 'Hard Break',
      description: 'Add a break between lines.',
      searchTerms: ['break', 'line'],
      icon: <DivideIcon className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setHardBreak().run();
      },
    },
    {
      title: 'Footer',
      description: 'Add a footer text to the page.',
      searchTerms: ['footer', 'text'],
      icon: <FootprintsIcon className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setFooter().run();
      },
    },
    {
      title: 'Clear Line',
      description: 'Clear the current line.',
      searchTerms: ['clear', 'line'],
      icon: <EraserIcon className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().selectParentNode().deleteSelection().run();
      },
    },
    // TODO: add support for quote and code blocks
  ].filter((item) => {
    if (typeof query === 'string' && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        (item.searchTerms &&
          item.searchTerms.some((term: string) => term.includes(search)))
      );
    }
    return true;
  });
};

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
  range,
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
    <div className="z-50 w-72 rounded-md border border-gray-200 bg-white shadow-md transition-all">
      <div
        id="slash-command"
        ref={commandListContainer}
        className="no-scrollbar h-auto max-h-[330px] overflow-y-auto scroll-smooth px-1 py-2"
      >
        {items.map((item: CommandItemProps, index: number) => {
          return (
            <button
              className={cn(
                'flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900',
                index === selectedIndex ? 'bg-gray-100 text-gray-900' : ''
              )}
              key={index}
              onClick={() => selectItem(index)}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                {item.icon}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="border-t border-gray-200 px-1 py-3 pl-4">
        <div className="flex items-center">
          <p className="text-center text-xs text-gray-400">
            <kbd className="rounded border p-1 px-2 font-medium">↑</kbd>
            <kbd className="ml-1 rounded border p-1 px-2 font-medium">↓</kbd> to
            navigate
          </p>
          <span aria-hidden="true" className="select-none px-1">
            ·
          </span>
          <p className="text-center text-xs text-gray-400">
            <kbd className="rounded border p-1 px-1.5 font-medium">Enter</kbd>{' '}
            to select
          </p>
        </div>
      </div>
    </div>
  ) : null;
};

const suggestion: Omit<SuggestionOptions, 'editor'> = {
  items: getSuggestionItems,
  render: () => {
    let component: ReactRenderer<any> | null = null;
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
        popup?.[0].destroy();
        component?.destroy();
      },
    };
  },
};

export const SlashCommand = Command.configure({ suggestion });
