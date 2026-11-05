import { useEffect, useRef, useState } from 'react';

type DelayedStateOptions = {
  delay?: number;
};

export function useDelayedState(
  isOpen: boolean,
  options: DelayedStateOptions = {}
) {
  const { delay = 200 } = options;

  const [value, setValue] = useState(false);
  const timerRef = useRef(0);

  useEffect(() => {
    window.clearTimeout(timerRef.current);

    if (!isOpen) {
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
  }, [delay, isOpen]);

  return value;
}
