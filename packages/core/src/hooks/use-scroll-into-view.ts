import type { DependencyList } from 'react';
import { useLayoutEffect, useRef } from 'react';

export function useScrollIntoView<
  C extends HTMLElement = HTMLElement,
  A extends HTMLElement = HTMLElement,
>(deps: DependencyList = []) {
  const containerRef = useRef<C | null>(null);
  const activeRef = useRef<A | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const activeElement = activeRef.current;
    if (!container || !activeElement) {
      return;
    }

    const { offsetHeight, offsetTop } = activeElement;
    const containerHeight = container.getBoundingClientRect().height;

    container.scrollTop = offsetTop - containerHeight / 2 + offsetHeight / 2;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { activeRef, containerRef };
}
