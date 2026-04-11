import type { EditorThemeOptions } from '@maily-to/core';
import type { Editor } from '@tiptap/react';
import { useCallback, useRef, useState } from 'react';
import _jsxToString from 'react-element-to-jsx-string';

const jsxToString: typeof _jsxToString = ((
  _jsxToString as unknown as { default: typeof _jsxToString }
).default ?? _jsxToString) as typeof _jsxToString;

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
  const highlightedCode = await shiki.codeToHtml(code, {
    lang: language,
    theme: 'github-light',
  });

  return highlightedCode;
}

export function useReactEmailPreview(theme: EditorThemeOptions) {
  const [jsx, setJsx] = useState<string>('');
  const [html, setHtml] = useState<string>('');
  const [rawHtml, setRawHtml] = useState<string>('');
  const [jsonStr, setJsonStr] = useState<string>('');

  const themeRef = useRef(theme);
  themeRef.current = theme;

  const onUpdate = useCallback(async (editor: Editor) => {
    const json = editor.getJSON();
    setJsonStr(JSON.stringify(json, null, 2));
    const config = { theme: themeRef.current };

    const markup = await import('@maily-to/render').then(
      (module) => module.markup
    );
    const render = await import('@maily-to/render').then(
      (module) => module.render
    );

    const jsxElement = markup(json, config);
    const html = await render(json, config);

    setRawHtml(html);

    const jsxString = jsxToString(jsxElement, {
      filterProps: ['key'],
    })
      .replaceAll(/<React.Fragment>/g, '')
      .replaceAll(/<React.Fragment \/>/g, '')
      .replaceAll(/<\/React.Fragment>/g, '');

    const componet = `function Email() {return ${jsxString}}`;

    const [formattedJSX, formattedHtml] = await Promise.all([
      format(componet, 'acorn'),
      format(html, 'html'),
    ]);

    const [highlightedJSX, highlightedHtml] = await Promise.all([
      highlight(formattedJSX, 'jsx'),
      highlight(formattedHtml, 'html'),
    ]);

    setJsx(highlightedJSX);
    setHtml(highlightedHtml);
  }, []);

  return { jsx, html, rawHtml, json: jsonStr, onUpdate };
}
