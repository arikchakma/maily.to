import { Editor, ThemeSettings, Toolbar } from '@maily-to/core';
import {
  ImageUploadExtension,
  LinkCardExtension,
  ThemeExtension,
  VariableExtension,
} from '@maily-to/core/extensions';
import type {
  AIActionsTransformContext,
  AIActionsTransformParams,
} from '@maily-to/extension-ai-actions';
import { AIActions } from '@maily-to/extension-ai-actions';
import { InlineSuggestion } from '@maily-to/extension-inline-suggestion';
import type { DocumentNode } from '@maily-to/shared';
import { BASIC_NODE_THEME } from '@maily-to/shared';
import { useCallback, useMemo, useState } from 'react';

import { DEFAULT_DOCUMENT } from './default-document';
import DEFAULT_EMAIL_HTML from './default-email.html?raw';
import { Nav } from './nav';
import { PreviewPanel } from './preview-panel';
import { useEmailPreview } from './use-email-preview';

const SEARCH_PARAMS = new URLSearchParams(window.location.search);

const BLANK_DOCUMENT: DocumentNode = {
  type: 'doc',
  attrs: { version: 2 },
  content: [
    {
      type: 'body',
      content: [{ type: 'container', content: [{ type: 'paragraph' }] }],
    },
  ],
};

const getInitialContent = () => {
  if (SEARCH_PARAMS.has('fixture')) {
    return DEFAULT_DOCUMENT;
  }

  if (SEARCH_PARAMS.has('blank')) {
    return BLANK_DOCUMENT;
  }

  return DEFAULT_EMAIL_HTML;
};

const INITIAL_CONTENT = getInitialContent();

const HAS_THEME_SETTINGS =
  SEARCH_PARAMS.has('fixture') || SEARCH_PARAMS.has('blank');

const AI_MODE = SEARCH_PARAMS.get('ai') ?? 'stream';

const AI_STREAM_DELAY = 12;

const AI_ONE_SHOT_DELAY = 500;

const AI_ACTION_LABELS: Record<string, string> = {
  'fix-grammar': 'Grammar fixed',
  improve: 'Improved',
  'make-longer': 'Longer',
  'make-shorter': 'Shorter',
  simplify: 'Simplified',
};

type GetAIResultOptions = {
  ctx: AIActionsTransformContext;
  params: AIActionsTransformParams;
};

const getAIDelay = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const getAIResult = async (options: GetAIResultOptions) => {
  const { ctx, params } = options;
  const label = AI_ACTION_LABELS[params.action] ?? params.action;
  const result = `${label}: ${params.text}`;

  if (AI_MODE === 'fail') {
    await getAIDelay(AI_STREAM_DELAY);

    throw new Error(`Demo AI action "${params.action}" failed.`);
  }

  if (AI_MODE === 'oneshot') {
    await getAIDelay(AI_ONE_SHOT_DELAY);

    return result;
  }

  for (let index = 1; index <= result.length; index += 1) {
    await getAIDelay(AI_STREAM_DELAY);
    ctx.write(result.slice(0, index));
  }

  return result;
};

const INLINE_SUGGESTIONS = [
  ' and this completes your thought',
  ' with some helpful context',
  ' making your writing better',
];

const EDITOR_VARIABLES = [
  { id: 'firstName' },
  { id: 'lastName' },
  { id: 'email' },
];

const PREVIEW_VARIABLES = {
  email: 'ada@example.com',
  firstName: 'Ada',
  isSubscribed: false,
  items: [
    { joinedAt: 'March 2025', name: 'Ada Lovelace', role: 'Engineering' },
    { joinedAt: 'June 2025', name: 'Grace Hopper', role: 'Design' },
  ],
  lastName: 'Lovelace',
};

export function App() {
  const [document, setDocument] = useState<DocumentNode | undefined>(undefined);
  const [isThemed, setIsThemed] = useState(true);
  const [status, setStatus] = useState('Ready');

  const theme = useMemo(
    () => (isThemed ? BASIC_NODE_THEME : undefined),
    [isThemed]
  );

  const extensions = useMemo(
    () => [
      VariableExtension.configure({ variables: EDITOR_VARIABLES }),
      ImageUploadExtension.configure({
        onImageUpload: (file) => Promise.resolve(URL.createObjectURL(file)),
      }),
      LinkCardExtension,
      AIActions.configure({
        transform: (params, ctx) => {
          return getAIResult({ ctx, params });
        },
      }),
      InlineSuggestion.configure({
        suggest: async (text) => {
          await new Promise((resolve) => setTimeout(resolve, 100));

          return INLINE_SUGGESTIONS[text.length % INLINE_SUGGESTIONS.length]!;
        },
        triggerKey: ' ',
      }),
      ...(theme ? [ThemeExtension.configure({ theme })] : []),
    ],
    [theme]
  );

  const preview = useEmailPreview({ document, variables: PREVIEW_VARIABLES });

  const updateDocument = useCallback((value: DocumentNode) => {
    setDocument(value);
    setStatus('Synced');
  }, []);

  const reset = useCallback(() => {
    setDocument(undefined);
    setStatus('Ready');
  }, []);

  return (
    <div>
      <Nav.Root>
        <Nav.Tab to="/">Editor</Nav.Tab>
        <Nav.Tab to="/migration">Migration</Nav.Tab>
        <Nav.Actions>
          <Nav.Toggle checked={isThemed} onChange={setIsThemed}>
            Node theme
          </Nav.Toggle>
          <Nav.Button onClick={reset}>Reset</Nav.Button>
        </Nav.Actions>
        <Nav.Status>{status}</Nav.Status>
      </Nav.Root>

      <div className="grid grid-cols-2 gap-4 px-4 pt-4">
        <div className="mx-auto w-full max-w-155">
          <Editor.Root
            content={document ?? INITIAL_CONTENT}
            extensions={extensions}
            key={isThemed ? 'themed' : 'unstyled'}
            onCreate={(event) =>
              updateDocument(event.editor.getJSON() as DocumentNode)
            }
            onUpdate={(event) =>
              updateDocument(event.editor.getJSON() as DocumentNode)
            }
          >
            <Toolbar.Root>
              <Toolbar.CommonActions />
            </Toolbar.Root>

            <Editor.Frame>
              <Editor.Content />
              <Editor.BubbleMenus />
              <Editor.DragContextHandle />
            </Editor.Frame>

            {HAS_THEME_SETTINGS && (
              <div className="fixed bottom-4 left-1/4 z-20 -translate-x-1/2">
                <ThemeSettings.Root>
                  <ThemeSettings.Font />
                  <ThemeSettings.Layout />
                  <ThemeSettings.Button />
                  <ThemeSettings.Text />
                </ThemeSettings.Root>
              </div>
            )}
          </Editor.Root>
        </div>

        <PreviewPanel
          html={preview.html}
          json={preview.json}
          jsx={preview.jsx}
          rawHtml={preview.rawHtml}
        />
      </div>
    </div>
  );
}
