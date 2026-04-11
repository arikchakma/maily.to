import { useCallback, useState } from 'react';

type UseControllableStateOptions<T> = {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
};

export function useControllableState<T>(
  options: UseControllableStateOptions<T>
): [T, (next: T) => void] {
  const { value: controlledValue, defaultValue, onChange } = options;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const resolvedValue = controlledValue ?? uncontrolledValue;

  const setValue = useCallback(
    (next: T) => {
      onChange?.(next);
      setUncontrolledValue(next);
    },
    [onChange]
  );

  return [resolvedValue, setValue];
}
