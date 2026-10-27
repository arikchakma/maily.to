import { render as renderMaily } from '@maily-to/render';
import { BASIC_NODE_THEME } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { createRenderer, getContainerContent } from '#test-utils';
import {
  clearLine,
  footerCommunityFeedbackCta,
  footerCompanySignature,
  footerCopyrightText,
  hardBreak,
  headerLogoWithCoverImage,
  headerLogoWithTextHorizontal,
  headerLogoWithTextVertical,
} from '~/blocks';
import type { SlashCommandItem } from '~/utils/slash-command';

type GetExportedNodeOptions = {
  html: string;
  selector: string;
};

function getExportedNode(options: GetExportedNodeOptions) {
  const { html, selector } = options;

  return new DOMParser()
    .parseFromString(html, 'text/html')
    .querySelector<HTMLElement>(selector);
}

describe('blocks', () => {
  const { render } = createRenderer();

  async function getInsertedContent(block: SlashCommandItem) {
    const { ref } = await render();
    const editor = ref.current!.getEditor();

    block.command?.({ editor, range: { from: 1, to: 1 } });

    return getContainerContent(ref.current!);
  }

  describe('headers', () => {
    it('stacks the vertical header logo, a spacer and a heading', async () => {
      const content = await getInsertedContent(headerLogoWithTextVertical);
      const [logo, spacer, heading] = content;

      expect({
        heading: {
          level: heading?.attrs?.level,
          style: heading?.attrs?.style,
          text: heading?.content?.[0]?.text,
          type: heading?.type,
        },
        logo: {
          align: logo?.attrs?.align,
          style: logo?.attrs?.style,
          type: logo?.type,
          width: logo?.attrs?.width,
        },
        spacer: { height: spacer?.attrs?.height, type: spacer?.type },
      }).toEqual({
        heading: {
          level: 2,
          style: 'text-align:center',
          text: 'Maily',
          type: 'heading',
        },
        logo: {
          align: 'center',
          style: 'height:48px',
          type: 'image',
          width: '48px',
        },
        spacer: { height: 8, type: 'spacer' },
      });
    });

    it('lays the horizontal header out as two vertically aligned columns', async () => {
      const content = await getInsertedContent(headerLogoWithTextHorizontal);
      const columns = content[0];
      const [logoColumn, headingColumn] = columns?.content ?? [];

      expect({
        columnCount: columns?.attrs?.columnCount,
        heading: {
          level: headingColumn?.content?.[0]?.attrs?.level,
          style: headingColumn?.content?.[0]?.attrs?.style,
          verticalAlign: headingColumn?.attrs?.verticalAlign,
          width: headingColumn?.attrs?.width,
        },
        logo: {
          style: logoColumn?.content?.[0]?.attrs?.style,
          verticalAlign: logoColumn?.attrs?.verticalAlign,
          width: logoColumn?.content?.[0]?.attrs?.width,
        },
        type: columns?.type,
      }).toEqual({
        columnCount: 2,
        heading: {
          level: 3,
          style: 'text-align:right',
          verticalAlign: 'bottom',
          width: null,
        },
        logo: { style: 'height:32px', verticalAlign: 'middle', width: '32px' },
        type: 'columns',
      });
    });

    it('puts a cover image above a dated header row', async () => {
      const content = await getInsertedContent(headerLogoWithCoverImage);
      const [cover, columns] = content;
      const paragraph = columns?.content?.[1]?.content?.[0];

      expect({
        cover: {
          style: cover?.attrs?.style,
          type: cover?.type,
          width: cover?.attrs?.width,
        },
        date: paragraph?.content?.[2]?.marks,
        paragraph: {
          style: paragraph?.attrs?.style,
          types: paragraph?.content?.map((node) => {
            return node.type;
          }),
        },
        title: paragraph?.content?.[0]?.marks?.map((mark) => {
          return mark.type;
        }),
      }).toEqual({
        cover: { style: 'height:314px', type: 'image', width: '600px' },
        date: [{ type: 'textStyle', attrs: { color: '#929292' } }],
        paragraph: {
          style: 'text-align:right',
          types: ['text', 'hardBreak', 'text'],
        },
        title: ['bold'],
      });
    });

    it('exports the header logo at the height its style authors', async () => {
      const { ref } = await render();
      const editor = ref.current!.getEditor();

      headerLogoWithTextVertical.command?.({
        editor,
        range: { from: 1, to: 1 },
      });

      const exported = getExportedNode({
        html: await renderMaily(ref.current!.getJSON()),
        selector: 'img',
      });

      expect({
        height: exported?.style.height,
        src: exported?.getAttribute('src'),
      }).toEqual({ height: '48px', src: 'https://maily.to/brand/logo.png' });
    });
  });

  describe('footers', () => {
    it('turns a paragraph into a footer without authoring a style', async () => {
      const { ref } = await render();

      ref.current
        ?.getEditor()
        .chain()
        .focus()
        .insertContent('Unsubscribe')
        .run();
      ref.current?.getEditor().commands.setFooter();

      const footer = getContainerContent(ref.current!).at(-1);

      expect({
        style: footer?.attrs?.style,
        type: footer?.type,
      }).toEqual({
        style: null,
        type: 'footer',
      });

      const json = ref.current!.getJSON();
      const exported = getExportedNode({
        html: await renderMaily(json, { theme: BASIC_NODE_THEME }),
        selector: 'small',
      });

      expect({
        color: exported?.style.color,
        text: exported?.textContent,
      }).toEqual({ color: 'rgb(100, 116, 139)', text: 'Unsubscribe' });
    });

    it('centres the copyright footer and greys its text', async () => {
      const content = await getInsertedContent(footerCopyrightText);
      const [paragraph] = content;

      expect({
        marks: paragraph?.content?.[0]?.marks,
        style: paragraph?.attrs?.style,
        text: paragraph?.content?.[0]?.text,
        type: paragraph?.type,
      }).toEqual({
        marks: [{ type: 'textStyle', attrs: { color: '#AAAAAA' } }],
        style: 'text-align:center',
        text: `Maily © ${new Date().getFullYear()}. All rights reserved.`,
        type: 'paragraph',
      });
    });

    it('inserts the community feedback footer as a small broken line', async () => {
      const content = await getInsertedContent(footerCommunityFeedbackCta);
      const [logo, spacer, footer] = content;

      expect({
        logo: { type: logo?.type, width: logo?.attrs?.width },
        spacer: { height: spacer?.attrs?.height, type: spacer?.type },
        footer: {
          style: footer?.attrs?.style,
          type: footer?.type,
          types: footer?.content?.map((node) => {
            return node.type;
          }),
        },
      }).toEqual({
        logo: { type: 'image', width: '8%' },
        spacer: { height: 16, type: 'spacer' },
        footer: {
          style: null,
          type: 'footer',
          types: ['text', 'hardBreak', 'text'],
        },
      });
    });

    it('signs the footer off with underlined links and social icons', async () => {
      const content = await getInsertedContent(footerCompanySignature);
      const footer = content.find((node) => {
        return node.type === 'footer';
      });
      const socials = content.at(-1);

      expect({
        footerStyle: footer?.attrs?.style,
        icons: socials?.content
          ?.filter((node) => {
            return node.type === 'inlineImage';
          })
          .map((node) => {
            return {
              externalLink: node.attrs?.externalLink,
              height: node.attrs?.height,
              width: node.attrs?.width,
            };
          }),
        link: footer?.content?.[2]?.marks,
        logoAlign: content[1]?.attrs?.align,
        types: content.map((node) => {
          return node.type;
        }),
      }).toEqual({
        footerStyle: 'text-align:center',
        icons: [
          {
            externalLink: 'https://www.linkedin.com/in/arikchakma/',
            height: 20,
            width: 20,
          },
          {
            externalLink: 'https://www.youtube.com/arikchakma',
            height: 20,
            width: 20,
          },
          { externalLink: 'https://x.com/imarikchakma', height: 20, width: 20 },
        ],
        link: [
          {
            type: 'link',
            attrs: {
              class: null,
              href: 'https://maily.to',
              rel: 'noopener noreferrer nofollow',
              style: null,
              target: '_blank',
              title: null,
            },
          },
          { type: 'textStyle', attrs: { color: '#64748b' } },
          { type: 'underline', attrs: { style: null } },
        ],
        logoAlign: 'center',
        types: [
          'horizontalRule',
          'image',
          'spacer',
          'heading',
          'spacer',
          'footer',
          'paragraph',
        ],
      });
    });
  });

  describe('inline images', () => {
    it('inserts an inline image and exports it at its size', async () => {
      const { ref } = await render();

      ref.current
        ?.getEditor()
        .chain()
        .focus()
        .setInlineImage({ alt: 'Star', src: 'https://maily.to/star.png' })
        .run();

      const exported = getExportedNode({
        html: await renderMaily(ref.current!.getJSON()),
        selector: 'img',
      });

      expect({
        alt: exported?.getAttribute('alt'),
        display: exported?.style.display,
        height: exported?.getAttribute('height'),
        width: exported?.getAttribute('width'),
      }).toEqual({ alt: 'Star', display: 'inline', height: '20', width: '20' });
    });

    it('resolves a variable in an inline image source', async () => {
      const { ref } = await render();

      ref.current
        ?.getEditor()
        .chain()
        .focus()
        .setInlineImage({ src: '{{badgeUrl}}' })
        .run();

      const html = await renderMaily(ref.current!.getJSON(), {
        variables: { badgeUrl: 'https://maily.to/badge.png' },
      });

      expect(
        getExportedNode({ html, selector: 'img' })?.getAttribute('src')
      ).toBe('https://maily.to/badge.png');
    });
  });

  describe('line commands', () => {
    it('breaks a line in two without ending the paragraph', async () => {
      const { ref } = await render();
      const editor = ref.current!.getEditor();

      editor.chain().focus().insertContent('Before').run();
      const { from } = editor.state.selection;
      hardBreak.command?.({ editor, range: { from, to: from } });
      editor.chain().insertContent('After').run();

      const paragraphs = getContainerContent(ref.current!);

      expect({
        count: paragraphs.length,
        types: paragraphs[0]?.content?.map((node) => {
          return node.type;
        }),
      }).toEqual({ count: 1, types: ['text', 'hardBreak', 'text'] });
    });

    it('clears the line the cursor sits on and leaves the rest', async () => {
      const { ref } = await render();
      const editor = ref.current!.getEditor();

      editor.chain().focus().insertContent('Keep').run();
      editor.chain().focus().splitBlock().run();
      editor.chain().focus().insertContent('Gone').run();

      clearLine.command?.({ editor, range: { from: 1, to: 1 } });

      expect(
        getContainerContent(ref.current!).map((node) => {
          return node.content?.[0]?.text ?? null;
        })
      ).toEqual(['Keep']);
    });
  });
});
