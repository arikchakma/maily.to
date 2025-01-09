import type { Node as AcornNode, Expression } from 'acorn';

export interface JSXIdentifier extends AcornNode {
  type: 'JSXIdentifier';
  name: string;
}

export interface JSXAttribute extends AcornNode {
  type: 'JSXAttribute';
  name: JSXIdentifier;
  value: AcornNode | null;
}

export interface JSXOpeningElement extends AcornNode {
  type: 'JSXOpeningElement';
  name: JSXIdentifier;
  attributes: JSXAttribute[];
  selfClosing: boolean;
}

export interface JSXClosingElement extends AcornNode {
  type: 'JSXClosingElement';
  name: JSXIdentifier;
}

export interface JSXText extends AcornNode {
  type: 'JSXText';
  value: string;
  raw: string;
}

export interface JSXExpressionContainer extends AcornNode {
  type: 'JSXExpressionContainer';
  expression: Expression;
}

export type JSXChild = JSXElement | JSXText | JSXExpressionContainer;

export interface JSXElement extends AcornNode {
  type: 'JSXElement';
  openingElement: JSXOpeningElement;
  closingElement: JSXClosingElement | null;
  children: JSXChild[];
}

export interface JSXFragment extends AcornNode {
  type: 'JSXFragment';
  openingFragment: JSXOpeningFragment;
  closingFragment: JSXClosingFragment;
  children: JSXChild[];
}

export interface JSXOpeningFragment extends AcornNode {
  type: 'JSXOpeningFragment';
}

export interface JSXClosingFragment extends AcornNode {
  type: 'JSXClosingFragment';
}

export type JSXNode =
  | JSXElement
  | JSXFragment
  | JSXIdentifier
  | JSXAttribute
  | JSXOpeningElement
  | JSXClosingElement
  | JSXText
  | JSXExpressionContainer;

export interface ParsedNode {
  type: string;
  attributes?: Record<string, any>;
  children: ParsedNode[];
  text?: string;
  [key: string]: any;
}

export interface Options {
  trimStart?: boolean;
  trimEnd?: boolean;
  trim?: boolean;
  [key: string]: any;
}
