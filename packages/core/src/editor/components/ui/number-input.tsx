import { cn } from '@/editor/utils/classname';
import { type LucideIcon } from 'lucide-react';
import { SVGIcon } from '../icons/grid-lines';

type NumberInputProps = {
  value: number;
  onValueChange: (value: number) => void;
  icon?: LucideIcon | SVGIcon;
  max?: number;
};

export function NumberInput(props: NumberInputProps) {
  const { value, onValueChange, icon: Icon, max } = props;

  return (
    <label className="mly-relative mly-flex mly-items-center mly-justify-center">
      {Icon ? (
        <Icon className="mly-absolute mly-left-1.5 mly-size-3.5" />
      ) : null}
      <input
        min={0}
        {...(max ? { max } : {})}
        type="number"
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className={cn(
          'hide-number-controls focus-visible:outline-none mly-h-auto mly-max-w-12 mly-border-0 mly-border-none mly-p-1 mly-text-sm mly-tabular-nums mly-outline-none',
          Icon ? 'mly-pl-[26px]' : ''
        )}
      />
    </label>
  );
}
