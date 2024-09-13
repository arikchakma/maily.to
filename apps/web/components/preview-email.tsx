'use client';

// @ts-ignore
import { useFormStatus } from 'react-dom';
import { Eye, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { shallow } from 'zustand/shallow';
import { previewEmailAction } from '@/actions/email';
import { useServerAction } from '@/utils/use-server-action';
import { useEditorContext } from '@/stores/editor-store';
import { catchActionError } from '@/actions/error';
import { EmailFrame } from './email-frame';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

interface SubmitButtonProps {
  disabled?: boolean;
}

function SubmitButton(props: SubmitButtonProps) {
  const { disabled } = props;
  const { pending } = useFormStatus();

  return (
    <button
      className="flex min-h-[28px] items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-7"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <Loader2
          className="inline-block shrink-0 animate-spin sm:mr-1"
          size={16}
        />
      ) : (
        <Eye className="inline-block shrink-0 sm:mr-1" size={16} />
      )}
      <span className="hidden sm:inline-block">Preview Email</span>
    </button>
  );
}

export function PreviewEmail() {
  const { json, previewText } = useEditorContext((s) => {
    return {
      json: s.json,
      previewText: s.previewText,
    };
  }, shallow);

  const [html, setHtml] = useState<string>('');
  const [action, isPending] = useServerAction(
    catchActionError(previewEmailAction),
    (result) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Result is always there
      const { data, error } = result!;
      if (error) {
        toast.error(error.message || 'Something went wrong');
        return;
      }
      setHtml(data);
    }
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <form action={action}>
          <input name="json" type="hidden" value={JSON.stringify(json) || ''} />
          <input name="previewText" type="hidden" value={previewText} />
          <SubmitButton disabled={!json} />
        </form>
      </DialogTrigger>
      {!isPending ? (
        <DialogContent className="animation-none min-h-[75vh] w-full min-w-0 max-w-[680px] overflow-hidden p-0 max-[680px]:h-full max-[680px]:rounded-none max-[680px]:border-0 max-[680px]:shadow-none">
          <EmailFrame className="h-full w-full" innerHTML={html} />
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
