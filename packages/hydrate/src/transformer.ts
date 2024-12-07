import { Parser } from './parser';
import { ParsedNode } from './types';

export type JSONContent = {
  type?: string;
  attrs?: Record<string, any>;
  content?: JSONContent[];
  marks?: {
    type: string;
    attrs?: Record<string, any>;
    [key: string]: any;
  }[];
  text?: string;
  [key: string]: any;
};

const allowedSpacers = ['sm', 'md', 'lg', 'xl'] as const;
export type AllowedSpacers = (typeof allowedSpacers)[number];

const spacers: Record<AllowedSpacers, string> = {
  sm: '8px',
  md: '16px',
  lg: '32px',
  xl: '64px',
};

const allowedLogoSizes = ['sm', 'md', 'lg'] as const;
type AllowedLogoSizes = (typeof allowedLogoSizes)[number];

const logoSizes: Record<AllowedLogoSizes, string> = {
  sm: '40px',
  md: '48px',
  lg: '64px',
};

export class Transformer {
  protected parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  public async transform(content: string): Promise<JSONContent> {
    const ast = await this.parser.parse(content);
    const body = this.findBodyNode(ast);
    if (!body) {
      throw new Error('Not a valid Maily markup');
    }

    return this.transformNode(body);
  }

  private findBodyNode(node: ParsedNode): ParsedNode | null {
    if (node.type === 'body') {
      return node;
    }

    for (const child of node?.children || []) {
      const bodyNode = this.findBodyNode(child);
      if (bodyNode) {
        return bodyNode;
      }
    }

    return null;
  }

  private transformNode(node: ParsedNode): JSONContent {
    const type = node.type;
    if (type in this) {
      // @ts-ignore
      return this[type](node);
    }

    throw new Error(`Node type "${type}" is not supported`);
  }

  private body(node: ParsedNode): JSONContent {
    // ignore the first container as it's the base root
    // of Maily React markup
    const container = node.children[0];

    return {
      type: 'doc',
      content: container.children.map((child) => this.transformNode(child)),
    };
  }

  private container(node: ParsedNode): JSONContent {
    if (this.isSpacerNode(node)) {
      return this.spacer(node);
    } else if (this.isButtonNode(node)) {
      return this.button(node);
    } else if (this.isBulletListNode(node)) {
      return this.bulletList(node);
    } else if (this.isOrderedListNode(node)) {
      return this.orderedList(node);
    }

    const attrs = node?.attributes || {};
    const padding = attrs?.paddingTop || 0;
    const margin = attrs?.marginTop || 0;

    return {
      type: 'section',
      attrs: {
        paddingTop: padding,
        paddingRight: padding,
        paddingBottom: padding,
        paddingLeft: padding,

        marginTop: margin,
        marginRight: margin,
        marginBottom: margin,
        marginLeft: margin,

        borderWidth: attrs?.borderWidth || 0,
        borderColor: attrs?.borderColor || 'transparent',
        borderRadius: attrs?.borderRadius || 0,

        backgroundColor: attrs?.backgroundColor || 'transparent',
      },
      content: node.children.map((child) => this.transformNode(child)),
    };
  }

  private isSpacerNode(node: ParsedNode) {
    const attrs = node?.attributes || {};
    return node?.type === 'container' && attrs?.id === 'maily-spacer';
  }

  private spacer(node: ParsedNode): JSONContent {
    const attrs = node?.attributes || {};
    const height = attrs?.style?.height || '8px';

    const heightKey = Object.keys(spacers).find((key) =>
      height.includes(spacers[key as AllowedSpacers])
    );

    return {
      type: 'spacer',
      attrs: {
        height: heightKey,
      },
    };
  }

  private isButtonNode(node: ParsedNode): boolean {
    const attrs = node?.attributes || {};
    return node?.type === 'container' && attrs?.id === 'maily-button';
  }

  private button(node: ParsedNode): JSONContent {
    const attrs = node?.attributes || {};
    const style = attrs?.style || {};
    const textAlign = style?.textAlign || 'left';

    const buttonContainer = node.children[0];
    const buttonStyle = buttonContainer?.attributes?.style || {};

    const textNode = buttonContainer.children[0];

    const borderRadius = buttonStyle?.borderRadius || '0px';
    const radius =
      borderRadius === '0px'
        ? 'sharp'
        : borderRadius === '6px'
          ? 'smooth'
          : 'round';

    const backgroundColor = buttonStyle?.backgroundColor || 'transparent';
    const variant = backgroundColor === 'transparent' ? 'outline' : 'filled';

    return {
      type: 'button',
      attrs: {
        text: textNode?.text || '',
        url: buttonContainer?.attributes?.href || '',

        alignment: textAlign,

        color: buttonStyle?.color || '#000000',

        borderWidth: buttonStyle?.borderWidth || 0,
        borderColor: buttonStyle?.borderColor || 'transparent',
        borderStyle: buttonStyle?.borderStyle || 'solid',

        borderRadius: radius,
        variant,

        backgroundColor: buttonStyle?.backgroundColor || 'transparent',
      },
    };
  }

  private heading(node: ParsedNode): JSONContent {
    const attrs = node?.attributes || {};
    const level = parseInt(attrs?.as?.replace('h', '') || 1);

    return {
      type: 'heading',
      attrs: {
        level,
      },
      content: node.children.map((child) => this.transformNode(child)),
    };
  }

  private text(node: ParsedNode): JSONContent {
    return {
      type: 'text',
      text: node?.text || '',
    };
  }

  private footer(node: ParsedNode): JSONContent {
    return {
      type: 'footer',
      content: node.children.map((child) => this.transformNode(child)),
    };
  }

  private isFooterNode(node: ParsedNode): boolean {
    const attrs = node?.attributes || {};
    return node?.type === 'paragraph' && attrs?.id === 'maily-footer';
  }

  private img(node: ParsedNode): JSONContent {
    const isMailyImage = this.isImageNode(node);
    const isMailyLogo = this.isLogoNode(node);
    if (isMailyImage || isMailyLogo) {
      return this.image(node);
    }
    const attrs = node?.attributes || {};

    return {
      type: 'image',
      attrs: {
        ...(attrs?.width && { width: attrs.width }),
        ...(attrs?.height && { height: attrs.height }),
        src: attrs?.src || '',
      },
    };
  }

  private image(node: ParsedNode): JSONContent {
    const containerNode = node.children[0];
    const align = containerNode?.attributes?.align || 'left';

    const imgNode = containerNode.children[0];

    const attrs = imgNode?.attributes || {};
    const style = attrs?.style || {};

    const width =
      style?.maxWidth === '100%' ? null : parseFloat(style?.maxWidth || '0');
    const height =
      style?.maxHeight === '100%' ? null : parseFloat(style?.maxHeight || '0');

    const type = this.isImageNode(node) ? 'image' : 'logo';
    const size = Object.keys(logoSizes).find(
      (key) => style?.width === logoSizes[key as AllowedLogoSizes]
    );

    return {
      type,
      attrs: {
        alignment: align,
        ...(width && { width }),
        ...(height && { height }),
        ...(type === 'logo' && { size }),
        src: attrs?.src || '',
        alt: attrs?.alt || '',
      },
    };
  }

  private hr(node: ParsedNode): JSONContent {
    return {
      type: 'horizontalRule',
    };
  }

  private paragraph(node: ParsedNode): JSONContent {
    if (this.isFooterNode(node)) {
      return this.footer(node);
    }

    return {
      type: 'paragraph',
      content: node.children.map((child) => this.transformNode(child)),
    };
  }

  private strong(node: ParsedNode): JSONContent {
    return this.bold(node);
  }

  private b(node: ParsedNode): JSONContent {
    return this.bold(node);
  }

  private bold(node: ParsedNode): JSONContent {
    const firstChild = node.children[0];

    return {
      type: 'text',
      marks: [{ type: 'bold' }],
      text: firstChild?.text || '',
    };
  }

  private isColumnsNode(node: ParsedNode): boolean {
    const attrs = node?.attributes || {};
    return (
      node?.type === 'row' &&
      (attrs?.className?.includes('tab-row-full') ||
        attrs?.id === 'maily-columns')
    );
  }

  private isColumnNode(node: ParsedNode): boolean {
    const attrs = node?.attributes || {};

    return (
      node?.type === 'column' &&
      (attrs?.className?.includes('tab-col-full') ||
        attrs?.id === 'maily-column')
    );
  }

  private isColumnSection(node: ParsedNode): boolean {
    const attrs = node?.attributes || {};

    return (
      node?.type === 'section' &&
      (attrs?.className?.includes('tab-pad') ||
        attrs?.id === 'maily-col-section')
    );
  }

  private columns(node: ParsedNode): JSONContent {
    const firstChild = node?.children[0];
    const columnFirstChild = firstChild?.children[0];
    const paddingRight = columnFirstChild?.attributes?.style?.paddingRight || 0;

    return {
      type: 'columns',
      attrs: {
        gap: paddingRight * 2,
      },
      content: node.children.map((child) => this.transformNode(child)),
    };
  }

  private isSectionNode(node: ParsedNode): boolean {
    const attrs = node?.attributes || {};
    return node?.type === 'row' && attrs?.id === 'maily-section';
  }

  private section(node: ParsedNode): JSONContent {
    const firstColumnNode = node?.children[0];
    const attrs = firstColumnNode?.attributes || {};

    const style = firstColumnNode?.attributes?.style || {};
    const padding = style?.paddingTop || 0;
    const margin = style?.marginTop || 0;
    const align = attrs?.align || 'left';

    return {
      type: 'section',
      attrs: {
        align,

        paddingTop: padding,
        paddingRight: padding,
        paddingBottom: padding,
        paddingLeft: padding,

        marginTop: margin,
        marginRight: margin,
        marginBottom: margin,
        marginLeft: margin,

        borderWidth: style?.borderWidth || 0,
        borderColor: style?.borderColor || 'transparent',
        borderRadius: style?.borderRadius || 0,

        backgroundColor: style?.backgroundColor || 'transparent',
      },
      content: firstColumnNode?.children.map((child) =>
        this.transformNode(child)
      ),
    };
  }

  private isImageNode(node: ParsedNode): boolean {
    return node?.type === 'row' && node?.attributes?.id === 'maily-image';
  }

  private isLogoNode(node: ParsedNode): boolean {
    return node?.type === 'row' && node?.attributes?.id === 'maily-logo';
  }

  private row(node: ParsedNode): JSONContent {
    const isColumnsNode = this.isColumnsNode(node);
    if (isColumnsNode) {
      return this.columns(node);
    }

    const isSectionNode = this.isSectionNode(node);
    if (isSectionNode) {
      return this.section(node);
    }

    const isImageNode = this.isImageNode(node);
    const isLogoNode = this.isLogoNode(node);
    if (isImageNode || isLogoNode) {
      return this.img(node);
    }

    return {
      type: 'row',
    };
  }

  private columnsColumn(node: ParsedNode): JSONContent {
    const firstChild = node.children[0];
    const isColumnSection = this.isColumnSection(firstChild);
    const width = parseFloat(node?.attributes?.width || '100%');

    return {
      type: 'column',
      content: isColumnSection
        ? firstChild.children.map((child) => this.transformNode(child))
        : node.children.map((child) => this.transformNode(child)),
      attrs: {
        width,
      },
    };
  }

  private column(node: ParsedNode): JSONContent {
    const isColumnNode = this.isColumnNode(node);
    if (isColumnNode) {
      return this.columnsColumn(node);
    }

    return {
      type: 'column',
    };
  }

  private blockquote(node: ParsedNode): JSONContent {
    return {
      type: 'blockquote',
      content: node.children.map((child) => this.transformNode(child)),
    };
  }

  private code(node: ParsedNode): JSONContent {
    const codeTextNode = node.children[0];

    return {
      type: 'text',
      marks: [{ type: 'code' }],
      text: codeTextNode?.text || '',
    };
  }

  private isBulletListNode(node: ParsedNode): boolean {
    const attrs = node?.attributes || {};
    return node?.type === 'container' && attrs?.id === 'maily-bullet-list';
  }

  private isOrderedListNode(node: ParsedNode): boolean {
    const attrs = node?.attributes || {};
    return node?.type === 'container' && attrs?.id === 'maily-ordered-list';
  }

  private bulletList(node: ParsedNode): JSONContent {
    console.log('Node: ', node);
    const bulletList = node.children[0];
    return {
      type: 'bulletList',
      content: bulletList.children.map((child) => this.transformNode(child)),
    };
  }

  private orderedList(node: ParsedNode): JSONContent {
    const orderedList = node.children[0];
    return {
      type: 'orderedList',
      content: orderedList.children.map((child) => this.transformNode(child)),
    };
  }

  private li(node: ParsedNode): JSONContent {
    return {
      type: 'listItem',
      content: node.children.map((child) => this.transformNode(child)),
    };
  }
}
