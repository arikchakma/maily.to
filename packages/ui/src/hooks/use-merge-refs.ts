import * as React from 'react';

/**
 * This is a copy of the useMergeRefs hook from floating-ui.
 * @see https://floating-ui.com/docs/react-utils#usemergerefs
 */
export function useMergeRefs<Instance>(
  refs: Array<React.Ref<Instance> | undefined>
): null | React.RefCallback<Instance> {
  const cleanupRef = React.useRef<void | (() => void)>(undefined);

  const refEffect = React.useCallback((instance: Instance | null) => {
    const cleanups = refs.map((ref) => {
      if (ref == null) {
        return;
      }

      if (typeof ref === 'function') {
        const refCallback = ref;
        const refCleanup = refCallback(instance);
        return typeof refCleanup === 'function'
          ? refCleanup
          : () => {
              refCallback(null);
            };
      }

      ref.current = instance;
      return () => {
        ref.current = null;
      };
    });

    return () => {
      cleanups.forEach((refCleanup) => refCleanup?.());
    };
  }, refs);

  return React.useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }

    return (value) => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = undefined;
      }

      if (value != null) {
        cleanupRef.current = refEffect(value);
      }
    };
  }, refs);
}
