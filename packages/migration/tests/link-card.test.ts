import { describe, expect, it } from 'vite-plus/test';

import { migrate } from '../src/index';

function getMigratedLinkCard(attrs: Record<string, any>) {
  const { json, warnings } = migrate({
    type: 'doc',
    content: [{ type: 'linkCard', attrs }],
  });

  return { node: json.content[0], warnings };
}

describe('linkCard', () => {
  it('drops the mailyComponent marker with a warning', () => {
    const { node, warnings } = getMigratedLinkCard({
      mailyComponent: 'linkCard',
      title: 'Maily',
      link: 'https://maily.to',
    });

    expect(node.attrs).not.toHaveProperty('mailyComponent');
    expect(node.attrs.title).toBe('Maily');
    expect(node.attrs.link).toBe('https://maily.to');
    expect(warnings).toEqual([
      {
        nodeType: 'linkCard',
        field: 'mailyComponent',
        message:
          'v1 marker attribute "mailyComponent" is not needed in v2 and was dropped',
      },
    ]);
  });

  it('leaves a link card without the marker untouched', () => {
    const attrs = {
      title: 'Maily',
      description: 'Email editor',
      link: 'https://maily.to',
      linkTitle: 'Open',
      image: '',
      subTitle: '',
      badgeText: '',
    };
    const { node, warnings } = getMigratedLinkCard(attrs);

    expect(node.attrs).toEqual(attrs);
    expect(warnings).toEqual([]);
  });
});
