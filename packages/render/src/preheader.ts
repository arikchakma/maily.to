import { JSONContent } from '@tiptap/core';
import { Maily } from './maily';

export class Preheader {
  constructor(private readonly maily: Maily) {}

  render(content: string | JSONContent): string {
    if (typeof content === 'string') {
      return content;
    }

    return this.renderNode(content);
  }

  private renderNode(node: JSONContent): string {
    const type = node.type || '';
    if (type in this) {
      // @ts-expect-error - `this` is not assignable to type 'never'
      return this[type]?.(node);
    }

    throw new Error(`Node type "${type}" is not supported.`);
  }

  private doc(node: JSONContent): string {
    const children = node.content || [];
    if (children.length === 0) {
      return '';
    }

    return children.map((child) => this.renderNode(child)).join('');
  }

  private paragraph(node: JSONContent): string {
    const children = node.content || [];
    if (children.length === 0) {
      return '';
    }

    return children.map((child) => this.renderNode(child)).join('');
  }

  private text(node: JSONContent): string {
    return node.text || '';
  }

  private variable(node: JSONContent): string {
    const { id: variable, fallback } = node.attrs || {};
    return this.maily.getVariableValue(variable, fallback);
  }
}
