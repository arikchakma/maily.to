'use client';

import { useFormStatus } from 'react-dom';
import { Cog, Loader2, PlugZap } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { useServerAction } from '@/utils/use-server-action';
import { envelopeConfigAction } from '@/actions/config';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface SubmitButtonProps {
  disabled?: boolean;
}

function SubmitButton(props: SubmitButtonProps) {
  const { disabled } = props;
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md bg-black px-2 py-1 h-10 justify-center text-sm text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <Loader2 className="inline-block mr-1 animate-spin" size={16} />
      ) : (
        <PlugZap className="inline-block mr-1" size={16} />
      )}
      Save Changes
    </button>
  );
}

interface EnvelopeConfigProps {
  apiKey?: string;
  endpoint?: string;
}

export function EnvelopeConfig(props: EnvelopeConfigProps) {
  const { apiKey, endpoint } = props;

  const [isOpen, setIsOpen] = useState(false);

  const [action, isPending] = useServerAction(
    envelopeConfigAction,
    (result) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Result is always there
      const { error } = result!;
      if (error) {
        toast.error(error.message || 'Something went wrong');
        return;
      }

      toast.success('Envelope configuration saved');
      setIsOpen(false);
    }
  );

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <button
          className="w-7 h-7 flex items-center justify-center bg-black text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <Cog className="inline-block" size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="w-full min-w-0 max-w-sm overflow-hidden p-4 animation-none">
        <DialogHeader>
          <DialogTitle>Envelope Configuration</DialogTitle>
          <DialogDescription>
            Configure your Envelope API Key and Endpoint. These settings are
            saved in your browser.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="flex flex-col gap-2">
          <Label className="font-normal">
            <span className="w-20 after:content-['*'] after:text-red-400 after:ml-0.5">
              API Key
            </span>
            <Input
              className="font-normal mt-2"
              defaultValue={apiKey || ''}
              name="apiKey"
              placeholder="Envelope API Key"
              type="text"
            />
          </Label>
          <Label className="font-normal">
            <span className="w-20">Endpoint</span>
            <Input
              className="font-normal mt-2"
              defaultValue={endpoint || ''}
              name="endpoint"
              placeholder="Envelope API Endpoint"
              type="text"
            />
          </Label>

          <SubmitButton disabled={isPending} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
