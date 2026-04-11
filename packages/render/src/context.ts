import type { AnyMailyMark, AnyMailyNode, FontProps } from '@maily-to/shared';

import type { MailyRenderConfig } from './config';
import { dispatch, children } from './node';

/**
 * Typed variable keys available on every RenderContext.
 *
 * Built-in keys:
 * - `item` — the current record during a repeat iteration. Set by repeat.tsx
 *   when looping over an array variable. Each iteration gets its own copy so
 *   sibling iterations are isolated. Variable/visibility lookups check `item`
 *   first, then fall back to `config.variableValues`.
 * - `columnTdWidth` — the TD-relative percentage width string (e.g. `"48.4%"`)
 *   set by columns.tsx and consumed by column.tsx.
 *
 * Extend via module augmentation to add custom keys:
 *
 * @example
 * ```ts
 * declare module '@maily-to/render' {
 *   interface RenderVariableMap {
 *     theme: 'light' | 'dark';
 *     locale: string;
 *   }
 * }
 * ```
 */
export interface RenderVariableMap {
  item?: Record<string, unknown>;
  columnTdWidth?: string;
}

export type BoxModel = {
  totalWidth: number;
  totalBorder: number;
  totalPadding: number;
};

/**
 * Render-time context threaded through every node and mark renderer.
 *
 * State scoping:
 * - `config` — immutable, shared by the entire tree.
 * - `styles` / `fonts` — shared collectors that accumulate to the document root.
 *   Use `style()` and `font()` from any depth; they all write to the same sets.
 * - `vars` — cloned per `child()` call. A child inherits the parent's vars at
 *   creation time, but mutations in either direction are isolated. This is what
 *   allows nested repeat iterations to each carry their own `item` without
 *   leaking into siblings or parents.
 * - `parent`, `siblingIndex`, `size` — local to each context instance.
 */
export interface RenderContext<
  Variables extends RenderVariableMap = RenderVariableMap,
> {
  readonly parent: AnyMailyNode | AnyMailyMark | undefined;
  readonly siblingIndex: number;
  readonly config: MailyRenderConfig;
  readonly size: Readonly<BoxModel>;
  /** Content width after subtracting border and padding from `size.totalWidth`. */
  readonly box: number;

  /** Render a single node using the registered node renderers. */
  render(node: AnyMailyNode): React.ReactNode;

  /** Render all child nodes of a parent, creating a child context for each. */
  children(parent: AnyMailyNode): React.ReactNode[];

  /**
   * Set a typed variable on this context.
   * Only affects this context — child contexts created via `child()` get
   * their own copy and won't see mutations made here after creation.
   */
  set<K extends keyof Variables>(key: K, value: Variables[K]): void;

  /** Get a typed variable from this context. */
  get<K extends keyof Variables>(key: K): Variables[K];

  /**
   * Access all variables as a readonly object. Creates a new object on
   * each access — prefer `get()` for individual lookups.
   */
  readonly var: Readonly<Variables>;

  /** Add a CSS rule to the shared document-level style collector. */
  style(css: string): void;
  /** Register a font face in the shared document-level font collector. */
  font(name: string, props: FontProps): void;

  /**
   * Derive a child context for rendering a child node.
   *
   * - `config`, `styles`, and `fonts` are shared by reference.
   * - `vars` are shallow-cloned so child `set()` calls don't affect the parent.
   * - `parent`, `siblingIndex`, and `size` can be overridden; unset fields
   *   inherit from the current context.
   */
  child(opts: ChildContextOptions): RenderContext<Variables>;

  readonly styles: ReadonlySet<string>;
  readonly fonts: ReadonlyMap<string, FontProps>;
}

export type ChildContextOptions = {
  parent?: AnyMailyNode | AnyMailyMark;
  siblingIndex?: number;
  size?: Partial<BoxModel>;
};

type SharedState = {
  vars: Map<string, unknown>;
  styles: Set<string>;
  fonts: Map<string, FontProps>;
};

export type CreateRenderContextOptions = {
  config: MailyRenderConfig;
  parent?: AnyMailyNode | AnyMailyMark;
  siblingIndex?: number;
  size?: Partial<BoxModel>;
};

const DEFAULT_SIZE: BoxModel = {
  totalWidth: 600,
  totalBorder: 0,
  totalPadding: 0,
};

/**
 * Creates the root RenderContext for a render pass. Node renderers
 * derive child contexts via `ctx.child()` as they descend the tree.
 */
export function defineRenderContext<
  Variables extends RenderVariableMap = RenderVariableMap,
>(opts: CreateRenderContextOptions): RenderContext<Variables> {
  const shared: SharedState = {
    vars: new Map(),
    styles: new Set(),
    fonts: new Map(),
  };

  const size = { ...DEFAULT_SIZE, ...opts.size };

  return defineContext(
    {
      config: opts.config,
      parent: opts.parent,
      siblingIndex: opts.siblingIndex ?? 0,
      size,
    },
    shared
  );
}

type BuildContextOptions = {
  config: MailyRenderConfig;
  parent: AnyMailyNode | AnyMailyMark | undefined;
  siblingIndex: number;
  size: BoxModel;
};

function defineContext<Variables extends RenderVariableMap = RenderVariableMap>(
  opts: BuildContextOptions,
  shared: SharedState
): RenderContext<Variables> {
  const { config, parent, siblingIndex, size } = opts;
  const { vars, styles, fonts } = shared;

  let varCache: Readonly<Variables> | null = null;

  const ctx: RenderContext<Variables> = {
    parent,
    siblingIndex,
    config,
    size,

    get box() {
      return size.totalWidth - size.totalBorder - size.totalPadding;
    },

    render(node: AnyMailyNode) {
      return dispatch(node, ctx);
    },

    children(parent: AnyMailyNode) {
      return children(parent, ctx);
    },

    set<K extends keyof Variables>(key: K, value: Variables[K]) {
      vars.set(key as string, value);
      varCache = null;
    },

    get<K extends keyof Variables>(key: K): Variables[K] {
      return vars.get(key as string) as Variables[K];
    },

    get var() {
      return (varCache ??= Object.fromEntries(vars) as Readonly<Variables>);
    },

    style(css: string) {
      styles.add(css);
    },

    font(name: string, props: FontProps) {
      fonts.set(name, props);
    },

    child(opts: ChildContextOptions): RenderContext<Variables> {
      const childSize: BoxModel = opts.size
        ? {
            totalWidth: opts.size.totalWidth ?? size.totalWidth,
            totalBorder: opts.size.totalBorder ?? size.totalBorder,
            totalPadding: opts.size.totalPadding ?? size.totalPadding,
          }
        : size;

      // Clone vars so child mutations don't leak to parent.
      // Styles and fonts remain shared (they accumulate to the document root).
      const childShared: SharedState = {
        vars: new Map(vars),
        styles,
        fonts,
      };

      return defineContext(
        {
          config,
          parent: opts.parent ?? parent,
          siblingIndex: opts.siblingIndex ?? siblingIndex,
          size: childSize,
        },
        childShared
      );
    },

    get styles() {
      return styles as ReadonlySet<string>;
    },
    get fonts() {
      return fonts as ReadonlyMap<string, FontProps>;
    },
  };

  return ctx;
}
