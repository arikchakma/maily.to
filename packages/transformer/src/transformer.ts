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

export class Transformer {
  protected parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  public async transform(content: string): Promise<JSONContent> {
    const ast = await this.parser.parse(content);
    const firstContainer = ast.children[0];
    // ignore the first container as it's the base root
    // of Maily React markup
    return this.transformNode({
      type: 'root',
      children: firstContainer.children,
    });
  }

  private transformNode(node: ParsedNode): JSONContent {
    const type = node.type;
    if (type in this) {
      // @ts-ignore
      return this[type](node);
    }

    throw new Error(`Node type "${type}" is not supported`);
  }

  private root(node: ParsedNode): JSONContent {
    return {
      type: 'doc',
      content: node.children.map((child) => this.transformNode(child)),
    };
  }

  private container(node: ParsedNode): JSONContent {
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

        backgroundColor: attrs?.background || 'transparent',
      },
      content: node.children.map((child) => this.transformNode(child)),
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

  private img(node: ParsedNode): JSONContent {
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

  private hr(node: ParsedNode): JSONContent {
    return {
      type: 'horizontalRule',
    };
  }

  private paragraph(node: ParsedNode): JSONContent {
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
    return (
      node?.type === 'row' &&
      node?.attributes?.className?.includes('tab-row-full')
    );
  }

  private isColumnNode(node: ParsedNode): boolean {
    return (
      node?.type === 'column' &&
      node?.attributes?.className?.includes('tab-col-full')
    );
  }

  private isColumnSection(node: ParsedNode): boolean {
    return (
      node?.type === 'section' &&
      node?.attributes?.className?.includes('tab-pad')
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

  private row(node: ParsedNode): JSONContent {
    const isColumnsNode = this.isColumnsNode(node);
    if (isColumnsNode) {
      return this.columns(node);
    }

    return {
      type: 'row',
    };
  }

  private columnsColumn(node: ParsedNode): JSONContent {
    const firstChild = node.children[0];
    const isColumnSection = this.isColumnSection(firstChild);

    return {
      type: 'column',
      content: isColumnSection
        ? firstChild.children.map((child) => this.transformNode(child))
        : node.children.map((child) => this.transformNode(child)),
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
}
