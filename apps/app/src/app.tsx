import { Editor, Toolbar } from '@maily-to/core';
import type { EditorThemeOptions } from '@maily-to/core';
import {
  AIActions,
  ImageUploadExtension,
  InlineSuggestion,
  LinkCardExtension,
  VariableExtension,
} from '@maily-to/core/extensions';
import { ThemeProvider } from '@maily-to/ui';
import type { Editor as TiptapEditor, EditorEvents } from '@tiptap/react';
import { Loader2Icon } from 'lucide-react';
import { lazy, Suspense, useCallback, useMemo, useRef, useState } from 'react';

import defaultEditorJson from './default-editor-json.json';
import { Nav } from './nav';
import * as ThemeSettings from './theme-settings/theme-settings';
import { useReactEmailPreview } from './use-react-email-preview';

const IS_DEV = import.meta.env.DEV;
const DevEmailPreview = IS_DEV
  ? lazy(() =>
      import('./react-email-preview').then((module) => ({
        default: module.ReactEmailPreview,
      }))
    )
  : null;

export function App() {
  const [theme, setTheme] = useState<EditorThemeOptions>(() => ({
    body: {
      backgroundColor: '#f9fafb',
    },
    container: {
      backgroundColor: '#ffffff',
      maxWidth: 600,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      paddingTop: 16,
      paddingRight: 16,
      paddingBottom: 16,
      paddingLeft: 16,
    },
  }));

  const {
    jsx,
    html,
    rawHtml,
    json,
    onUpdate: onUpdatePreview,
  } = useReactEmailPreview(theme);

  const extensions = useMemo(
    () => [
      ImageUploadExtension.configure({
        onImageUpload: async (file) => {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return URL.createObjectURL(file);
        },
        onImageUploadError(error, file, context) {
          console.error(error);
          console.log(file);
          console.log(context);
        },
      }),
      AIActions.configure({
        transform: async ({ text, action }, { write }) => {
          const result = `[${action}] ${text}`;
          for (let i = 1; i <= result.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 30));
            write(result.slice(0, i));
          }
          return result;
        },
      }),
      InlineSuggestion.configure({
        triggerKey: ' ',
        suggest: async (existingText) => {
          console.log(
            `API Call at ${new Date().toLocaleTimeString()}: "${existingText}"`
          );

          await new Promise((resolve) => setTimeout(resolve, 100));

          const suggestions = [
            ' and this completes your thought',
            ' with some helpful context',
            ' making your writing better',
            ' that adds valuable information',
            ' continuing this sentence naturally',
          ];

          return suggestions[existingText.length % suggestions.length];
        },
      }),
      LinkCardExtension,
      VariableExtension.configure({
        variables: [
          { id: 'name', label: 'Name' },
          { id: 'email', label: 'Email' },
          { id: 'phone', label: 'Phone' },
        ],
      }),
    ],
    []
  );

  const editorRef = useRef<TiptapEditor | null>(null);

  const onUpdate = useCallback((props: EditorEvents['update']) => {
    const { editor } = props;
    editorRef.current = editor;

    if (IS_DEV) {
      void onUpdatePreview(editor);
      console.log(editor.getJSON());
    }
  }, []);

  const onCreate = useCallback((props: EditorEvents['create']) => {
    const { editor } = props;
    editorRef.current = editor;

    if (IS_DEV) {
      void onUpdatePreview(editor);
      console.log(editor.getJSON());
    }
  }, []);

  const onThemeChange = useCallback(
    (next: EditorThemeOptions) => {
      setTheme(next);
      if (IS_DEV && editorRef.current) {
        void onUpdatePreview(editorRef.current);
      }
    },
    [onUpdatePreview]
  );

  return (
    <ThemeProvider theme={theme} onThemeChange={onThemeChange}>
      <div>
        <Nav.Navigation />
        <div className={`px-4 pt-4 ${IS_DEV ? 'grid grid-cols-2' : ''}`}>
          <div className="mx-auto w-full max-w-[600px]">
            <Editor.Root
              content={defaultEditorJson}
              onUpdate={onUpdate}
              onCreate={onCreate}
              extensions={extensions}
              theme={theme}
            >
              <Toolbar.Root>
                <Toolbar.CommonActions />
              </Toolbar.Root>

              <Editor.Frame>
                <Editor.Content />
              </Editor.Frame>
            </Editor.Root>

            <ThemeSettings.Root>
              <ThemeSettings.Font />
              <ThemeSettings.Layout />
              <ThemeSettings.Button />
              <ThemeSettings.Link />
            </ThemeSettings.Root>
          </div>

          {IS_DEV && DevEmailPreview && (
            <Suspense
              fallback={
                <div className="flex justify-center p-4">
                  <Loader2Icon className="size-4 animate-spin" />
                </div>
              }
            >
              <DevEmailPreview
                jsx={jsx}
                html={html}
                rawHtml={rawHtml}
                json={json}
              />
            </Suspense>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}
