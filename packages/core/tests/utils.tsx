import type {
  DocumentNode,
  NodeThemeOptions,
  TextDirection,
} from '@maily-to/shared';
import { DEFAULT_NODE_THEME } from '@maily-to/shared';
import {
  cleanup,
  render as renderReact,
  waitFor,
} from '@testing-library/react';
import type { AnyExtension, JSONContent } from '@tiptap/core';
import type { CSSProperties, ReactNode } from 'react';
import { createRef } from 'react';
import { afterEach, expect } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { ThemeExtension } from '~/extensions';
import { Editor } from '~/index';

import editorCss from '~/styles/index.css?raw';

const userAgent = navigator.userAgent.toLowerCase();

export const isWebKit =
  typeof CSS !== 'undefined' &&
  Boolean(CSS.supports?.('-webkit-backdrop-filter:none'));

export const isFirefox = !isWebKit && userAgent.includes('firefox');

/**
 * Wraps blocks in the body and container the document schema requires, so a
 * fixture never relies on ProseMirror refitting an invalid document.
 */
export function getDocument(blocks: JSONContent[]) {
  return {
    type: 'doc',
    attrs: { version: 2 },
    content: [
      { type: 'body', content: [{ type: 'container', content: blocks }] },
    ],
  } as unknown as DocumentNode;
}

export const EMPTY_DOCUMENT = getDocument([{ type: 'paragraph' }]);

export type RenderEditorOptions = {
  caret?: number | 'end' | 'start';
  children?: ReactNode;
  content?: JSONContent | string;
  editable?: boolean;
  extensions?: AnyExtension[];
  frame?: boolean;
  styled?: boolean;
  textDirection?: TextDirection;
  theme?: NodeThemeOptions | true;
  toolbar?: ReactNode;
  wrapper?: CSSProperties;
};

export type RenderEditorResult = {
  editable: HTMLElement;
  ref: React.RefObject<Editor.Root.Handle | null>;
  view: ReturnType<typeof renderReact>;
};

function addEditorStyles() {
  const style = document.createElement('style');
  style.dataset.styled = '';
  style.textContent = editorCss;
  document.head.append(style);
}

async function renderEditor(
  options: RenderEditorOptions = {}
): Promise<RenderEditorResult> {
  const {
    caret,
    children,
    content = EMPTY_DOCUMENT,
    editable: isEditable = true,
    extensions,
    frame = false,
    styled = false,
    textDirection,
    theme,
    toolbar,
    wrapper,
  } = options;

  const themeExtensions = theme
    ? [
        ThemeExtension.configure({
          theme: theme === true ? DEFAULT_NODE_THEME : theme,
        }),
      ]
    : [];

  if (styled) {
    addEditorStyles();
  }

  const ref = createRef<Editor.Root.Handle>();
  const editor = (
    <Editor.Root
      content={content}
      editable={isEditable}
      extensions={[...themeExtensions, ...(extensions ?? [])]}
      textDirection={textDirection}
      ref={ref}
    >
      {toolbar}
      {frame ? (
        <Editor.Frame>
          <Editor.Content />
        </Editor.Frame>
      ) : (
        <Editor.Content />
      )}
      {children}
    </Editor.Root>
  );

  const view = renderReact(
    wrapper ? <div style={wrapper}>{editor}</div> : editor
  );

  await waitFor(() => {
    expect(ref.current).not.toBeNull();
  });

  const editable = view.container.querySelector<HTMLElement>(
    '[contenteditable="true"]'
  );

  if (caret !== undefined && editable) {
    await userEvent.click(editable);
    ref.current!.getEditor().commands.focus(caret);

    await waitFor(() => {
      expect(editable).toHaveFocus();
    });
  }

  return { editable: editable as HTMLElement, ref, view };
}

export { cleanup };

export function getContainerContent(handle: Editor.Root.Handle) {
  return handle.getJSON().content?.[0]?.content?.[0]?.content ?? [];
}

export function createRenderer() {
  afterEach(() => {
    cleanup();
    document.querySelectorAll('[data-styled]').forEach((node) => {
      node.remove();
    });
  });

  return { render: renderEditor };
}
