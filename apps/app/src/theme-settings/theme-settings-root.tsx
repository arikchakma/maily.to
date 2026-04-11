import { Tooltip } from '@base-ui/react/tooltip';
import { ThemeSettings as ThemeSettingsPrimitive } from '@maily-to/ui';

import { cn } from '../utils/classname';

type ThemeSettingsRootProps = {
  children: React.ReactNode;
  className?: string;
};

export function ThemeSettingsRoot(props: ThemeSettingsRootProps) {
  const { children, className } = props;

  return (
    <ThemeSettingsPrimitive.Root className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <Tooltip.Provider>
        <div
          className={cn(
            'flex items-stretch gap-0.5 rounded-2xl border border-gray-200/50 bg-white/85 p-1 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.1),0_0_0_0.5px_rgba(0,0,0,0.05)] backdrop-blur-xl',
            className
          )}
        >
          {children}
        </div>
      </Tooltip.Provider>
    </ThemeSettingsPrimitive.Root>
  );
}
