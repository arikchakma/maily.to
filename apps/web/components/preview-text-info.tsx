import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function PreviewTextInfo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info className="w-3.5 h-3.5 text-gray-500" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm text-gray-600">
            The preview text is the snippet of text that is pulled into the{' '}
            <u>inbox preview</u> of an email client, usually right after the
            subject line.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
