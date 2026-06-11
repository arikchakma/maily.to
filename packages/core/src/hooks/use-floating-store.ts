import type { FloatingContext } from '@floating-ui/react';
import { useEffect } from 'react';
import { create } from 'zustand';

import type { FloatingElementId } from '~/types/floating-ui';

type FloatingStoreContext = {
  id: FloatingElementId;
  value: FloatingContext;
};

type FloatingStoreState = {
  contexts: FloatingStoreContext[];
};

type FloatingStoreAction = {
  register: (id: FloatingElementId, context: FloatingContext) => void;
  unregister: (id: FloatingElementId) => void;
  update: (id: FloatingElementId, context: FloatingContext) => void;
  getContext: (id: FloatingElementId) => FloatingContext | undefined;
  getAll: () => FloatingStoreContext[];
  reset: () => void;
};

/**
 * Global Zustand store that tracks FloatingUI contexts for all
 * bubble menus. Menus register on mount and unregister on unmount
 * so the editor can coordinate which menu is visible.
 */
export const useFloatingStore = create<
  FloatingStoreState & FloatingStoreAction
>((set, get, store) => ({
  contexts: [],

  register: (id, context) => {
    set((state) => {
      const contexts = state.contexts;
      if (contexts.find((context) => context.id === id)) {
        return state;
      }

      return { contexts: [...contexts, { id, value: context }] };
    });

    return () => {
      get().unregister(id);
    };
  },

  unregister: (id) => {
    set((state) => {
      const contexts = state.contexts.filter((context) => context.id !== id);
      return { contexts };
    });
  },

  update: (id, context) => {
    set((state) => {
      const contexts = state.contexts.map((item) =>
        item.id === id ? { ...item, value: context } : item
      );
      return { contexts };
    });
  },

  getContext: (id) => {
    return get().contexts.find((context) => context.id === id)?.value;
  },

  getAll: () => {
    return get().contexts;
  },

  reset: () => {
    set(store.getInitialState());
  },
}));

/** Registers a floating menu's context on mount and cleans up on unmount. */
export function useRegisterFloatingContext(
  id: FloatingElementId,
  context: FloatingContext
) {
  const register = useFloatingStore((state) => state.register);
  useEffect(() => {
    const unregister = register(id, context);
    return unregister;
  }, [id, context]);
}
