import { Suspense, useState, type CSSProperties } from 'react';
import { Editor } from '@maily-to/core';
import { cn } from '~/lib/classname';
import defaultEmailJSON from '~/lib/default-editor-json.json';
import {
  AlignHorizontalSpaceAroundIcon,
  AlignVerticalSpaceAroundIcon,
  type LucideIcon,
} from 'lucide-react';

export interface ThemeOptions {
  colors?: Partial<{
    heading: string;
    paragraph: string;
    horizontal: string;
    footer: string;
    blockquoteBorder: string;
    codeBackground: string;
    codeText: string;
    linkCardTitle: string;
    linkCardDescription: string;
    linkCardBadgeText: string;
    linkCardBadgeBackground: string;
    linkCardSubTitle: string;
  }>;
  fontSize?: Partial<{
    paragraph: Partial<{
      size: string;
      lineHeight: string;
    }>;
    footer: Partial<{
      size: string;
      lineHeight: string;
    }>;
  }>;

  container?: Partial<CSSProperties>;
  body?: Partial<CSSProperties>;
  button?: Partial<CSSProperties>;
  link?: Partial<CSSProperties>;
}

export default function SkeletonEditor() {
  const [editorTheme, setEditorTheme] = useState<ThemeOptions>({
    button: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '10px 32px',
    },
    container: {
      backgroundColor: '#ffffff',
    },
  });

  return (
    <div
      className="flex h-screen w-screen p-10"
      style={
        {
          '--mly-button-background-color': editorTheme.button?.backgroundColor,
          '--mly-button-text-color': editorTheme.button?.color,
        } as CSSProperties
      }
    >
      <Suspense>
        <Editor
          config={{
            hasMenuBar: false,
            wrapClassName: cn('editor-wrap'),
            bodyClassName: '!mt-0 !border-0 !p-0',
            contentClassName: `editor-content mx-auto max-w-[calc(600px+80px)]! px-10! pb-10!`,
            toolbarClassName: 'flex-wrap !items-start',
            spellCheck: false,
            autofocus: 'end',
            immediatelyRender: false,
          }}
          contentJson={defaultEmailJSON}
        />
      </Suspense>
      <div className="grow border-l border-gray-200 pl-10">
        <div className="flex items-center gap-2">
          <div className="grow text-sm">
            <label>Padding</label>
          </div>

          <div className="flex items-center gap-2">
            <NumberInput
              value={0}
              onChange={() => {}}
              icon={AlignVerticalSpaceAroundIcon}
            />
            <NumberInput
              value={0}
              onChange={() => {}}
              icon={AlignHorizontalSpaceAroundIcon}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  icon?: LucideIcon;
};

function NumberInput(props: NumberInputProps) {
  const { value, onChange, icon: Icon } = props;

  return (
    <div className="relative">
      <div className="mly-absolute mly-left-1 pointer-events-none inset-y-0 flex items-center justify-center px-2">
        {Icon && <Icon className="size-3.5 text-gray-500" />}
      </div>
      <input
        type="number"
        className="w-20 appearance-none rounded-md border border-gray-200 py-1 pl-8 text-sm hover:border-gray-300 focus:outline-none"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
