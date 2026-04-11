import { useEffect, useState } from 'react';

export function useMeasureDimensions(ref: React.RefObject<HTMLElement | null>) {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const { width: w, height: h } = el.getBoundingClientRect();
      setDimensions({ width: w, height: h });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return dimensions;
}
