import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Editor } from '@maily-to/core';
import { cn } from '~/lib/classname';
import defaultEmailJSON from '~/lib/default-editor-json.json';
import {
  ALargeSmallIcon,
  AlignHorizontalSpaceAroundIcon,
  AlignVerticalSpaceAroundIcon,
  EyeIcon,
  Loader2Icon,
  MenuIcon,
  RectangleHorizontalIcon,
  RotateCwIcon,
  SquareRoundCornerIcon,
  type LucideIcon,
} from 'lucide-react';
import { ColorPicker } from '~/components/skeleton/color-picker';
import { HexColorInput } from 'react-colorful';
import { SelectNative } from '~/components/skeleton/select-native';
import {
  allowedFallbackFonts,
  DEFAULT_EDITOR_THEME,
  DEFAULT_FONT,
  getMailyCssVariables,
  loadFont,
  type EditorThemeOptions,
  type FallbackFont,
  type FontFormat,
} from '@maily-to/shared';
import type { Editor as TiptapEditor } from '@tiptap/core';
import { useMutation } from '@tanstack/react-query';
import { httpPost } from '~/lib/http';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import type { Route } from './+types/_skeleton.[_p].editor';

const THEME_KEY = 't';

export function clientLoader(args: Route.ClientLoaderArgs) {
  const searchParams = new URL(args.request.url).searchParams;
  const theme = searchParams.get(THEME_KEY);
  if (!theme) {
    return { theme: DEFAULT_EDITOR_THEME };
  }

  const themeOptions = JSON.parse(atob(theme)) as EditorThemeOptions;
  if (themeOptions.font?.webFont) {
    loadFont(themeOptions.font);
  }

  return { theme: themeOptions };
}

export default function SkeletonEditor(props: Route.ComponentProps) {
  const { loaderData } = props;
  const [editorTheme, setEditorTheme] = useState<EditorThemeOptions>(
    loaderData.theme
  );
  const editorRef = useRef<TiptapEditor | null>(null);

  useEffect(() => {
    const base64 = btoa(JSON.stringify(editorTheme));
    window.history.replaceState(
      {},
      '',
      `?${THEME_KEY}=${encodeURIComponent(base64)}`
    );
  }, [editorTheme]);

  const { mutateAsync: previewEmail, isPending } = useMutation({
    mutationFn: async () => {
      const json = editorRef.current?.getJSON();
      return httpPost<{ html: string }>('/api/v1/emails/preview', {
        content: JSON.stringify(json),
        theme: editorTheme,
      });
    },
    onSuccess: (data) => {
      const newWindow = window.open('about:blank', '_blank');
      newWindow?.focus();

      const newDoc = newWindow?.document;
      if (!newDoc) {
        toast.error('Something went wrong.');
        return;
      }

      const html = new DOMParser().parseFromString(data?.html, 'text/html');

      newDoc.open();
      newDoc.write(html.documentElement.outerHTML);
      newDoc.close();
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to preview email');
    },
  });

  return (
    <div
      className="flex h-screen w-screen"
      style={getMailyCssVariables(editorTheme)}
    >
      <div className="grow">
        <div className="flex items-center border-b px-10 py-4">
          <button
            className="flex items-center gap-2 rounded-lg bg-black p-2 px-4 pr-5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isPending}
            onClick={() => {
              previewEmail();
            }}
          >
            {isPending && <Loader2Icon className="size-4 animate-spin" />}
            {!isPending && <EyeIcon className="size-4" />}
            Preview
          </button>
        </div>
        <div className="px-10 py-6">
          <Suspense>
            <Editor
              config={{
                hasMenuBar: false,
                wrapClassName: cn(
                  'editor-wrap w-full bg-[var(--mly-body-background-color)] px-[var(--mly-body-padding-left)] py-[var(--mly-body-padding-top)] [font-family:var(--mly-font)]'
                ),
                bodyClassName:
                  'editor-body bg-transparent! !mt-0 !border-0 !p-0 w-full',
                contentClassName: `editor-content mx-auto max-w-[var(--mly-container-max-width)]! bg-[var(--mly-container-background-color)] px-[var(--mly-container-padding-left)]! py-[var(--mly-container-padding-top)]! rounded-[var(--mly-container-border-radius)]! [border-width:var(--mly-container-border-width)]! [border-color:var(--mly-container-border-color)]!`,
                toolbarClassName: 'flex-wrap !items-start',
                spellCheck: false,
                autofocus: 'end',
                immediatelyRender: false,
              }}
              contentJson={defaultEmailJSON}
              onCreate={(editor) => {
                editorRef.current = editor;
              }}
              onUpdate={(editor) => {
                editorRef.current = editor;
              }}
            />
          </Suspense>
        </div>
      </div>
      <div className="w-xs space-y-10 border-l border-gray-200 px-6 pt-20">
        <TypographySettings
          fontTheme={editorTheme.font}
          setFontTheme={(fontTheme) =>
            setEditorTheme({ ...editorTheme, font: fontTheme })
          }
        />

        <LayoutSettings
          containerTheme={editorTheme.container}
          setContainerTheme={(containerTheme) =>
            setEditorTheme({ ...editorTheme, container: containerTheme })
          }
          bodyTheme={editorTheme.body}
          setBodyTheme={(bodyTheme) =>
            setEditorTheme({ ...editorTheme, body: bodyTheme })
          }
        />
        <ButtonSettings
          buttonTheme={editorTheme.button}
          setButtonTheme={(buttonTheme) =>
            setEditorTheme({ ...editorTheme, button: buttonTheme })
          }
        />
        <LinkSettings
          linkTheme={editorTheme.link}
          setLinkTheme={(linkTheme) =>
            setEditorTheme({ ...editorTheme, link: linkTheme })
          }
        />
      </div>
    </div>
  );
}

type TypographySettingsProps = {
  fontTheme: EditorThemeOptions['font'];
  setFontTheme: (fontTheme: EditorThemeOptions['font']) => void;
};

const loadedFonts: Set<string> = new Set();

function TypographySettings(props: TypographySettingsProps) {
  const { fontTheme, setFontTheme } = props;

  const fonts: {
    fontFamily: string;
    webFont: {
      url: string;
      format: FontFormat;
    };
  }[] = [
    {
      fontFamily: 'Inter',
      webFont: {
        url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@latest/latin-wght-normal.woff2',
        format: 'woff2',
      },
    },
    {
      fontFamily: 'Roboto',
      webFont: {
        url: 'https://cdn.jsdelivr.net/fontsource/fonts/roboto:vf@latest/latin-wght-normal.woff2',
        format: 'woff2',
      },
    },
    {
      fontFamily: 'Open Sans',
      webFont: {
        url: 'https://cdn.jsdelivr.net/fontsource/fonts/open-sans:vf@latest/latin-wght-normal.woff2',
        format: 'woff2',
      },
    },
    {
      fontFamily: 'Lato',
      webFont: {
        url: 'https://cdn.jsdelivr.net/fontsource/fonts/lato@latest/latin-400-normal.woff2',
        format: 'woff2',
      },
    },
    {
      fontFamily: 'Montserrat',
      webFont: {
        url: 'https://cdn.jsdelivr.net/fontsource/fonts/montserrat:vf@latest/latin-wght-normal.woff2',
        format: 'woff2',
      },
    },
    {
      fontFamily: 'Poppins',
      webFont: {
        url: 'https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-400-normal.woff2',
        format: 'woff2',
      },
    },
    {
      fontFamily: 'Raleway',
      webFont: {
        url: 'https://cdn.jsdelivr.net/fontsource/fonts/raleway:vf@latest/latin-wght-normal.woff2',
        format: 'woff2',
      },
    },
    {
      fontFamily: 'Ubuntu',
      webFont: {
        url: 'https://cdn.jsdelivr.net/fontsource/fonts/ubuntu@latest/latin-400-normal.woff2',
        format: 'woff2',
      },
    },
  ];

  return (
    <div>
      <h3 className="text-sm font-medium">Typography</h3>

      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Font</label>
          </div>

          <Select
            icon={ALargeSmallIcon}
            value={fontTheme?.fontFamily ?? ''}
            onChange={async (value) => {
              if (value === 'Default') {
                setFontTheme(null);
              } else {
                const font = fonts.find((font) => font.fontFamily === value);
                if (!font) {
                  return;
                }

                const newFont = {
                  fontFamily: value,
                  fallbackFontFamily:
                    fontTheme?.fallbackFontFamily ??
                    DEFAULT_FONT.fallbackFontFamily,
                  webFont: font.webFont,
                };

                const key = JSON.stringify(newFont);
                if (!loadedFonts.has(key)) {
                  loadedFonts.add(key);
                  loadFont(newFont);
                }

                setFontTheme(newFont);
              }
            }}
            options={[
              { value: 'Default', label: 'Default' },
              ...fonts.map((font) => ({
                value: font.fontFamily,
                label: font.fontFamily,
              })),
            ]}
          />
        </div>

        {fontTheme?.fontFamily && (
          <div className="flex items-center gap-2">
            <div className="w-25 shrink-0 grow text-sm">
              <label>Fallback</label>
            </div>

            <Select
              icon={RotateCwIcon}
              value={fontTheme?.fallbackFontFamily ?? ''}
              onChange={(value) =>
                setFontTheme({
                  fontFamily: fontTheme?.fontFamily ?? DEFAULT_FONT.fontFamily,
                  fallbackFontFamily: value as FallbackFont,
                })
              }
              options={allowedFallbackFonts.map((font) => ({
                value: font,
                label: font,
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

type LayoutSettingsProps = {
  containerTheme: EditorThemeOptions['container'];
  setContainerTheme: (containerTheme: EditorThemeOptions['container']) => void;
  bodyTheme: EditorThemeOptions['body'];
  setBodyTheme: (bodyTheme: EditorThemeOptions['body']) => void;
};

function LayoutSettings(props: LayoutSettingsProps) {
  const { containerTheme, setContainerTheme, bodyTheme, setBodyTheme } = props;

  const bodyPaddingTop = parseInt(String(bodyTheme?.paddingTop ?? '0'));
  const bodyPaddingRight = parseInt(String(bodyTheme?.paddingRight ?? '0'));

  const paddingTop = parseInt(String(containerTheme?.paddingTop ?? '0'));
  const paddingRight = parseInt(String(containerTheme?.paddingRight ?? '0'));

  const borderRadius = parseInt(String(containerTheme?.borderRadius ?? '0'));
  const borderWidth = parseInt(String(containerTheme?.borderWidth ?? '0'));

  return (
    <div>
      <h3 className="text-sm font-medium">Layout</h3>

      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Body</label>
          </div>

          <ColorInput
            value={bodyTheme?.backgroundColor ?? '#000000'}
            onChange={(value) =>
              setBodyTheme({ ...bodyTheme, backgroundColor: value })
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Padding</label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <NumberInput
              value={paddingTop}
              onChange={(value) => {
                const padding = `${value}px`;
                setContainerTheme({
                  ...containerTheme,
                  paddingTop: padding,
                  paddingBottom: padding,
                });
              }}
              icon={AlignVerticalSpaceAroundIcon}
            />
            <NumberInput
              value={paddingRight}
              onChange={(value) => {
                const padding = `${value}px`;
                setContainerTheme({
                  ...containerTheme,
                  paddingRight: padding,
                  paddingLeft: padding,
                });
              }}
              icon={AlignHorizontalSpaceAroundIcon}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Gutter</label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <NumberInput
              value={bodyPaddingTop}
              onChange={(value) => {
                const padding = `${value}px`;
                setBodyTheme({
                  ...bodyTheme,
                  paddingTop: padding,
                  paddingBottom: padding,
                });
              }}
              icon={AlignVerticalSpaceAroundIcon}
            />
            <NumberInput
              value={bodyPaddingRight}
              onChange={(value) => {
                const padding = `${value}px`;
                setBodyTheme({
                  ...bodyTheme,
                  paddingRight: padding,
                  paddingLeft: padding,
                });
              }}
              icon={AlignHorizontalSpaceAroundIcon}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Container</label>
          </div>

          <ColorInput
            value={containerTheme?.backgroundColor ?? '#000000'}
            onChange={(value) =>
              setContainerTheme({ ...containerTheme, backgroundColor: value })
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Radius</label>
          </div>

          <NumberInput
            value={borderRadius}
            onChange={(value) =>
              setContainerTheme({
                ...containerTheme,
                borderRadius: `${value}px`,
              })
            }
            icon={SquareRoundCornerIcon}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Border Width</label>
          </div>

          <NumberInput
            value={borderWidth}
            onChange={(value) =>
              setContainerTheme({
                ...containerTheme,
                borderWidth: `${value}px`,
              })
            }
            icon={MenuIcon}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Border Color</label>
          </div>

          <ColorInput
            value={containerTheme?.borderColor ?? '#000000'}
            onChange={(value) =>
              setContainerTheme({ ...containerTheme, borderColor: value })
            }
          />
        </div>
      </div>
    </div>
  );
}

type ButtonSettingsProps = {
  buttonTheme: EditorThemeOptions['button'];
  setButtonTheme: (buttonTheme: EditorThemeOptions['button']) => void;
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

type LinkSettingsProps = {
  linkTheme: EditorThemeOptions['link'];
  setLinkTheme: (linkTheme: EditorThemeOptions['link']) => void;
};

function LinkSettings(props: LinkSettingsProps) {
  const { linkTheme, setLinkTheme } = props;

  return (
    <div>
      <h3 className="text-sm font-medium">Link</h3>

      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-25 shrink-0 grow text-sm">
            <label>Color</label>
          </div>

          <ColorInput
            value={linkTheme?.color ?? '#000000'}
            onChange={(value) => setLinkTheme({ ...linkTheme, color: value })}
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
