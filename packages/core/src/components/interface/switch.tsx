import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '~/utils/classname';

type SwitchProps = Omit<
  React.ComponentProps<typeof SwitchPrimitive.Root>,
  'children'
>;

function Switch(props: SwitchProps) {
  const { className, ...rest } = props;

  return (
    <SwitchPrimitive.Root
      className={cn(
        'mly:relative mly:inline-flex mly:h-5 mly:w-8 mly:shrink-0 mly:cursor-pointer mly:items-center mly:rounded-full mly:border-2 mly:border-transparent mly:bg-gray-200 mly:transition-colors',
        'mly:data-[checked]:bg-gray-900',
        'mly:disabled:cursor-not-allowed mly:disabled:opacity-50',
        className
      )}
      {...rest}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'mly:pointer-events-none mly:block mly:size-3.5 mly:rounded-full mly:bg-white mly:shadow-sm mly:transition-transform',
          'mly:translate-x-0.5 mly:data-[checked]:translate-x-3'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
