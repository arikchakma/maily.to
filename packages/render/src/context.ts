import type { AnyMailyNode, FontProps } from '@maily-to/shared';

import type { BuiltMailyConfig } from './config';
import { children, dispatch } from './node';

/**
 * Typed variable keys available on every RenderContext.
 *
 * Extend via module augmentation to add custom keys:
 *
 * @example
 * ```ts
 * declare module '@maily-to/render' {
 *   interface RenderVariableMap {
 *     item: Record<string, unknown>;
 *   }
 * }
 * ```
 */
export interface RenderVariableMap {
  columnWidth: string;
  item: Record<string, unknown>;
}

export type BoxModel = {
  totalWidth: number;
  totalBorder: number;
  totalPadding: number;
};

/**
 * Render-time context threaded through every node renderer.
 *
 * State scoping:
 * - `config` — immutable, shared by the entire tree.
 * - `styles` — a shared collector that accumulates to the document root.
 *   Use `style()` from any depth; every context writes to the same set.
 * - `fonts` — a shared collector of the fonts the document needs an
 *   `@font-face` rule for, keyed so each variant is registered once.
 * - `vars` — cloned per `child()` call. A child inherits the parent's vars at
 *   creation time, but mutations in either direction are isolated.
 * - `parent`, `siblingIndex`, `size` — local to each context instance.
 */
export interface RenderContext<
  Variables extends RenderVariableMap = RenderVariableMap,
> {
  readonly parent: AnyMailyNode | undefined;
  readonly siblingIndex: number;
  readonly config: BuiltMailyConfig;
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

  /** Add a font to the shared document-level font collector. */
  font(key: string, font: FontProps): void;

  /**
   * Derive a child context for rendering a child node.
   *
   * - `config` and `styles` are shared by reference.
   * - `vars` are shallow-cloned so child `set()` calls don't affect the parent.
   * - `parent`, `siblingIndex`, and `size` can be overridden; unset fields
   *   inherit from the current context.
   */
  child(opts: ChildContextOptions): RenderContext<Variables>;

  readonly styles: ReadonlySet<string>;
  readonly fonts: ReadonlyMap<string, FontProps>;
}

export type ChildContextOptions = {
  parent?: AnyMailyNode;
  siblingIndex?: number;
  size?: Partial<BoxModel>;
};

type SharedState = {
  vars: Map<string, unknown>;
  styles: Set<string>;
  fonts: Map<string, FontProps>;
};

export type CreateRenderContextOptions = {
  config: BuiltMailyConfig;
  parent?: AnyMailyNode;
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

  return defineContext(
    {
      config: opts.config,
      parent: opts.parent,
      siblingIndex: opts.siblingIndex ?? 0,
      size: { ...DEFAULT_SIZE, ...opts.size },
    },
    shared
  );
}

type BuildContextOptions = {
  config: BuiltMailyConfig;
  parent: AnyMailyNode | undefined;
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

    render(node) {
      return dispatch(node, ctx);
    },

    children(parent) {
      return children(parent, ctx);
    },

    set(key, value) {
      vars.set(key as string, value);
      varCache = null;
    },

    get(key) {
      return vars.get(key as string) as Variables[typeof key];
    },

    get var() {
      return (varCache ??= Object.fromEntries(vars) as Readonly<Variables>);
    },

    style(css) {
      styles.add(css);
    },

    font(key, font) {
      fonts.set(key, font);
    },

    child(opts) {
      const childSize: BoxModel = opts.size
        ? {
            totalWidth: opts.size.totalWidth ?? size.totalWidth,
            totalBorder: opts.size.totalBorder ?? size.totalBorder,
            totalPadding: opts.size.totalPadding ?? size.totalPadding,
          }
        : size;

      // Clone vars so child mutations don't leak to parent.
      // Styles remain shared (they accumulate to the document root).
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
