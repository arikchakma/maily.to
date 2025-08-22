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
    switch (type) {
      case 'doc':
        return this.doc(node);
      case 'paragraph':
        return this.paragraph(node);
      case 'text':
        return this.text(node);
      case 'variable':
        return this.variable(node);
      default:
        // it's fine to ignore unknown nodes
        // because we don't want to break the rendering process
        return '';
    }
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
