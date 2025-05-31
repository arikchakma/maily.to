import { Suspense, useMemo, useState, type CSSProperties } from 'react';
import { Editor } from '@maily-to/core';
import { cn } from '~/lib/classname';
import defaultEmailJSON from '~/lib/default-editor-json.json';
import {
  AlignHorizontalSpaceAroundIcon,
  AlignVerticalSpaceAroundIcon,
  MenuIcon,
  RectangleHorizontalIcon,
  SquareRoundCornerIcon,
  type LucideIcon,
} from 'lucide-react';
import { ColorPicker } from '~/components/skeleton/color-picker';
import { HexColorInput } from 'react-colorful';
import { SelectNative } from '~/components/skeleton/select-native';

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
  button?: Partial<
    Pick<
      CSSProperties,
      | 'paddingTop'
      | 'paddingRight'
      | 'paddingBottom'
      | 'paddingLeft'
      | 'backgroundColor'
      | 'color'
    >
  >;
  link?: Partial<CSSProperties>;
}

export default function SkeletonEditor() {
  const [editorTheme, setEditorTheme] = useState<ThemeOptions>({
    button: {
      backgroundColor: '#000000',
      color: '#ffffff',
      paddingTop: '10px',
      paddingRight: '32px',
      paddingBottom: '10px',
      paddingLeft: '32px',
    },
    container: {
      backgroundColor: '#ffffff',
    },
  });

  const sizes: Record<string, { paddingX: number; paddingY: number }> = useMemo(
    () => ({
      small: {
        paddingX: 24,
        paddingY: 6,
      },
      medium: {
        paddingX: 32,
        paddingY: 10,
      },
      large: {
        paddingX: 40,
        paddingY: 14,
      },
    }),
    []
  );

  return (
    <div
      className="flex h-screen w-screen p-10"
      style={
        {
          '--mly-button-background-color': editorTheme.button?.backgroundColor,
          '--mly-button-text-color': editorTheme.button?.color,
          '--mly-button-padding-top': editorTheme.button?.paddingTop,
          '--mly-button-padding-right': editorTheme.button?.paddingRight,
          '--mly-button-padding-bottom': editorTheme.button?.paddingBottom,
          '--mly-button-padding-left': editorTheme.button?.paddingLeft,
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
      <div className="mx-auto max-w-xs grow space-y-10 border-l border-gray-200 px-6">
        <LayoutSettings />
        <ButtonSettings
          buttonTheme={editorTheme.button}
          setButtonTheme={(buttonTheme) =>
            setEditorTheme({ ...editorTheme, button: buttonTheme })
          }
        />
      </div>
    </div>
  );
}

function LayoutSettings() {
  return (
    <div>
      <h3 className="text-sm font-medium">Layout</h3>

      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Padding</label>
          </div>

          <div className="grid grid-cols-2 gap-2">
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
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Margin</label>
          </div>

          <div className="grid grid-cols-2 gap-2">
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
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Body</label>
          </div>

          <ColorInput value="#000000" onChange={() => {}} />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Container</label>
          </div>

          <ColorInput value="#000000" onChange={() => {}} />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Radius</label>
          </div>

          <NumberInput
            value={0}
            onChange={() => {}}
            icon={SquareRoundCornerIcon}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Border Width</label>
          </div>

          <NumberInput value={0} onChange={() => {}} icon={MenuIcon} />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Border Color</label>
          </div>

          <ColorInput value="#000000" onChange={() => {}} />
        </div>
      </div>
    </div>
  );
}

type ButtonSettingsProps = {
  buttonTheme: ThemeOptions['button'];
  setButtonTheme: (buttonTheme: ThemeOptions['button']) => void;
};

function ButtonSettings(props: ButtonSettingsProps) {
  const { buttonTheme, setButtonTheme } = props;

  const sizes: Record<string, { paddingX: number; paddingY: number }> = useMemo(
    () => ({
      small: {
        paddingX: 24,
        paddingY: 6,
      },
      medium: {
        paddingX: 32,
        paddingY: 10,
      },
      large: {
        paddingX: 40,
        paddingY: 14,
      },
    }),
    []
  );

  const size = useMemo(() => {
    const { paddingRight, paddingTop } = buttonTheme ?? {};

    return Object.entries(sizes).find(([, { paddingX, paddingY }]) => {
      return (
        parseInt(String(paddingRight ?? '0')) === paddingX &&
        parseInt(String(paddingTop ?? '0')) === paddingY
      );
    })?.[0];
  }, [buttonTheme, sizes]);

  console.log('-'.repeat(20));
  console.log(size);
  console.log(buttonTheme);
  console.log('-'.repeat(20));

  return (
    <div>
      <h3 className="text-sm font-medium">Button</h3>

      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Background</label>
          </div>

          <ColorInput
            value={buttonTheme?.backgroundColor ?? '#000000'}
            onChange={(value) =>
              setButtonTheme({ ...buttonTheme, backgroundColor: value })
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Text</label>
          </div>

          <ColorInput
            value={buttonTheme?.color ?? '#000000'}
            onChange={(value) =>
              setButtonTheme({ ...buttonTheme, color: value })
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Size</label>
          </div>

          <Select
            icon={RectangleHorizontalIcon}
            value={size ?? 'medium'}
            onChange={(value) => {
              setButtonTheme({
                ...buttonTheme,
                paddingTop: `${sizes[value].paddingY}px`,
                paddingRight: `${sizes[value].paddingX}px`,
                paddingBottom: `${sizes[value].paddingY}px`,
                paddingLeft: `${sizes[value].paddingX}px`,
              });
            }}
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  icon?: LucideIcon;
  className?: string;
};

function NumberInput(props: NumberInputProps) {
  const { value, onChange, icon: Icon, className } = props;

  return (
    <div className="relative max-w-full">
      <div className="mly-absolute mly-left-1 pointer-events-none inset-y-0 flex items-center justify-center px-2">
        {Icon && <Icon className="size-3.5 text-gray-500" />}
      </div>
      <input
        type="number"
        className={cn(
          'hide-number-controls w-full appearance-none rounded-md border border-gray-200 py-1 pl-8 pr-2 text-sm hover:border-gray-300 focus:outline-none',
          className
        )}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

type ColorInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ColorInput(props: ColorInputProps) {
  const { value, onChange } = props;

  return (
    <div className="flex w-full items-center rounded-md border border-gray-200 px-2">
      <ColorPicker color={value} onColorChange={onChange} />

      <HexColorInput
        color={value}
        onChange={onChange}
        className="w-full max-w-full appearance-none px-2 py-1 text-sm hover:border-gray-300 focus:outline-none"
        prefixed
      />
    </div>
  );
}

type SelectProps = {
  icon?: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
};

function Select(props: SelectProps) {
  const { value, onChange, options, icon: Icon } = props;

  return (
    <div className="relative w-full">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-2.5 z-20 flex items-center">
          <Icon className="size-3.5 text-gray-500" />
        </div>
      )}

      <SelectNative
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[30px] w-full pl-8"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectNative>
    </div>
  );
}
