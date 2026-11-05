import type { VariableValue } from '@maily-to/render';
import { markup, render } from '@maily-to/render';
import type { DocumentNode, NodeThemeOptions } from '@maily-to/shared';
import { useEffect, useState } from 'react';
import _jsxToString from 'react-element-to-jsx-string';

const jsxToString: typeof _jsxToString = ((
  _jsxToString as unknown as { default: typeof _jsxToString }
).default ?? _jsxToString) as typeof _jsxToString;

type ElementLike = {
  type?: unknown;
};

type NamedComponent = {
  displayName?: string;
  name?: string;
  render?: { displayName?: string; name?: string };
  type?: NamedComponent;
};

/**
 * `react-element-to-jsx-string` cannot name `forwardRef` or `memo`
 * components, so every React Email primitive prints as
 * `UnknownElementType`. Resolve the name the same way React DevTools does.
 */
function getDisplayName(element: unknown): string {
  const { type } = (element ?? {}) as ElementLike;

  if (typeof type === 'string') {
    return type;
  }

  const component = type as NamedComponent | undefined;

  return (
    component?.displayName ??
    component?.name ??
    component?.render?.displayName ??
    component?.render?.name ??
    component?.type?.displayName ??
    component?.type?.name ??
    'Unknown'
  );
}

async function format(code: string, parser: string) {
  const prettier = await import('prettier/standalone');

  return prettier.format(code, {
    parser,
    plugins: [
      await import('prettier/plugins/html'),
      await import('prettier/plugins/acorn'),
      (await import('prettier/plugins/estree')).default,
    ],
  });
}

async function highlight(code: string, language: string) {
  const shiki = await import('shiki');

  return shiki.codeToHtml(code, { lang: language, theme: 'github-light' });
}

const PREVIEW_DELAY = 150;

export type EmailPreview = {
  html: string;
  json: string;
  jsx: string;
  rawHtml: string;
};

export type EmailPreviewOptions = {
  document: DocumentNode | undefined;
  theme?: NodeThemeOptions;
  variables?: Record<string, VariableValue>;
};

export function useEmailPreview(options: EmailPreviewOptions): EmailPreview {
  const { document, theme, variables } = options;
  const [preview, setPreview] = useState<EmailPreview>({
    html: '',
    json: '',
    jsx: '',
    rawHtml: '',
  });

  useEffect(() => {
    if (!document) {
      return;
    }

    const source = document;
    let active = true;

    async function build() {
      const rawHtml = await render(source, { theme, variables });
      if (!active) {
        return;
      }

      setPreview((current) => ({
        ...current,
        json: JSON.stringify(source, null, 2),
        rawHtml,
      }));

      const jsxString = jsxToString(markup(source, { theme, variables }), {
        displayName: getDisplayName,
        filterProps: ['key'],
      })
        .replaceAll('<React.Fragment>', '')
        .replaceAll('<React.Fragment />', '')
        .replaceAll('</React.Fragment>', '');

      const [formattedJsx, formattedHtml] = await Promise.all([
        format(`function Email() {return ${jsxString}}`, 'acorn'),
        format(rawHtml, 'html'),
      ]);

      const [highlightedJsx, highlightedHtml] = await Promise.all([
        highlight(formattedJsx, 'jsx'),
        highlight(formattedHtml, 'html'),
      ]);

      if (!active) {
        return;
      }

      setPreview((current) => ({
        ...current,
        html: highlightedHtml,
        jsx: highlightedJsx,
      }));
    }

    const timer = setTimeout(build, PREVIEW_DELAY);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [document, theme, variables]);

  return preview;
}
