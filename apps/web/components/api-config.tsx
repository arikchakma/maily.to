'use client';

import { useFormStatus } from 'react-dom';
import { Cog, Loader2, PlugZap } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useServerAction } from '@/utils/use-server-action';
import { envelopeConfigAction } from '@/actions/config';
import { useEditorContext } from '@/stores/editor-store';
import { catchActionError } from '@/actions/error';
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

export function ApiConfiguration() {
  const { apiKey, endpoint, setApiKey, setEndpoint } = useEditorContext((s) => {
    return {
      apiKey: s.apiKey,
      endpoint: s.endpoint,
      setApiKey: s.setApiKey,
      setEndpoint: s.setEndpoint,
    };
  }, shallow);

  const [isOpen, setIsOpen] = useState(false);

  const [action, isPending] = useServerAction(
    catchActionError(envelopeConfigAction),
    (result) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Result is always there
      const { error, data } = result!;
      if (error) {
        toast.error(error.message || 'Something went wrong');
        return;
      }

      toast.success('Envelope configuration saved');
      setApiKey(data.apiKey);
      setEndpoint(data.endpoint);
      setIsOpen(false);
    }
  );

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <button
          className="w-7 h-7 flex items-center justify-center bg-gray-100 text-black border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 duration-200"
          type="button"
        >
          <Cog className="inline-block" size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="w-full min-w-0 max-w-sm overflow-hidden p-4 animation-none">
        <DialogHeader>
          <DialogTitle>Configuration</DialogTitle>
          <DialogDescription>
            Configure your Provider API Key and Endpoint(if any). These settings
            are saved in your browser.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="flex flex-col gap-2.5 mt-2">
          <Label className="font-normal">
            <span className="w-20 after:content-['*'] after:text-red-400 after:ml-0.5">
              Provider
            </span>
            <select
              className="font-normal mt-2 flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-800"
              name="provider"
              required
            >
              <option value="resend">Resend</option>
            </select>
          </Label>
          <Label className="font-normal">
            <span className="w-20 after:content-['*'] after:text-red-400 after:ml-0.5">
              API Key
            </span>
            <Input
              className="font-normal mt-2"
              defaultValue={apiKey || ''}
              name="apiKey"
              placeholder="API Key"
              required
              spellCheck={false}
              type="text"
            />
          </Label>
          <Label className="font-normal">
            <span className="w-20">Endpoint</span>
            <Input
              className="font-normal mt-2"
              defaultValue={endpoint || ''}
              name="endpoint"
              placeholder="API Endpoint"
              spellCheck={false}
              type="text"
            />
          </Label>

          <SubmitButton disabled={isPending} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
