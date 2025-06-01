import { HexColorPicker, HexColorInput } from 'react-colorful';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';

type ColorPickerProps = {
  color: string;
  onColorChange: (color: string) => void;
};

export function ColorPicker(props: ColorPickerProps) {
  const { color, onColorChange } = props;

  const handleColorChange = (color: string) => {
    // HACK: This is a workaround for a bug in tiptap
    // https://github.com/ueberdosis/tiptap/issues/3580
    //
    //     ERROR: flushSync was called from inside a lifecycle
    //
    // To fix this, we need to make sure that the onChange
    // callback is run after the current execution context.
    queueMicrotask(() => {
      onColorChange(color);
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex shrink-0 cursor-pointer items-center justify-center focus:outline-none"
        >
          <div
            className="h-4 w-4 shrink-0 rounded-md border border-gray-200"
            style={{
              backgroundColor: color,
            }}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full rounded-none border-0 !bg-transparent !p-0 shadow-none drop-shadow-md"
        sideOffset={8}
      >
        <div className="min-w-[260px] rounded-xl border border-gray-200 bg-white p-4">
          <HexColorPicker
            color={color}
            onChange={handleColorChange}
            className="flex !w-full flex-col gap-4"
          />
          <HexColorInput
            alpha={true}
            color={color}
            onChange={handleColorChange}
            className="mt-4 w-full min-w-0 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm uppercase focus-visible:border-gray-400 focus-visible:outline-none"
            prefixed
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
