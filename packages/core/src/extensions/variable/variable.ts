import type { VariableOptions } from '@maily-to/extension-variable';
import { Variable } from '@maily-to/extension-variable';
import { DATA_NODE_TYPE_KEY } from '@maily-to/shared';
import { ReactNodeViewRenderer } from '@tiptap/react';

import type { Variables } from '~/utils/variable';

import { getVariableSuggestions } from './variable-suggestion';
import { VariableView } from './variable-view';

type CoreVariableOptions = VariableOptions & {
  variables?: Variables;
};

type CoreVariableStorage = {
  variables?: Variables;
};

declare module '@tiptap/core' {
  interface Storage {
    variable: CoreVariableStorage;
  }
}

export const VariableExtension = Variable.extend<
  CoreVariableOptions,
  CoreVariableStorage
>({
  addOptions() {
    return {
      ...this.parent?.(),
      variables: undefined,
    } as CoreVariableOptions;
  },

  addStorage() {
    return {
      variables: this.options.variables,
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableView, {
      attrs: {
        [DATA_NODE_TYPE_KEY]: this.name,
        class: 'mly:relative',
      },
    });
  },
}).configure({
  suggestion: getVariableSuggestions(),
});
