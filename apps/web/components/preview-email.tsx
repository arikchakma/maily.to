'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { Editor as TiptapEditor, JSONContent } from '@tiptap/core';
import { Eye, Loader2 } from 'lucide-react';
import { previewEmailAction } from '@/actions/email';
import { EmailFrame } from './email-frame';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

interface PreviewEmailProps {
  editor?: TiptapEditor;
  json: JSONContent;
  previewText: string;
}

interface SubmitButtonProps {
  disabled?: boolean;
}

function SubmitButton(props: SubmitButtonProps) {
  const { disabled } = props;
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md bg-black px-2 py-1 text-sm text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <Loader2 className="inline-block mr-1 animate-spin" size={16} />
      ) : (
        <Eye className="inline-block mr-1" size={16} />
      )}
      Preview Email
    </button>
  );
}

export function PreviewEmail(props: PreviewEmailProps) {
  const { editor, previewText, json } = props;
  const [html, formAction] = useFormState(previewEmailAction, null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <form action={formAction} key={JSON.stringify(json)}>
          <input name="json" type="hidden" value={JSON.stringify(json) || ''} />
          <input name="previewText" type="hidden" value={previewText} />
          <SubmitButton disabled={!editor} />
        </form>
      </DialogTrigger>
      {html ? (
        <DialogContent className="min-h-[75vh] w-full min-w-0 max-w-[680px] overflow-hidden p-0 max-[680px]:h-full max-[680px]:rounded-none max-[680px]:shadow-none max-[680px]:border-0">
          <EmailFrame className="h-full w-full" innerHTML={html} key={html} />
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
