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
import { Doc } from 'yjs';

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
});
