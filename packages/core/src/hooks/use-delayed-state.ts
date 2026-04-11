import { useEffect, useRef, useState } from 'react';

type UseDelayedStateOptions = {
  delay?: number;
};

export function useDelayedState(
  defaultOpen: boolean,
  options: UseDelayedStateOptions = {}
) {
  const { delay = 200 } = options;

  const [value, setValue] = useState(false);
  const timerRef = useRef<number>(0);

  useEffect(() => {
    window.clearTimeout(timerRef.current);

    if (!defaultOpen) {
      timerRef.current = 0;
      setValue(false);
      return;
    }

    timerRef.current = window.setTimeout(() => {
      setValue(true);
      timerRef.current = 0;
    }, delay);

    return () => {
      if (!timerRef.current) {
        return;
      }

      window.clearTimeout(timerRef.current);
      timerRef.current = 0;
    };
  }, [defaultOpen, delay]);

  return value;
}
