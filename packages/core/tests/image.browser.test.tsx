import { render as renderMaily } from '@maily-to/render';
import type { DocumentNode } from '@maily-to/shared';
import { render as renderReact, waitFor } from '@testing-library/react';
import type { AnyExtension } from '@tiptap/core';
import { createRef, useState } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import type { RenderEditorResult } from '#test-utils';
import {
  createRenderer,
  EMPTY_DOCUMENT,
  getContainerContent,
} from '#test-utils';
import { ImageUploadExtension } from '~/extensions';
import { uploadImageFile } from '~/extensions/image-upload/upload-image-file';
import { Editor } from '~/index';

function getContainerStartPosition(handle: Editor.Root.Handle) {
  const { doc } = handle.getEditor().state;
  let position: number | null = null;

  doc.descendants((node, pos) => {
    if (position !== null) {
      return false;
    }

    if (node.type.name === 'container') {
      position = pos + 1;
    }

    return true;
  });

  return position ?? 0;
}

function getImageSources(handle: Editor.Root.Handle) {
  return getContainerContent(handle)
    .filter((node) => {
      return node.type === 'image';
    })
    .map((node) => {
      return node.attrs?.src;
    });
}

function getImageFile() {
  return new File(['image-bytes'], 'cat.png', { type: 'image/png' });
}

function getDeferredUpload() {
  let resolveUpload: (url: string) => void = () => {
    return undefined;
  };
  const uploaded = new Promise<string>((resolve) => {
    resolveUpload = resolve;
  });

  return { resolve: resolveUpload, uploaded };
}

type RenderControlledEditorOptions = { extensions: AnyExtension[] };

async function renderControlledEditor(options: RenderControlledEditorOptions) {
  const { extensions } = options;
  const ref = createRef<Editor.Root.Handle>();

  function ControlledEditor() {
    const [document, setDocument] = useState<DocumentNode>(EMPTY_DOCUMENT);

    return (
      <Editor.Root
        content={document}
        extensions={extensions}
        onCreate={(event) => {
          return setDocument(event.editor.getJSON() as DocumentNode);
        }}
        onUpdate={(event) => {
          return setDocument(event.editor.getJSON() as DocumentNode);
        }}
        ref={ref}
      >
        <Editor.Content />
      </Editor.Root>
    );
  }

  const view = renderReact(<ControlledEditor />);

  await waitFor(() => {
    expect(ref.current).not.toBeNull();
  });

  return { ref, view };
}

type MountedEditor = Pick<RenderEditorResult, 'ref' | 'view'>;

type UploadCase = {
  mount: (options: RenderControlledEditorOptions) => Promise<MountedEditor>;
  name: string;
  start: (options: MountedEditor) => Promise<void>;
  url: string;
};

function findImageInput(container: HTMLElement) {
  return waitFor(() => {
    const found = container.querySelector<HTMLInputElement>(
      '[data-mly-image-input]'
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

function selectImageFile(input: HTMLInputElement) {
  const transfer = new DataTransfer();
  transfer.items.add(getImageFile());
  input.files = transfer.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

async function startCommandUpload(options: MountedEditor) {
  const { ref } = options;

  uploadImageFile(
    ref.current!.getEditor(),
    getImageFile(),
    getContainerStartPosition(ref.current!)
  );
}

async function startPlaceholderUpload(options: MountedEditor) {
  const { ref, view } = options;

  ref.current?.getEditor().chain().focus().setImage({ src: '' }).run();

  selectImageFile(await findImageInput(view.container));
}

describe('<ImageExtension />', () => {
  const { render } = createRenderer();

  it('inserts an image by URL and exports it', async () => {
    const { ref } = await render();

    ref.current
      ?.getEditor()
      .chain()
      .focus()
      .setImage({ alt: 'A cat', src: 'https://maily.to/cat.png' })
      .run();

    const json = ref.current!.getJSON();
    const image = getContainerContent(ref.current!).at(-1);

    expect({
      align: image?.attrs?.align,
      alt: image?.attrs?.alt,
      src: image?.attrs?.src,
      type: image?.type,
      width: image?.attrs?.width,
    }).toEqual({
      align: 'left',
      alt: 'A cat',
      src: 'https://maily.to/cat.png',
      type: 'image',
      width: '100%',
    });

    const exported = new DOMParser()
      .parseFromString(await renderMaily(json), 'text/html')
      .querySelector('img');

    expect({
      alt: exported?.getAttribute('alt'),
      src: exported?.getAttribute('src'),
      width: exported?.getAttribute('width'),
    }).toEqual({ alt: 'A cat', src: 'https://maily.to/cat.png', width: '600' });
  });

  it('wraps an image in its external link', async () => {
    const { ref } = await render();

    ref.current
      ?.getEditor()
      .chain()
      .focus()
      .setImage({ src: 'https://maily.to/cat.png' })
      .run();

    ref.current?.getEditor().commands.updateAttributes('image', {
      externalLink: 'https://maily.to',
    });

    const exported = new DOMParser().parseFromString(
      await renderMaily(ref.current!.getJSON()),
      'text/html'
    );

    expect(exported.querySelector('a')?.getAttribute('href')).toBe(
      'https://maily.to'
    );
  });

  describe('html import', () => {
    const SOCIAL_ROW =
      '<td style="text-align:center">' +
      '<a href="https://x.test/" style="padding-left:8px;padding-right:8px">' +
      '<img alt="X" width="18" src="https://maily.to/x.png" ' +
      'style="display:block" /></a>' +
      '<a href="https://in.test/" style="padding-left:8px;padding-right:8px">' +
      '<img alt="LinkedIn" width="18" src="https://maily.to/in.png" ' +
      'style="display:block" /></a>' +
      '</td>';

    it('keeps linked images in one inline row', async () => {
      const { ref } = await render({ content: SOCIAL_ROW });
      const row = getContainerContent(ref.current!).at(-1);

      expect({
        row: row?.type,
        children: row?.content?.map((child) => {
          return child.type;
        }),
        links: row?.content?.map((child) => {
          return child.attrs?.externalLink;
        }),
        styles: row?.content?.map((child) => {
          return child.attrs?.style;
        }),
      }).toEqual({
        row: 'paragraph',
        children: ['inlineImage', 'inlineImage'],
        links: ['https://x.test/', 'https://in.test/'],
        styles: [
          'width:18px;margin-left:8px;margin-right:8px',
          'width:18px;margin-left:8px;margin-right:8px',
        ],
      });
    });

    it('keeps an image in a block cell as a block image', async () => {
      const { ref } = await render({
        content: '<td><img src="https://maily.to/hero.png" width="600" /></td>',
      });

      expect(getContainerContent(ref.current!).at(-1)?.type).toBe('image');
    });
  });

  describe('width', () => {
    it('resolves a percentage width against the box it sits in', async () => {
      const { ref } = await render();

      ref.current
        ?.getEditor()
        .chain()
        .focus()
        .setImage({ src: 'https://maily.to/cat.png' })
        .run();

      ref.current
        ?.getEditor()
        .commands.updateAttributes('image', { width: '50%' });

      const exported = new DOMParser()
        .parseFromString(await renderMaily(ref.current!.getJSON()), 'text/html')
        .querySelector('img');

      expect(exported?.getAttribute('width')).toBe('300');
    });

    it('commits a new width when a drag handle is released', async () => {
      const { ref, view } = await render();

      ref.current
        ?.getEditor()
        .chain()
        .focus()
        .setImage({ src: 'https://maily.to/cat.png' })
        .run();

      const wrapper = await waitFor(() => {
        const found = view.container.querySelector('[data-mly-image-view]');
        expect(found).not.toBeNull();
        return found!;
      });

      await userEvent.hover(wrapper);

      const handle = await waitFor(() => {
        const found = view.container.querySelector<HTMLElement>(
          '[data-mly-image-handle][data-side="right"]'
        );
        expect(found).not.toBeNull();
        return found!;
      });

      const box = handle.getBoundingClientRect();
      handle.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          clientX: box.left,
          pointerId: 1,
        })
      );
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          clientX: box.left - 200,
          pointerId: 1,
        })
      );
      window.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, pointerId: 1 })
      );

      await waitFor(() => {
        const width = getContainerContent(ref.current!).at(-1)?.attrs?.width;
        expect(width).not.toBe('100%');
      });
    });

    it('shrinks the drag handles on a narrow image', async () => {
      const { ref, view } = await render({ styled: true });

      ref.current
        ?.getEditor()
        .chain()
        .focus()
        .setImage({ src: 'https://maily.to/cat.png' })
        .run();

      const wrapper = await waitFor(() => {
        const found = view.container.querySelector('[data-mly-image-view]');
        expect(found).not.toBeNull();
        return found!;
      });

      await userEvent.hover(wrapper);

      const getHandleWidth = () => {
        const found = view.container.querySelector(
          '[data-mly-image-handle][data-side="right"]'
        );
        expect(found).not.toBeNull();
        return found!.getBoundingClientRect().width;
      };

      await waitFor(() => {
        expect(getHandleWidth()).toBe(8);
      });

      ref.current
        ?.getEditor()
        .commands.updateAttributes('image', { width: '20%' });

      await waitFor(() => {
        expect(getHandleWidth()).toBe(6);
      });
    });
  });

  describe('states', () => {
    it('shows a placeholder until an image is uploaded', async () => {
      const { ref, view } = await render();

      ref.current?.getEditor().chain().focus().setImage({ src: '' }).run();

      await waitFor(() => {
        expect(
          view.container.querySelector(
            '[data-mly-image-state][data-state="placeholder"]'
          )
        ).not.toBeNull();
      });
    });

    it('shows the variable state for a templated source', async () => {
      const { ref, view } = await render();

      ref.current
        ?.getEditor()
        .chain()
        .focus()
        .setImage({ src: '{{avatarUrl}}' })
        .run();

      await waitFor(() => {
        expect(
          view.container.querySelector(
            '[data-mly-image-state][data-state="variable"]'
          )
        ).not.toBeNull();
      });
    });
  });

  describe('upload', () => {
    const UPLOAD_CASES: UploadCase[] = [
      {
        mount: render,
        name: 'replaces the blob source once the upload resolves',
        start: startCommandUpload,
        url: 'https://maily.to/uploaded.png',
      },
      {
        mount: renderControlledEditor,
        name: 'keeps the uploaded url when the document is controlled',
        start: startCommandUpload,
        url: 'https://maily.to/controlled.png',
      },
      {
        mount: render,
        name: 'replaces the placeholder blob url with the uploaded url',
        start: startPlaceholderUpload,
        url: 'https://maily.to/placeholder.png',
      },
      {
        mount: renderControlledEditor,
        name: 'replaces the placeholder blob url while the document is controlled',
        start: startPlaceholderUpload,
        url: 'https://maily.to/controlled-placeholder.png',
      },
    ];

    for (const testCase of UPLOAD_CASES) {
      it(testCase.name, async () => {
        const { resolve, uploaded } = getDeferredUpload();

        const { ref, view } = await testCase.mount({
          extensions: [
            ImageUploadExtension.configure({
              onImageUpload: () => {
                return uploaded;
              },
            }),
          ],
        });

        await testCase.start({ ref, view });

        await waitFor(() => {
          expect(
            view.container.querySelector('[data-mly-image-loading]')
          ).not.toBeNull();
        });

        resolve(testCase.url);

        await waitFor(() => {
          expect(getImageSources(ref.current!)).toEqual([testCase.url]);
        });
      });
    }

    it('announces a failed upload and reports it through the error state', async () => {
      const errors: unknown[] = [];

      const { ref, view } = await render({
        extensions: [
          ImageUploadExtension.configure({
            onImageUpload: () => {
              return Promise.reject(new Error('upload failed'));
            },
            onImageUploadError: (error) => {
              return errors.push(error);
            },
          }),
        ],
      });

      uploadImageFile(
        ref.current!.getEditor(),
        getImageFile(),
        getContainerStartPosition(ref.current!)
      );

      await waitFor(() => {
        const status = view.container.querySelector('[role="status"]');
        expect(status?.textContent).toBe('Uploading image');
      });

      await waitFor(() => {
        const alert = view.container.querySelector('[role="alert"]');
        expect(alert?.textContent).toBe('Failed to upload image');
      });

      await waitFor(() => {
        expect(
          view.container.querySelector(
            '[data-mly-image-state][data-state="error"]'
          )
        ).not.toBeNull();
      });

      expect((errors[0] as Error).message).toBe('upload failed');
    });
  });
});
