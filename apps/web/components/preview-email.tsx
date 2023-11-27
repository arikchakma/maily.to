'use client';

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
      className="rounded-md bg-black px-2 py-1 min-h-[28px] max-sm:w-7 justify-center text-sm text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <Loader2
          className="inline-block sm:mr-1 animate-spin shrink-0"
          size={16}
        />
      ) : (
        <Eye className="inline-block sm:mr-1 shrink-0" size={16} />
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
        <DialogContent className="min-h-[75vh] w-full min-w-0 max-w-[680px] overflow-hidden p-0 max-[680px]:h-full max-[680px]:rounded-none max-[680px]:shadow-none max-[680px]:border-0 animation-none">
          <EmailFrame className="h-full w-full" innerHTML={html} />
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
