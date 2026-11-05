import type { DocumentNode, VisibilityRule } from '@maily-to/shared';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vite-plus/test';

import type { MailyConfig } from '../src/index';
import { render } from '../src/index';

function documentWith(content: DocumentNode['content']): DocumentNode {
  return { type: 'doc', attrs: { version: 2 }, content };
}

function paragraph(text: string, visibilityRule?: VisibilityRule) {
  return {
    type: 'paragraph' as const,
    attrs: { visibilityRule },
    content: [{ type: 'text' as const, text }],
  };
}

async function getTexts(document: DocumentNode, config?: MailyConfig) {
  const html = await render(document, config);

  return parse(html)
    .querySelectorAll('p')
    .map((element) => element.text.trim());
}

describe('visibility', () => {
  describe('rule actions', () => {
    it('renders a node that carries no rule', async () => {
      expect(await getTexts(documentWith([paragraph('Always')]))).toEqual([
        'Always',
      ]);
    });

    it('shows a node when its show rule matches', async () => {
      const document = documentWith([
        paragraph('Subscriber', {
          action: 'show',
          operator: 'is_true',
          value: '',
          variable: '{{isSubscribed}}',
        }),
      ]);

      expect(
        await getTexts(document, { variables: { isSubscribed: true } })
      ).toEqual(['Subscriber']);
      expect(
        await getTexts(document, { variables: { isSubscribed: false } })
      ).toEqual([]);
    });

    it('hides a node when its hide rule matches', async () => {
      const document = documentWith([
        paragraph('Upgrade', {
          action: 'hide',
          operator: 'is_true',
          value: '',
          variable: '{{isPro}}',
        }),
      ]);

      expect(await getTexts(document, { variables: { isPro: true } })).toEqual(
        []
      );
      expect(await getTexts(document, { variables: { isPro: false } })).toEqual(
        ['Upgrade']
      );
    });
  });

  describe('operators', () => {
    it('compares the resolved value against the rule value', async () => {
      const document = documentWith([
        paragraph('Pro', {
          action: 'show',
          operator: 'equals',
          value: 'pro',
          variable: '{{plan}}',
        }),
      ]);

      expect(await getTexts(document, { variables: { plan: 'pro' } })).toEqual([
        'Pro',
      ]);
      expect(await getTexts(document, { variables: { plan: 'free' } })).toEqual(
        []
      );
    });

    it('compares numbers with the ordering operators', async () => {
      const document = documentWith([
        paragraph('Bulk', {
          action: 'show',
          operator: 'greater_than',
          value: '10',
          variable: '{{seats}}',
        }),
      ]);

      expect(await getTexts(document, { variables: { seats: 25 } })).toEqual([
        'Bulk',
      ]);
      expect(await getTexts(document, { variables: { seats: 4 } })).toEqual([]);
    });
  });

  describe('the rule variable', () => {
    it('reads the variable through the id the rule names without braces', async () => {
      const document = documentWith([
        paragraph('Subscriber', {
          action: 'show',
          operator: 'is_true',
          value: '',
          variable: 'isSubscribed',
        }),
      ]);

      expect(
        await getTexts(document, { variables: { isSubscribed: true } })
      ).toEqual(['Subscriber']);
    });

    it('hides a node when the rule names nothing', async () => {
      const document = documentWith([
        paragraph('Orphan', {
          action: 'show',
          operator: 'is_true',
          value: '',
          variable: '',
        }),
      ]);

      expect(await getTexts(document)).toEqual([]);
    });

    it('evaluates a rule against the current repeat item', async () => {
      const document = documentWith([
        {
          type: 'repeat',
          attrs: { each: '{{items}}' },
          content: [
            paragraph('Item', {
              action: 'show',
              operator: 'is_true',
              value: '',
              variable: '{{active}}',
            }),
          ],
        },
      ]);

      expect(
        await getTexts(document, {
          variables: { items: [{ active: true }, { active: false }] },
        })
      ).toEqual(['Item']);
    });
  });

  it('hides every node type the rule can sit on', async () => {
    const rule: VisibilityRule = {
      action: 'hide',
      operator: 'is_true',
      value: '',
      variable: '{{hide}}',
    };

    const html = await render(
      documentWith([
        {
          type: 'heading',
          attrs: { level: 1, visibilityRule: rule },
          content: [{ type: 'text', text: 'Title' }],
        },
        { type: 'spacer', attrs: { height: 32, visibilityRule: rule } },
        {
          type: 'image',
          attrs: {
            align: 'center',
            src: 'https://maily.to/logo.png',
            visibilityRule: rule,
            width: '100%',
          },
        },
        { type: 'horizontalRule', attrs: { visibilityRule: rule } },
        {
          type: 'button',
          attrs: {
            align: 'center',
            kind: 'tight',
            url: 'https://maily.to',
            visibilityRule: rule,
          },
          content: [{ type: 'text', text: 'Open' }],
        },
      ]),
      { variables: { hide: true } }
    );

    const root = parse(html);

    expect(root.querySelectorAll('h1')).toHaveLength(0);
    expect(root.querySelectorAll('[style*="height:32px"]')).toHaveLength(0);
    expect(root.querySelectorAll('img')).toHaveLength(0);
    expect(root.querySelectorAll('hr')).toHaveLength(0);
    expect(root.querySelectorAll('a')).toHaveLength(0);
  });
});
