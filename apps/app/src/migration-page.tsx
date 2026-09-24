import type { MigrationWarning } from '@maily-to/migration';
import { migrate } from '@maily-to/migration';
import type { VariableValue } from '@maily-to/render';
import { render } from '@maily-to/render';
import type { AnyMailyNode } from '@maily-to/shared';
import { MAILY_NODE_THEME } from '@maily-to/shared';
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { JsonEditor } from './json-editor';
import { Nav } from './nav';
import sampleV1Document from './sample-v1-document.json';
import { cn } from './utils/classname';

const LazyMultiFileDiff = lazy(() =>
  import('@pierre/diffs/react').then((module) => ({
    default: module.MultiFileDiff,
  }))
);

const SAMPLE_V1_DOC = JSON.stringify(sampleV1Document, null, 2);

const PREVIEW_VARIABLES: Record<string, VariableValue> = {
  archive: [{ title: 'Issue 41 — The Rendering Rewrite' }],
  deepDiveUrl: 'https://maily.to/deep-dive',
  firstName: 'Ada',
  isSubscribed: true,
  items: [
    { name: 'Ada Lovelace', role: 'Engineering' },
    { name: 'Grace Hopper', role: 'Design' },
  ],
  showSubscribeCta: true,
  webUrl: 'https://maily.to/issues/42',
};

type ViewMode = 'side-by-side' | 'diff' | 'preview';

const VIEW_MODES: { label: string; value: ViewMode }[] = [
  { label: 'Side by Side', value: 'side-by-side' },
  { label: 'Diff', value: 'diff' },
  { label: 'Preview', value: 'preview' },
];

type MigrationState = {
  error: string | null;
  json: AnyMailyNode | null;
  output: string;
  warnings: MigrationWarning[];
};

type PreviewState = {
  error: string | null;
  html: string;
};

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : 'Invalid JSON';
};

const getMigrationState = (input: string): MigrationState => {
  try {
    const migrated = migrate(JSON.parse(input));

    return {
      error: null,
      json: migrated.json as AnyMailyNode,
      output: JSON.stringify(migrated.json, null, 2),
      warnings: migrated.warnings,
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
      json: null,
      output: '',
      warnings: [],
    };
  }
};

type ViewToggleProps = {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
};

function ViewToggle(props: ViewToggleProps) {
  const { mode, onChange } = props;

  return (
    <div
      className="flex gap-px rounded-md bg-gray-200 p-0.5"
      data-migration-mode
      data-mode={mode}
    >
      {VIEW_MODES.map((option) => (
        <button
          className={cn(
            'rounded px-2.5 py-1 font-mono text-xs font-medium transition-colors',
            mode === option.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

type WarningsProps = {
  warnings: MigrationWarning[];
};

function Warnings(props: WarningsProps) {
  const { warnings } = props;

  if (warnings.length === 0) {
    return null;
  }

  return (
    <details
      className="shrink-0 border-t border-amber-200 bg-amber-50"
      data-migration-warnings
    >
      <summary className="cursor-pointer px-4 py-3 font-mono text-sm font-medium text-amber-800 select-none">
        Warnings ({warnings.length})
      </summary>
      <ul className="max-h-64 space-y-1 overflow-auto px-4 pb-3">
        {warnings.map((warning, index) => (
          <li
            className="text-sm text-amber-700"
            key={`${warning.nodeType}.${warning.field}.${index}`}
          >
            <span className="font-mono">
              {warning.nodeType}.{warning.field}
            </span>
            {' — '}
            {warning.message}
          </li>
        ))}
      </ul>
    </details>
  );
}

type ErrorMessageProps = {
  message: string;
};

function ErrorMessage(props: ErrorMessageProps) {
  return (
    <div className="p-4 text-sm text-red-600" data-migration-error>
      {props.message}
    </div>
  );
}

type PaneHeaderProps = {
  children: React.ReactNode;
};

function PaneHeader(props: PaneHeaderProps) {
  return (
    <div className="shrink-0 border-b border-gray-200 bg-gray-50 px-4 py-2 font-mono text-sm font-medium text-gray-600">
      {props.children}
    </div>
  );
}

type PreviewPaneProps = {
  preview: PreviewState;
};

function PreviewPane(props: PreviewPaneProps) {
  const { preview } = props;

  if (preview.error) {
    return <ErrorMessage message={preview.error} />;
  }

  if (!preview.html) {
    return (
      <div className="p-4 text-sm text-gray-400">Rendering preview...</div>
    );
  }

  return (
    <iframe
      className="size-full border-0 bg-white"
      data-migration-preview
      srcDoc={preview.html}
      title="Migrated email preview"
    />
  );
}

export function MigrationPage() {
  const [input, setInput] = useState(SAMPLE_V1_DOC);
  const [mode, setMode] = useState<ViewMode>('side-by-side');
  const [preview, setPreview] = useState<PreviewState>({
    error: null,
    html: '',
  });

  const result = useMemo(() => {
    return getMigrationState(input);
  }, [input]);

  const document = result.json;

  useEffect(() => {
    if (!document) {
      setPreview({ error: null, html: '' });

      return;
    }

    let active = true;

    const build = async () => {
      try {
        const html = await render(document, {
          theme: MAILY_NODE_THEME,
          variables: PREVIEW_VARIABLES,
        });

        if (active) {
          setPreview({ error: null, html });
        }
      } catch (error) {
        if (active) {
          setPreview({ error: getErrorMessage(error), html: '' });
        }
      }
    };

    void build();

    return () => {
      active = false;
    };
  }, [document]);

  const loadSample = useCallback(() => {
    setInput(SAMPLE_V1_DOC);
  }, []);

  const status = result.error
    ? 'Invalid input'
    : `${result.warnings.length} warnings`;

  return (
    <div className="flex h-screen flex-col">
      <Nav.Root>
        <Nav.Tab to="/">Editor</Nav.Tab>
        <Nav.Tab to="/migration">Migration</Nav.Tab>
        <Nav.Actions>
          <Nav.Button onClick={loadSample}>Load sample</Nav.Button>
        </Nav.Actions>
        <Nav.Status>{status}</Nav.Status>
      </Nav.Root>

      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
        <span className="font-mono text-sm font-medium text-gray-600">
          v1 → v2 Migration
        </span>
        <ViewToggle mode={mode} onChange={setMode} />
      </div>

      {mode === 'side-by-side' && (
        <div className="grid min-h-0 flex-1 grid-cols-2 divide-x divide-gray-200">
          <div className="flex flex-col overflow-hidden" data-migration-input>
            <PaneHeader>v1 Input</PaneHeader>
            <div className="min-h-0 flex-1 overflow-auto">
              <JsonEditor height="100%" onChange={setInput} value={input} />
            </div>
          </div>

          <div className="flex flex-col overflow-hidden" data-migration-output>
            <PaneHeader>v2 Output</PaneHeader>
            <div className="min-h-0 flex-1 overflow-auto">
              {result.error ? (
                <ErrorMessage message={result.error} />
              ) : (
                <JsonEditor height="100%" readOnly value={result.output} />
              )}
            </div>

            <Warnings warnings={result.warnings} />
          </div>
        </div>
      )}

      {mode === 'diff' && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-auto" data-migration-diff>
            {result.error ? (
              <ErrorMessage message={result.error} />
            ) : (
              <Suspense
                fallback={
                  <div className="p-4 text-sm text-gray-400">
                    Loading diff viewer...
                  </div>
                }
              >
                <LazyMultiFileDiff
                  newFile={{
                    contents: result.output,
                    name: 'v2-document.json',
                  }}
                  oldFile={{ contents: input, name: 'v1-document.json' }}
                  options={{
                    diffStyle: 'split',
                    overflow: 'wrap',
                    theme: 'github-light',
                    themeType: 'light',
                  }}
                  style={{ height: '100%' }}
                />
              </Suspense>
            )}
          </div>

          <Warnings warnings={result.warnings} />
        </div>
      )}

      {mode === 'preview' && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-auto">
            {result.error ? (
              <ErrorMessage message={result.error} />
            ) : (
              <PreviewPane preview={preview} />
            )}
          </div>

          <Warnings warnings={result.warnings} />
        </div>
      )}
    </div>
  );
}
