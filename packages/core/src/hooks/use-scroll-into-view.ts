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

    const { offsetTop, offsetHeight } = activeElement;
    const containerHeight = container.getBoundingClientRect().height;
    const scrollTo = offsetTop - containerHeight / 2 + offsetHeight / 2;

    container.scrollTop = scrollTo;
  }, deps);

  return { containerRef, activeRef };
}
