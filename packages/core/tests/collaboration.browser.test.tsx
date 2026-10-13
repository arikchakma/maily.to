import { BASIC_NODE_THEME } from '@maily-to/shared';
import {
  cleanup,
  render as renderReact,
  waitFor,
} from '@testing-library/react';
import type { JSONContent } from '@tiptap/core';
import { Collaboration } from '@tiptap/extension-collaboration';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { applyUpdate, Doc, encodeStateAsUpdate } from 'yjs';

import { getDocument } from '#test-utils';
import { CollaborationAttributesExtension, ThemeExtension } from '~/extensions';
import { Editor } from '~/index';

afterEach(() => {
  cleanup();
});

async function renderCollaborator(document: Doc) {
  const ref = createRef<Editor.Root.Handle>();

  renderReact(
    <Editor.Root
      extensions={[
        Collaboration.configure({ document }),
        CollaborationAttributesExtension.configure({ document }),
        ThemeExtension,
      ]}
      ref={ref}
    >
      <Editor.Content />
    </Editor.Root>
  );

  await waitFor(() => {
    expect(ref.current).not.toBeNull();
  });

  return () => ref.current!.getEditor();
}

describe('collaboration', () => {
  it('keeps content, ids, theme and direction the same in two editors', async () => {
    const document = new Doc();
    const getFirst = await renderCollaborator(document);
    const getSecond = await renderCollaborator(document);

    expect(
      getFirst().extensionManager.extensions.map((extension) => extension.name)
    ).not.toContain('undoRedo');

    getFirst().commands.setContent(
      getDocument([
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Shared paragraph' }],
        },
      ])
    );
    getFirst().commands.setNodeTheme(BASIC_NODE_THEME);
    getFirst().view.dispatch(getFirst().state.tr.setDocAttribute('dir', 'rtl'));

    await waitFor(() => {
      expect(getSecond().getJSON()).toEqual(getFirst().getJSON());
      expect(getSecond().view.dom.getAttribute('dir')).toBe('rtl');
    });

    const json: JSONContent = getSecond().getJSON();
    const paragraph = json.content?.[0]?.content?.[0]?.content?.[0];

    expect({
      dir: json.attrs?.dir,
      hasId: typeof paragraph?.attrs?.id === 'string',
      text: getSecond().getText().trim(),
      theme: json.attrs?.theme,
    }).toEqual({
      dir: 'rtl',
      hasId: true,
      text: 'Shared paragraph',
      theme: BASIC_NODE_THEME,
    });

    const getLate = await renderCollaborator(document);

    await waitFor(() => {
      expect(getLate().getJSON()).toEqual(getFirst().getJSON());
    });
  });

  it('keeps concurrent changes to different theme properties', async () => {
    const firstDocument = new Doc();
    const secondDocument = new Doc();
    const sync = () => {
      applyUpdate(secondDocument, encodeStateAsUpdate(firstDocument));
      applyUpdate(firstDocument, encodeStateAsUpdate(secondDocument));
    };

    const getFirst = await renderCollaborator(firstDocument);
    const getSecond = await renderCollaborator(secondDocument);

    getFirst().commands.setNodeTheme(BASIC_NODE_THEME);
    sync();

    await waitFor(() => {
      expect(getSecond().state.doc.attrs.theme).toEqual(BASIC_NODE_THEME);
    });

    getFirst().commands.updateNodeTheme({
      button: { backgroundColor: '#ff0000' },
    });
    getSecond().commands.updateNodeTheme({ paragraph: { color: '#00ff00' } });
    sync();

    await waitFor(() => {
      const theme = getFirst().state.doc.attrs.theme;

      expect({
        button: theme.button.backgroundColor,
        paragraph: theme.paragraph.color,
        same: getSecond().state.doc.attrs.theme,
      }).toEqual({
        button: '#ff0000',
        paragraph: '#00ff00',
        same: theme,
      });
    });
  });
});
