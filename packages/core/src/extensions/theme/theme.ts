import type { NodeThemeOptions } from '@maily-to/shared';
import { MAILY_EXTENSION_TYPES, MAILY_NODE_TYPES } from '@maily-to/shared';
import { Extension } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import { Plugin } from '@tiptap/pm/state';

import { setStyleDeclarations } from '~/utils/style';
import type { NodeThemeUpdate, ShellType } from '~/utils/theme';
import { getMergedNodeTheme, getShellNodes, getThemeCss } from '~/utils/theme';

export type ShellThemeUpdate = Pick<NodeThemeUpdate, ShellType>;

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    theme: {
      setNodeTheme: (theme: NodeThemeOptions) => ReturnType;
      updateNodeTheme: (theme: NodeThemeUpdate) => ReturnType;
      updateShellTheme: (theme: ShellThemeUpdate) => ReturnType;
    };
  }
}

export type ThemeExtensionOptions = {
  theme: NodeThemeOptions;
};

const SCOPE_ATTRIBUTE = 'data-mly-theme-scope';

const THEME_ATTRIBUTE = 'theme';

function getDocumentTheme(doc: Node) {
  return doc.attrs.theme as NodeThemeOptions | null | undefined;
}

function getClearedDeclarations(
  declarations: Record<string, string | null | undefined>
) {
  return Object.fromEntries(
    Object.keys(declarations).map((property) => {
      return [property, null];
    })
  );
}

export const ThemeExtension = Extension.create<ThemeExtensionOptions>({
  name: MAILY_EXTENSION_TYPES.THEME,

  addOptions() {
    return {
      theme: {},
    };
  },

  addCommands() {
    return {
      setNodeTheme:
        (theme) =>
        ({ dispatch, tr }) => {
          if (dispatch) {
            tr.setDocAttribute(THEME_ATTRIBUTE, theme);
          }

          return true;
        },

      updateNodeTheme:
        (theme) =>
        ({ dispatch, state, tr }) => {
          if (dispatch) {
            tr.setDocAttribute(
              THEME_ATTRIBUTE,
              getMergedNodeTheme({
                theme: getDocumentTheme(state.doc) ?? {},
                update: theme,
              })
            );
          }

          return true;
        },

      updateShellTheme:
        (theme) =>
        ({ dispatch, state, tr }) => {
          if (dispatch) {
            tr.setDocAttribute(
              THEME_ATTRIBUTE,
              getMergedNodeTheme({
                theme: getDocumentTheme(state.doc) ?? {},
                update: theme,
              })
            );

            for (const [type, declarations] of Object.entries(theme)) {
              if (!declarations) {
                continue;
              }

              const cleared = getClearedDeclarations(declarations);
              const shells = getShellNodes({
                doc: state.doc,
                type: type as ShellType,
              });

              for (const shell of shells) {
                tr.setNodeAttribute(
                  shell.position,
                  'style',
                  setStyleDeclarations(
                    shell.node.attrs.style as string | null,
                    cleared
                  )
                );
              }
            }
          }

          return true;
        },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: [MAILY_NODE_TYPES.DOCUMENT],
        attributes: {
          theme: {
            default: this.options.theme,
            renderHTML: () => ({}),
          },
        },
      },
    ];
  },

  addProseMirrorPlugins() {
    const fallback = this.options.theme;
    const scope = `mly-theme-${Math.random().toString(36).slice(2, 10)}`;

    const getScopedCss = (theme: NodeThemeOptions | null | undefined) => {
      return getThemeCss({
        scope: `[${SCOPE_ATTRIBUTE}="${scope}"]`,
        theme: theme ?? fallback,
      });
    };

    return [
      new Plugin({
        view(view) {
          view.dom.setAttribute(SCOPE_ATTRIBUTE, scope);

          const element = document.createElement('style');
          element.textContent = getScopedCss(getDocumentTheme(view.state.doc));
          document.head.append(element);

          return {
            update(current, prevState) {
              const next = getDocumentTheme(current.state.doc);

              if (getDocumentTheme(prevState.doc) === next) {
                return;
              }

              element.textContent = getScopedCss(next);
            },

            destroy() {
              element.remove();
              view.dom.removeAttribute(SCOPE_ATTRIBUTE);
            },
          };
        },
      }),
    ];
  },
});
