import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';
import { VariableBubbleMenu } from '~/index';
import type { Editor } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [
      { type: 'text', text: 'Hello ' },
      {
        type: 'variable',
        attrs: { fallback: 'there', id: 'firstName' },
      },
    ],
  },
]);

function selectVariable(handle: Editor.Root.Handle) {
  const editor = handle.getEditor();
  let position: number | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'variable') {
      position = pos;
    }
  });

  editor.chain().focus().setNodeSelection(position!).run();
}

async function findField(label: string) {
  return waitFor(() => {
    const found = [
      ...document.querySelectorAll<HTMLLabelElement>('[data-mly-field-label]'),
    ].find((element) => {
      return element.textContent === label;
    });
    expect(found).not.toBeUndefined();

    const input = document.getElementById(
      found!.htmlFor
    ) as HTMLInputElement | null;
    expect(input).not.toBeNull();
    return input!;
  });
}

function getVariable(handle: Editor.Root.Handle) {
  return getContainerContent(handle)
    .at(0)
    ?.content?.find((node) => {
      return node.type === 'variable';
    });
}

describe('<VariableBubbleMenu />', () => {
  const { render } = createRenderer();

  it('opens with the variable fields once the variable is selected', async () => {
    const { ref } = await render({
      children: <VariableBubbleMenu />,
      content: DOCUMENT,
    });

    selectVariable(ref.current!);

    expect((await findField('Variable')).value).toBe('firstName');
    expect((await findField('Default')).value).toBe('there');
  });

  it('returns focus to the editor when escape closes the menu', async () => {
    const { ref } = await render({
      children: <VariableBubbleMenu />,
      content: DOCUMENT,
    });

    selectVariable(ref.current!);

    const field = await findField('Variable');
    await userEvent.click(field);

    expect(document.activeElement).toBe(field);

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(document.querySelector('[data-mly-bubble-menu]')).toBeNull();
    });

    await waitFor(() => {
      expect(document.activeElement).toBe(
        document.querySelector('[contenteditable="true"]')
      );
    });
  });

  describe('editing the fields', () => {
    it('renames the variable on blur', async () => {
      const { ref } = await render({
        children: <VariableBubbleMenu />,
        content: DOCUMENT,
      });

      selectVariable(ref.current!);

      const field = await findField('Variable');

      await userEvent.tripleClick(field);
      await userEvent.keyboard('lastName');
      await userEvent.click(await findField('Default'));

      await waitFor(() => {
        expect(getVariable(ref.current!)?.attrs?.id).toBe('lastName');
      });
    });

    it('writes the default value', async () => {
      const { ref } = await render({
        children: <VariableBubbleMenu />,
        content: DOCUMENT,
      });

      selectVariable(ref.current!);

      const field = await findField('Default');

      await userEvent.tripleClick(field);
      await userEvent.keyboard('friend');
      await userEvent.click(await findField('Variable'));

      await waitFor(() => {
        expect(getVariable(ref.current!)?.attrs?.fallback).toBe('friend');
      });
    });
  });
});
