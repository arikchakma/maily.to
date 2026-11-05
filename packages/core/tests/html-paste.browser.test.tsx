import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';

const SOURCE =
  '<h2 style="color:#111827">Title</h2><p><b>Bold</b> and plain</p>';

const EMAIL = `<!DOCTYPE html>
<html>
  <head>
    <style>
      .lead { color: rgb(17, 24, 39); }
    </style>
  </head>
  <body style="background-color:rgb(250,250,250)">
    <table role="presentation" style="max-width:600px">
      <tbody>
        <tr>
          <td>
            <h1>Heading</h1>
            <p class="lead">Lead paragraph</p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;

function getIdlessJson(handle: Parameters<typeof getContainerContent>[0]) {
  return JSON.stringify(handle.getJSON()).replace(/"id":"[^"]*"/g, '"id":""');
}

type PasteOptions = {
  editable: HTMLElement;
  html?: string;
  text: string;
};

function paste(options: PasteOptions) {
  const { editable, html, text } = options;
  const clipboardData = new DataTransfer();

  clipboardData.setData('text/plain', text);
  if (html) {
    clipboardData.setData('text/html', html);
  }

  const event = new ClipboardEvent('paste', {
    bubbles: true,
    cancelable: true,
  });

  // Firefox ignores clipboardData passed to the constructor.
  Object.defineProperty(event, 'clipboardData', { value: clipboardData });

  editable.dispatchEvent(event);
}

describe('html paste', () => {
  const { render } = createRenderer();

  const mountEditor = async () => {
    return render({
      caret: 'end',
      content: getDocument([{ type: 'paragraph' }]),
    });
  };

  const getTypes = (handle: Parameters<typeof getContainerContent>[0]) => {
    return getContainerContent(handle).map((node) => {
      return node.type;
    });
  };

  it('converts markup carried as html into canonical nodes', async () => {
    const { editable, ref } = await mountEditor();

    paste({ editable, html: SOURCE, text: 'Title\nBold and plain' });

    await waitFor(() => {
      expect(getTypes(ref.current!)).toEqual(['heading', 'paragraph']);
    });
  });

  it('converts markup pasted as text into canonical nodes', async () => {
    const { editable, ref } = await mountEditor();

    paste({ editable, text: SOURCE });

    await waitFor(() => {
      expect(getTypes(ref.current!)).toEqual(['heading', 'paragraph']);
    });
  });

  it('keeps the markup as text when the paste is forced to plain', async () => {
    const { editable, ref } = await mountEditor();

    await userEvent.keyboard('{Shift>}');
    paste({ editable, text: SOURCE });
    await userEvent.keyboard('{/Shift}');

    await waitFor(() => {
      expect(ref.current!.getText()).toContain('<h2 style="color:#111827">');
    });
  });

  it('leaves the markup behind as text when the paste is undone', async () => {
    const { editable, ref } = await mountEditor();

    paste({ editable, text: SOURCE });

    await waitFor(() => {
      expect(getTypes(ref.current!)).toEqual(['heading', 'paragraph']);
    });

    ref.current!.getEditor().commands.undo();

    await waitFor(() => {
      expect({
        text: ref.current!.getText(),
        types: getTypes(ref.current!),
      }).toEqual({ text: SOURCE, types: ['paragraph'] });
    });
  });

  it('imports a pasted email exactly as the content prop does', async () => {
    const { ref: viaContent } = await render({ content: EMAIL });
    const { editable, ref: viaPaste } = await mountEditor();

    paste({ editable, text: EMAIL });

    await waitFor(() => {
      expect(getIdlessJson(viaPaste.current!)).toBe(
        getIdlessJson(viaContent.current!)
      );
    });
  });

  it('leaves text that only looks like markup alone', async () => {
    const { editable, ref } = await mountEditor();

    paste({ editable, text: '3 < 5 and 7 > 2' });

    await waitFor(() => {
      expect({
        text: ref.current!.getText(),
        types: getTypes(ref.current!),
      }).toEqual({ text: '3 < 5 and 7 > 2', types: ['paragraph'] });
    });
  });

  it('keeps the markup as text inside an html code block', async () => {
    const { editable, ref } = await mountEditor();

    ref.current!.getEditor().commands.setHtmlCodeBlock();
    paste({ editable, text: SOURCE });

    await waitFor(() => {
      const [block] = getContainerContent(ref.current!);

      expect({
        text: block?.content?.[0]?.text,
        type: block?.type,
      }).toEqual({ text: SOURCE, type: 'htmlCodeBlock' });
    });
  });
});
