import { migrate } from '@maily-to/migration';
import type { AnyMailyNode, DocumentNode } from '@maily-to/shared';
import { bench, describe } from 'vite-plus/test';

import defaultEditorFixture from '../../migration/tests/fixtures/default-editor.json';
import kitchenSinkFixture from '../../migration/tests/fixtures/kitchen-sink.json';
import { markup, render, renderText } from '../src/index';

type ScaleOptions = {
  document: DocumentNode;
  times: number;
};

type FilterOptions = {
  document: DocumentNode;
  type: string;
};

function getMigrated(fixture: unknown) {
  return migrate(fixture as Record<string, any>).json as DocumentNode;
}

function getScaledDocument(options: ScaleOptions) {
  const { document, times } = options;
  const blocks = document.content ?? [];
  const repeated: AnyMailyNode[] = [];

  for (let index = 0; index < times; index += 1) {
    repeated.push(...structuredClone(blocks));
  }

  return { ...document, content: repeated } as DocumentNode;
}

function getDocumentWithout(options: FilterOptions) {
  const { document, type } = options;

  return {
    ...document,
    content: (document.content ?? []).filter((node) => {
      return node.type !== type;
    }),
  } as DocumentNode;
}

const simple = getMigrated(defaultEditorFixture);
const kitchenSink = getMigrated(kitchenSinkFixture);
const withoutHtmlBlock = getDocumentWithout({
  document: kitchenSink,
  type: 'htmlCodeBlock',
});
const large = getScaledDocument({ document: kitchenSink, times: 20 });

describe('markup', () => {
  bench('default editor document', () => {
    void markup(simple);
  });

  bench('kitchen sink document', () => {
    void markup(kitchenSink);
  });

  bench('kitchen sink without html code block', () => {
    void markup(withoutHtmlBlock);
  });

  bench('kitchen sink x20', () => {
    void markup(large);
  });
});

describe('render', () => {
  bench('default editor document', async () => {
    await render(simple);
  });

  bench('kitchen sink document', async () => {
    await render(kitchenSink);
  });

  bench('kitchen sink without html code block', async () => {
    await render(withoutHtmlBlock);
  });

  bench('kitchen sink x20', async () => {
    await render(large);
  });
});

describe('renderText', () => {
  bench('kitchen sink document', async () => {
    await renderText(kitchenSink);
  });
});
