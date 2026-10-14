import type {
  AnyMailyMark,
  AnyMailyNode,
  DocumentNode,
  InlineStyle,
  NodePosition,
  NodeThemeOptions,
} from '@maily-to/shared';
import {
  deepMerge,
  getSuppressedMargins,
  getThemeDeclarations,
  is,
  mergeInlineStyles,
  parseInlineStyles,
  stringifyInlineStyles,
} from '@maily-to/shared';

type NodeParent = {
  content?: AnyMailyNode[];
  type: string;
};

type ChildPositionOptions = {
  index: number;
  parent: NodeParent;
};

function getChildPosition(options: ChildPositionOptions): NodePosition {
  const { index, parent } = options;
  const content = parent.content ?? [];

  return {
    isFirst: index === 0,
    isLast: index === content.length - 1,
    nextType: content[index + 1]?.type,
    parentType: parent.type,
    previousType: content[index - 1]?.type,
  };
}

type SpacedDeclarationsOptions = {
  declarations: InlineStyle;
  position: NodePosition;
};

function getSpacedDeclarations(
  options: SpacedDeclarationsOptions
): InlineStyle {
  const { declarations, position } = options;
  const suppressed = getSuppressedMargins(position);
  const spaced = { ...declarations };

  if (suppressed.marginTop) {
    spaced.marginTop = '0';
  }

  if (suppressed.marginBottom) {
    spaced.marginBottom = '0';
  }

  return spaced;
}

type StyledAttrsOptions = {
  attrs: Record<string, unknown> | undefined;
  declarations: InlineStyle;
};

function getStyledAttrs(options: StyledAttrsOptions) {
  const { attrs, declarations } = options;
  const authored = parseInlineStyles((attrs?.style as string) ?? '');
  const style = stringifyInlineStyles(
    mergeInlineStyles(declarations, authored)
  );

  return { ...attrs, style: style || null };
}

type ThemedMarksOptions = {
  node: AnyMailyNode;
  theme: NodeThemeOptions;
};

function getThemedMarks(
  options: ThemedMarksOptions
): AnyMailyMark[] | undefined {
  const { node, theme } = options;

  if (!is.marked(node)) {
    return;
  }

  return node.marks.map((mark) => {
    const attrs = mark.attrs as Record<string, unknown> | undefined;
    const declarations = getThemeDeclarations({
      attrs,
      theme,
      type: mark.type,
    });

    if (!declarations) {
      return mark;
    }

    return {
      ...mark,
      attrs: getStyledAttrs({ attrs, declarations }),
    } as AnyMailyMark;
  });
}

type ThemedNodeOptions = {
  node: AnyMailyNode;
  position: NodePosition;
  theme: NodeThemeOptions;
};

function getThemedNode(options: ThemedNodeOptions): AnyMailyNode {
  const { node, position, theme } = options;
  const attrs = node.attrs as Record<string, unknown> | undefined;
  const declarations = getThemeDeclarations({ attrs, theme, type: node.type });
  const content = node.content?.map((child, index) => {
    const childPosition = getChildPosition({ index, parent: node });

    return getThemedNode({ node: child, position: childPosition, theme });
  });
  const marks = getThemedMarks({ node, theme });

  if (!declarations) {
    if (!(content || marks)) {
      return node;
    }

    return {
      ...node,
      ...(content ? { content } : {}),
      ...(marks ? { marks } : {}),
    } as AnyMailyNode;
  }

  return {
    ...node,
    ...(content ? { content } : {}),
    ...(marks ? { marks } : {}),
    attrs: getStyledAttrs({
      attrs,
      declarations: getSpacedDeclarations({ declarations, position }),
    }),
  } as AnyMailyNode;
}

export type ThemedDocumentOptions = {
  document: DocumentNode;
  theme?: NodeThemeOptions | undefined;
};

export function getThemedDocument(
  options: ThemedDocumentOptions
): DocumentNode {
  const { document, theme } = options;
  const resolved = deepMerge(document.attrs?.theme ?? {}, theme ?? {});
  if (Object.keys(resolved).length === 0) {
    return document;
  }

  return {
    ...document,
    content: document.content.map((node, index) => {
      const position = getChildPosition({ index, parent: document });

      return getThemedNode({ node, position, theme: resolved });
    }),
  };
}
