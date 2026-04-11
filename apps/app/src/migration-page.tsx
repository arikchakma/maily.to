import { migrate } from '@maily-to/migration';
import type { MigrationWarning } from '@maily-to/migration';
import { lazy, Suspense, useMemo, useState } from 'react';

import { JsonEditor } from './json-editor';
import { Nav } from './nav';

const LazyMultiFileDiff = lazy(() =>
  import('@pierre/diffs/react').then((m) => ({ default: m.MultiFileDiff }))
);

const SAMPLE_V1_DOC = JSON.stringify(
  {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        attrs: { textDirection: 'ltr' },
        content: [
          {
            type: 'text',
            text: 'Hello ',
            marks: [
              {
                type: 'link',
                attrs: {
                  href: 'https://example.com',
                  isUrlVariable: true,
                },
              },
            ],
          },
        ],
      },
      {
        type: 'button',
        attrs: {
          text: 'Subscribe',
          buttonColor: '#000000',
          textColor: '#ffffff',
          variant: 'filled',
          borderRadius: 'round',
          url: 'https://example.com',
          alignment: 'center',
          showIfKey: 'showBtn',
        },
      },
      {
        type: 'logo',
        attrs: {
          src: 'https://example.com/logo.png',
          size: 'lg',
          alignment: 'left',
        },
      },
      {
        type: 'spacer',
        attrs: { height: 24 },
      },
      {
        type: 'image',
        attrs: {
          src: 'https://example.com/img.png',
          alignment: 'center',
          borderRadius: 8,
          width: 'auto',
        },
      },
      {
        type: 'columns',
        attrs: {},
        content: [
          {
            type: 'column',
            attrs: { width: '50%', columnId: 'col-1' },
            content: [{ type: 'paragraph', attrs: {} }],
          },
          {
            type: 'column',
            attrs: { width: 'auto' },
            content: [{ type: 'paragraph', attrs: {} }],
          },
        ],
      },
      {
        type: 'footer',
        attrs: {
          'maily-component': 'footer',
          textAlign: 'center',
        },
      },
    ],
  },
  null,
  2
);

type ViewMode = 'side-by-side' | 'diff';

type ViewToggleProps = {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
};

function ViewToggle(props: ViewToggleProps) {
  const { mode, onChange } = props;

  return (
    <div className="flex gap-px rounded-md bg-gray-200 p-0.5">
      <button
        type="button"
        className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
          mode === 'side-by-side'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onChange('side-by-side')}
      >
        Side by Side
      </button>
      <button
        type="button"
        className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
          mode === 'diff'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onChange('diff')}
      >
        Diff
      </button>
    </div>
  );
}

type WarningsProps = { warnings: MigrationWarning[] };

function Warnings(props: WarningsProps) {
  const { warnings } = props;
  if (warnings.length === 0) {
    return null;
  }

  return (
    <details className="shrink-0 border-t border-amber-200 bg-amber-50">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-amber-800 select-none">
        Warnings ({warnings.length})
      </summary>
      <ul className="space-y-1 px-4 pb-3">
        {warnings.map((w, i) => (
          <li key={i} className="text-sm text-amber-700">
            <span className="font-mono">
              {w.nodeType}.{w.field}
            </span>
            {' — '}
            {w.message}
          </li>
        ))}
      </ul>
    </details>
  );
}

export function MigrationPage() {
  const [input, setInput] = useState(SAMPLE_V1_DOC);
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      const migrated = migrate(parsed);
      return {
        output: JSON.stringify(migrated.json, null, 2),
        warnings: migrated.warnings,
        error: null,
      };
    } catch (e) {
      return {
        output: '',
        warnings: [] as MigrationWarning[],
        error: e instanceof Error ? e.message : 'Invalid JSON',
      };
    }
  }, [input]);

  return (
    <div className="flex h-screen flex-col">
      <Nav.Navigation />

      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
        <span className="text-sm font-medium text-gray-600">
          v1 → v2 Migration
        </span>
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === 'side-by-side' ? (
        <div className="grid min-h-0 flex-1 grid-cols-2 divide-x divide-gray-200">
          <div className="flex flex-col overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600">
              v1 Input
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              <JsonEditor value={input} onChange={setInput} height="100%" />
            </div>
          </div>

          <div className="flex flex-col overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600">
              v2 Output
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              {result.error ? (
                <div className="p-4 text-sm text-red-600">{result.error}</div>
              ) : (
                <JsonEditor value={result.output} height="100%" readOnly />
              )}
            </div>

            <Warnings warnings={result.warnings} />
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-auto">
            {result.error ? (
              <div className="p-4 text-sm text-red-600">{result.error}</div>
            ) : (
              <Suspense
                fallback={
                  <div className="p-4 text-sm text-gray-400">
                    Loading diff viewer...
                  </div>
                }
              >
                <LazyMultiFileDiff
                  oldFile={{
                    name: 'old-document.json',
                    contents: input,
                  }}
                  newFile={{
                    name: 'new-document.json',
                    contents: result.output,
                  }}
                  options={{
                    diffStyle: 'split',
                    overflow: 'wrap',
                    themeType: 'light',
                    theme: 'github-light',
                  }}
                  style={{ height: '100%' }}
                />
              </Suspense>
            )}
          </div>

          <Warnings warnings={result.warnings} />
        </div>
      )}
    </div>
  );
}
