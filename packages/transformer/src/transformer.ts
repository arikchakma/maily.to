import {
  Parser as AcornParser,
  ExpressionStatement,
  ObjectExpression,
  Property,
  Identifier,
  Literal,
} from 'acorn';
import jsx from 'acorn-jsx';
import type {
  JSXAttribute,
  JSXElement,
  JSXExpressionContainer,
  JSXIdentifier,
  JSXText,
  ParsedNode,
  Options,
} from './types';

export class Transformer {
  protected jsx: typeof AcornParser;

  constructor() {
    this.jsx = AcornParser.extend(jsx());
  }

  /**
   * Parses JSX content into an AST.
   * @param content - The JSX content to parse
   * @returns The AST of the parsed content
   */
  public ast(content: string) {
    return this.jsx.parse(content, {
      sourceType: 'module',
      ecmaVersion: 'latest',
    });
  }

  /**
   * Cleans the content by removing newlines and tabs.
   * @param content - The content to clean
   * @returns The cleaned content
   */
  private clean(content: string) {
    return (
      content
        .trim()
        // remove all newlines and tabs
        .replace(/(\r\n\t|\n|\r\t)/gm, '')
        // remove all spaces between tags
        .replace(/\>\s+\</g, '><')
    );
  }

  /**
   * Transforms JSX content into a simplified structured tree.
   *
   * - Cleans and parses the input JSX content.
   * - Iterates over the AST nodes to convert them into a ParsedNode tree.
   *
   * @param content - The JSX content to transform.
   * @returns The root ParsedNode object containing the transformed JSX tree.
   */
  public async transform(content: string): Promise<ParsedNode> {
    content = this.clean(content);
    const ast = this.ast(content);

    const children: ParsedNode[] = [];
    for (const node of ast.body) {
      children.push(this.transformNode(node));
    }

    return {
      type: 'root',
      children,
    };
  }

  private transformNode(node: unknown, options?: Options) {
    // @ts-ignore
    if (node?.type in this) {
      // @ts-ignore
      return this[node.type](node, options);
    } else {
      console.log('Unknown node type:', node);
    }
  }

  private ExpressionStatement(node: ExpressionStatement) {
    return this.transformNode(node.expression);
  }

  private JSXElement(node: JSXElement) {
    const element = node;
    const attributes: Record<string, any> = {};
    for (const attr of element?.openingElement?.attributes) {
      attributes[this.transformNode(attr.name)] = this.transformNode(
        attr.value
      );
    }

    const children: ParsedNode[] = [];
    const isSingleChildElement = element.children.length === 1;
    element.children.forEach((child, index) => {
      children.push(
        this.transformNode(
          child,
          child.type === 'JSXText'
            ? {
                trimStart: index === 0,
                trimEnd: index === element.children.length - 1,
                trim: isSingleChildElement,
              }
            : undefined
        )
      );
    });

    let type = element.openingElement.name.name.toLowerCase();
    // Convert text to paragraph to avoid conflicts with the text node
    if (type === 'text') {
      type = 'paragraph';
    }

    const parsedNode: ParsedNode = {
      type,
      attributes,
      children,
    };

    return parsedNode;
  }

  private JSXExpressionContainer(node: JSXExpressionContainer) {
    return this.transformNode(node.expression);
  }

  private JSXAttribute(node: JSXAttribute) {
    return {
      name: node.name.name,
      value: this.transformNode(node.value),
    };
  }

  private JSXIdentifier(node: JSXIdentifier) {
    return node.name;
  }

  private ObjectExpression(node: ObjectExpression) {
    const object: Record<string, any> = {};
    for (const prop of node.properties as Property[]) {
      object[this.transformNode(prop.key)] = this.transformNode(prop.value);
    }

    return object;
  }

  private Property(node: Property) {
    return {
      name: this.transformNode(node.key),
      value: this.transformNode(node.value),
    };
  }

  private Identifier(node: Identifier) {
    return node.name;
  }

  private Literal(node: Literal) {
    return node.value;
  }

  private JSXText(node: JSXText, options?: Options) {
    const { trimStart, trimEnd, trim } = options ?? {};
    let text = node.value;

    if (trimStart) {
      text = text.trimStart();
    }

    if (trimEnd) {
      text = text.trimEnd();
    }

    if (trim) {
      text = text.trim();
    }

    return {
      type: 'text',
      text,
    };
  }
}
