import { Box } from 'lucide-react';

type PaddingProps = {
  value: number;
  onChange: (value: number) => void;
};

export function Padding(props: PaddingProps) {
  const { value, onChange } = props;

  return (
    <label className="mly-relative mly-flex mly-items-center mly-justify-center">
      <Box size={14} className="mly-absolute mly-left-1.5" />
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="hide-number-controls focus-visible:outline-none mly-h-auto mly-max-w-12 mly-border-0 mly-border-none mly-p-1 mly-pl-[26px] mly-text-sm mly-tabular-nums mly-outline-none"
        min={0}
      />
    </label>
  );
}
