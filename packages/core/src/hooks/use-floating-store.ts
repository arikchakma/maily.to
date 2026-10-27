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
  isDragContextOpen: boolean;
};

type FloatingStoreAction = {
  getAll: () => FloatingStoreContext[];
  getContext: (id: FloatingElementId) => FloatingContext | undefined;
  register: (id: FloatingElementId, context: FloatingContext) => () => void;
  reset: () => void;
  setDragContextOpen: (open: boolean) => void;
  unregister: (id: FloatingElementId) => void;
  update: (id: FloatingElementId, context: FloatingContext) => void;
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

  isDragContextOpen: false,

  setDragContextOpen: (open) => {
    set({ isDragContextOpen: open });
  },

  register: (id, context) => {
    set((state) => {
      if (state.contexts.find((item) => item.id === id)) {
        return state;
      }

      return { contexts: [...state.contexts, { id, value: context }] };
    });

    return () => {
      get().unregister(id);
    };
  },

  unregister: (id) => {
    set((state) => ({
      contexts: state.contexts.filter((item) => item.id !== id),
    }));
  },

  update: (id, context) => {
    set((state) => ({
      contexts: state.contexts.map((item) =>
        item.id === id ? { ...item, value: context } : item
      ),
    }));
  },

  getContext: (id) => get().contexts.find((item) => item.id === id)?.value,

  getAll: () => get().contexts,

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
    return register(id, context);
  }, [id, context, register]);
}
