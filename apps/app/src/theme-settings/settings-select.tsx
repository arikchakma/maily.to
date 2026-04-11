import { Select } from '@base-ui/react/select';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';

type SettingsSelectProps = {
  container: React.RefObject<HTMLElement | null>;
  value: string;
  onValueChange: (value: string) => void;
  items: { value: string; label: string }[];
};

export function SettingsSelect(props: SettingsSelectProps) {
  const { container, value, onValueChange, items } = props;

  return (
    <Select.Root
      value={value}
      onValueChange={(value) => {
        if (value !== null) {
          onValueChange(value);
        }
      }}
    >
      <Select.Trigger className="inline-flex h-7 w-full shrink-0 items-center rounded-lg bg-gray-50 px-2 pr-0 text-[13px] font-normal text-gray-600 transition-shadow duration-150 hover:ring-1 hover:ring-gray-200">
        <Select.Value />
        <div className="ml-auto flex size-7 shrink-0 items-center justify-center text-gray-400">
          <Select.Icon render={<ChevronDownIcon className="size-3.5" />} />
        </div>
      </Select.Trigger>
      <Select.Portal container={container}>
        <Select.Positioner
          alignItemWithTrigger={false}
          sideOffset={4}
          className="z-99"
        >
          <Select.Popup className="relative z-99 max-h-(--available-height) min-w-(--anchor-width) cursor-default overflow-x-hidden overflow-y-auto rounded-xl border border-gray-200/50 bg-white p-1 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.1),0_0_0_0.5px_rgba(0,0,0,0.05)] outline-none">
            {items.map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                className="relative inline-flex h-7 w-full cursor-default items-center justify-start gap-2 rounded-lg px-2 py-1 pr-8 text-[13px] font-normal whitespace-nowrap text-gray-600 hover:bg-gray-50 data-highlighted:bg-gray-50"
              >
                <Select.ItemIndicator className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500">
                  <CheckIcon className="size-3" />
                </Select.ItemIndicator>
                <Select.ItemText>{item.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
