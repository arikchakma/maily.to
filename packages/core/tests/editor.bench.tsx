import type { DocumentNode } from '@maily-to/shared';
import { render as renderReact } from '@testing-library/react';
import type { JSONContent } from '@tiptap/core';
import { createRef } from 'react';
import { bench, describe } from 'vite-plus/test';

import { Editor, Toolbar } from '~/index';

const SENTENCE =
  'Maily renders mobile ready email layouts without table markup or inline styles.';

function getDocument(blocks: JSONContent[]) {
  return {
    type: 'doc',
    attrs: { version: 2 },
    content: [
      { type: 'body', content: [{ type: 'container', content: blocks }] },
    ],
  } as unknown as DocumentNode;
}

function getParagraphs(count: number) {
  return Array.from({ length: count }, (_, index) => {
    return {
      type: 'paragraph',
      content: [{ type: 'text', text: `${index + 1}. ${SENTENCE}` }],
    };
  });
}

const SMALL = getDocument(getParagraphs(20));
const LARGE = getDocument(getParagraphs(200));

type MountOptions = {
  chrome?: boolean;
  content: DocumentNode;
};

function mountEditor(options: MountOptions) {
  const { content, chrome = false } = options;
  const ref = createRef<Editor.Root.Handle>();

  const view = renderReact(
    <Editor.Root content={content} ref={ref}>
      {chrome ? (
        <Toolbar.Root>
          <Toolbar.CommonActions />
        </Toolbar.Root>
      ) : null}
      <Editor.Frame>
        <Editor.Content />
        {chrome ? <Editor.BubbleMenus /> : null}
        {chrome ? <Editor.DragContextHandle /> : null}
      </Editor.Frame>
    </Editor.Root>
  );

  return { ref, view };
}

const mounted = new Map<string, Editor.Root.Handle>();

function getMountedEditor(options: MountOptions) {
  const { content, chrome = false } = options;
  const key = `${content === LARGE ? 'large' : 'small'}:${chrome}`;
  const existing = mounted.get(key);

  if (existing) {
    return existing;
  }

  const { ref } = mountEditor({ content, chrome });
  mounted.set(key, ref.current!);

  return ref.current!;
}

describe('mount', () => {
  bench(
    '20 blocks',
    () => {
      mountEditor({ content: SMALL }).view.unmount();
    },
    { time: 1000 }
  );

  bench(
    '200 blocks',
    () => {
      mountEditor({ content: LARGE }).view.unmount();
    },
    { time: 1000 }
  );

  bench(
    '200 blocks with chrome',
    () => {
      mountEditor({ content: LARGE, chrome: true }).view.unmount();
    },
    { time: 1000 }
  );
});

describe('keystroke', () => {
  bench(
    '20 blocks',
    () => {
      getMountedEditor({ content: SMALL })
        .getEditor()
        .commands.insertContent('a');
    },
    { iterations: 200, time: 500 }
  );

  bench(
    '200 blocks',
    () => {
      getMountedEditor({ content: LARGE })
        .getEditor()
        .commands.insertContent('a');
    },
    { iterations: 200, time: 500 }
  );

  bench(
    '200 blocks with chrome',
    () => {
      getMountedEditor({ content: LARGE, chrome: true })
        .getEditor()
        .commands.insertContent('a');
    },
    { iterations: 200, time: 500 }
  );
});

describe('serialization', () => {
  bench('getJSON 200 blocks', () => {
    getMountedEditor({ content: LARGE }).getJSON();
  });

  bench('getJSON + stringify 200 blocks', () => {
    JSON.stringify(getMountedEditor({ content: LARGE }).getJSON());
  });
});

const caretPositions = new Map<Editor.Root.Handle, number[]>();

function getCaretPositions(handle: Editor.Root.Handle) {
  const cached = caretPositions.get(handle);

  if (cached) {
    return cached;
  }

  const positions: number[] = [];

  handle.getEditor().state.doc.descendants((node, position) => {
    if (node.isTextblock && node.content.size > 2) {
      positions.push(position + 1);
    }
  });

  caretPositions.set(handle, positions);

  return positions;
}

describe('selection', () => {
  bench(
    'move caret in 200 blocks',
    () => {
      const handle = getMountedEditor({ content: LARGE });
      const positions = getCaretPositions(handle);

      handle
        .getEditor()
        .commands.setTextSelection(
          positions[Math.floor(Math.random() * positions.length)]!
        );
    },
    { iterations: 200, time: 500 }
  );

  bench(
    'move caret in 200 blocks with chrome',
    () => {
      const handle = getMountedEditor({ content: LARGE, chrome: true });
      const positions = getCaretPositions(handle);

      handle
        .getEditor()
        .commands.setTextSelection(
          positions[Math.floor(Math.random() * positions.length)]!
        );
    },
    { iterations: 200, time: 500 }
  );
});
