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
  TextQuote,
} from 'lucide-react';
import tippy, { GetReferenceClientRect } from 'tippy.js';

import { cn } from '@/editor/utils/classname';
import intl from 'react-intl-universal';

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
      title: intl.get('slashCommandTextTitle'),
      description: intl.get('slashCommandTextDescription'),
      searchTerms: ['p', 'paragraph'],
      icon: <Text className="mly-h-4 mly-w-4" />,
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
      title: intl.get('slashCommandHeading1Title'),
      description: intl.get('slashCommandHeading1Description'),
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
      title: intl.get('slashCommandHeading2Title'),
      description: intl.get('slashCommandHeading2Description'),
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
      title: intl.get('slashCommandHeading3Title'),
      description: intl.get('slashCommandHeading3Description'),
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
      title: intl.get('slashCommandBulletListTitle'),
      description: intl.get('slashCommandBulletListDescription'),
      searchTerms: ['unordered', 'point'],
      icon: <List className="mly-h-4 mly-w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: intl.get('slashCommandNumberedListTitle'),
      description: intl.get('slashCommandNumberedListDescription'),
      searchTerms: ['ordered'],
      icon: <ListOrdered className="mly-h-4 mly-w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: intl.get('slashCommandImageTitle'),
      description: intl.get('slashCommandImageDescription'),
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
    {
      title: intl.get('slashCommandLogoTitle'),
      description: intl.get('slashCommandLogoDescription'),
      searchTerms: ['image', 'logo'],
      icon: <ImageIcon className="mly-h-4 mly-w-4" />,
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
      title: intl.get('slashCommandSpacerTitle'),
      description: intl.get('slashCommandSpacerDescription'),
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
    {
      title: intl.get('slashCommandButtonTitle'),
      description: intl.get('slashCommandButtonDescription'),
      searchTerms: ['link', 'button', 'cta'],
      icon: <MousePointer className="mly-h-4 mly-w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setButton().run();
      },
    },
    {
      title: intl.get('slashCommandHardBreakTitle'),
      description: intl.get('slashCommandHardBreakDescription'),
      searchTerms: ['break', 'line'],
      icon: <DivideIcon className="mly-h-4 mly-w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setHardBreak().run();
      },
    },
    {
      title: intl.get('slashCommandBlockquoteTitle'),
      description: intl.get('slashCommandBlockquoteDescription'),
      searchTerms: ['quote', 'blockquote'],
      icon: <TextQuote className="mly-h-4 mly-w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
    {
      title: intl.get('slashCommandFooterTitle'),
      description: intl.get('slashCommandFooterDescription'),
      searchTerms: ['footer', 'text'],
      icon: <FootprintsIcon className="mly-h-4 mly-w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setFooter().run();
      },
    },
    {
      title: intl.get('slashCommandClearLineTitle'),
      description: intl.get('slashCommandClearLineDescription'),
      searchTerms: ['clear', 'line'],
      icon: <EraserIcon className="mly-h-4 mly-w-4" />,
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
            {intl.getHTML('slashCommandShortcut')}
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
        if (!popup || !popup?.[0] || !component) {
          return;
        }

        popup?.[0].destroy();
        component?.destroy();
      },
    };
  },
};

export const SlashCommand = Command.configure({ suggestion });
