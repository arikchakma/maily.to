'use client';

import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { FileCog, Loader2 } from 'lucide-react';
import { shallow } from 'zustand/shallow';
import { updateEmailAction } from '@/actions/email';
import { useServerAction } from '@/utils/use-server-action';
import { useEditorContext } from '@/stores/editor-store';
import { catchActionError } from '@/actions/error';

interface SubmitButtonProps {
  disabled?: boolean;
}

function SubmitButton(props: SubmitButtonProps) {
  const { disabled } = props;
  const { pending } = useFormStatus();

  return (
    <button
      className="flex items-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <Loader2 className="mr-1 inline-block animate-spin" size={16} />
      ) : (
        <FileCog className="mr-1 inline-block" size={16} />
      )}
      Update
    </button>
  );
}

interface SaveEmailProps {
  templateId: string;
}

export function UpdateEmail(props: SaveEmailProps) {
  const { templateId } = props;

  const { json, previewText, subject } = useEditorContext((s) => s, shallow);

  const [action] = useServerAction(
    catchActionError(updateEmailAction),
    (result) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Result is always there
      const { error } = result!;
      if (error) {
        toast.error(error.message || 'Something went wrong');
        return;
      }

      toast.success('Email has been updated');
    }
  );

  return (
    <form action={action}>
      <input name="templateId" type="hidden" value={templateId} />
      <input name="subject" type="hidden" value={subject} />
      <input name="json" type="hidden" value={JSON.stringify(json) || ''} />
      <input name="previewText" type="hidden" value={previewText} />
      <SubmitButton />
    </form>
  );
}
