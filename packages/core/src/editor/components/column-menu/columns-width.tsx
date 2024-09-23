type ColumnsWidthProps = {
  selectedValue: string;
  onValueChange: (value: string) => void;
};

export function ColumnsWidth(props: ColumnsWidthProps) {
  const { selectedValue, onValueChange } = props;

  return (
    <label className="mly-relative mly-flex mly-items-center">
      <span className="mly-absolute mly-inset-y-0 mly-left-2 mly-flex mly-items-center mly-text-xs mly-leading-none mly-text-gray-400">
        W
      </span>
      <select
        className="mly-h-auto mly-max-w-24 mly-appearance-none mly-border-0 mly-border-none mly-p-1 mly-pl-[26px] mly-text-sm mly-uppercase mly-tabular-nums mly-outline-none focus-visible:mly-outline-none"
        value={selectedValue}
        onChange={(e) => onValueChange(e.target.value)}
      >
        <option value="auto">auto</option>
        <option value="100%">100%</option>
      </select>
    </label>
  );
}
