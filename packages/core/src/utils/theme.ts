import type { InlineStyle, NodeThemeOptions } from '@maily-to/shared';
import {
  BLOCK_CONTAINER_TYPES,
  DATA_NODE_TYPE_KEY,
  deepMerge,
  getThemeDeclarations,
  MAILY_NODE_TYPES,
  mergeInlineStyles,
  MARGIN_BOTTOM_ABSORBER_TYPES,
  MARGIN_TOP_ABSORBER_TYPES,
  parseInlineStyles,
  stringifyInlineStyles,
} from '@maily-to/shared';
import type { Editor } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';

const HEADING_LEVEL_PATTERN = /^h[1-6]$/;

export type NodeStyleState = {
  authored: InlineStyle;
  resolved: InlineStyle;
};

function getThemeSelector(type: string) {
  const nodeType = HEADING_LEVEL_PATTERN.test(type)
    ? MAILY_NODE_TYPES.HEADING
    : type;
  const tag = nodeType === type ? '' : type;

  return `${tag}[${DATA_NODE_TYPE_KEY}="${nodeType}"]`;
}

export function getNodeTheme(editor: Editor): NodeThemeOptions {
  return (editor.state.doc.attrs.theme as NodeThemeOptions | null) ?? {};
}

export type NodeThemeUpdate = {
  [Type in keyof NodeThemeOptions]?:
    | Record<string, string | null | undefined>
    | null
    | undefined;
};

export type MergedNodeThemeOptions = {
  theme: NodeThemeOptions;
  update: NodeThemeUpdate;
};

export function getMergedNodeTheme(
  options: MergedNodeThemeOptions
): NodeThemeOptions {
  const { theme, update } = options;
  const merged = deepMerge<Record<string, unknown>>(
    theme as Record<string, unknown>,
    update as Record<string, unknown>
  );
  const next: Record<string, InlineStyle> = {};

  for (const [type, declarations] of Object.entries(merged)) {
    if (!declarations) {
      continue;
    }

    const kept: InlineStyle = {};

    for (const [property, value] of Object.entries(
      declarations as Record<string, string | null | undefined>
    )) {
      if (value === null || value === undefined || value === '') {
        continue;
      }

      kept[property] = value;
    }

    if (Object.keys(kept).length > 0) {
      next[type] = kept;
    }
  }

  return next as NodeThemeOptions;
}

/**
 * `authored` is what the node wrote for itself, so it answers "did the user
 * change this". `resolved` layers it over the theme, which is what a field
 * should display.
 */
export type NodeStyleStateOptions = {
  editor: Editor;
  type: string;
};

export function getNodeStyleState(
  options: NodeStyleStateOptions
): NodeStyleState {
  const { editor, type } = options;
  const attrs = editor.getAttributes(type);
  const authored = parseInlineStyles((attrs.style as string) ?? '');
  const theme =
    getThemeDeclarations({ attrs, theme: getNodeTheme(editor), type }) ?? {};

  return { authored, resolved: mergeInlineStyles(theme, authored) };
}

function getTypeSelector(type: string) {
  return `[${DATA_NODE_TYPE_KEY}="${type}"]`;
}

/**
 * The margin the theme gives a block is the gap to its neighbour, so it has to
 * come off wherever `getSuppressedMargins` takes it off in the renderer. These
 * are the same four conditions written as selectors: no neighbour on that
 * side, a neighbour that is itself the gap, or a parent that does not stack
 * blocks at all.
 */
type SuppressionRulesOptions = {
  declarations: InlineStyle;
  scope: string;
  selector: string;
};

function getSuppressionRules(options: SuppressionRulesOptions) {
  const { declarations, scope, selector } = options;
  const outside = BLOCK_CONTAINER_TYPES.map(getTypeSelector).join(',');
  const rules: string[] = [];

  if (declarations.marginTop && declarations.marginTop !== '0') {
    const absorbers = MARGIN_TOP_ABSORBER_TYPES.map((type) => {
      return `${scope} ${getTypeSelector(type)}+${selector}`;
    });

    rules.push(
      `${[`${scope} ${selector}:first-child`, ...absorbers].join(',')}{margin-top:0}`
    );
  }

  if (declarations.marginBottom && declarations.marginBottom !== '0') {
    const absorbers = MARGIN_BOTTOM_ABSORBER_TYPES.map((type) => {
      return `${scope} ${selector}:has(+${getTypeSelector(type)})`;
    });

    rules.push(
      `${[`${scope} ${selector}:last-child`, ...absorbers].join(',')}{margin-bottom:0}`
    );
  }

  if (rules.length > 0) {
    rules.push(
      `${scope} :not(${outside})>${selector}{margin-top:0;margin-bottom:0}`
    );
  }

  return rules;
}

export type ThemeCssOptions = {
  scope: string;
  theme: NodeThemeOptions;
};

export function getThemeCss(options: ThemeCssOptions) {
  const { scope, theme } = options;
  const rules: string[] = [];

  for (const [type, declarations] of Object.entries(theme)) {
    const selector = getThemeSelector(type);
    const style = stringifyInlineStyles(declarations);

    if (style) {
      rules.push(`${scope} ${selector}{${style}}`);
      rules.push(...getSuppressionRules({ declarations, scope, selector }));
    }
  }

  return rules.join('');
}

export type ShellType =
  | typeof MAILY_NODE_TYPES.BODY
  | typeof MAILY_NODE_TYPES.CONTAINER;

export type ShellNodeEntry = {
  node: Node;
  position: number;
};

type ChildEntriesOptions = {
  offset: number;
  parent: Node;
  type: string;
};

function getChildEntries(options: ChildEntriesOptions): ShellNodeEntry[] {
  const { offset, parent, type } = options;
  const entries: ShellNodeEntry[] = [];
  let position = offset;

  parent.forEach((child) => {
    if (child.type.name === type) {
      entries.push({ node: child, position });
    }

    position += child.nodeSize;
  });

  return entries;
}

export type ShellNodesOptions = {
  doc: Node;
  type: ShellType;
};

export function getShellNodes(options: ShellNodesOptions): ShellNodeEntry[] {
  const { doc, type } = options;
  const bodies = getChildEntries({
    offset: 0,
    parent: doc,
    type: MAILY_NODE_TYPES.BODY,
  });

  if (type === MAILY_NODE_TYPES.BODY) {
    return bodies;
  }

  return bodies.flatMap((body) => {
    return getChildEntries({
      offset: body.position + 1,
      parent: body.node,
      type,
    });
  });
}
