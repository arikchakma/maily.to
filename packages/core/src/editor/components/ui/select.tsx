import { useId } from 'react';

type SelectProps = {
  label: string;
  options: {
    value: string;
    label: string;
  }[];

  value: string;
  onValueChange: (value: string) => void;
};

export function Select(props: SelectProps) {
  const { label, options, value, onValueChange } = props;

  const selectId = `mly${useId()}`;

  return (
    <div>
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>

      <select
        id={selectId}
        className="mly-flex mly-min-h-7 mly-max-w-max mly-appearance-none mly-items-center mly-rounded-md mly-px-1.5 mly-py-0.5 mly-text-sm mly-leading-none mly-text-midnight-gray hover:mly-bg-soft-gray focus:mly-outline-none active:mly-bg-soft-gray"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
