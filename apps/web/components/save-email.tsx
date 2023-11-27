'use client';

import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { shallow } from 'zustand/shallow';
import { redirect } from 'next/navigation';
import { saveEmailAction } from '@/actions/email';
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
      className="rounded-md bg-black px-2 py-1 text-sm text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <Loader2 className="inline-block mr-1 animate-spin" size={16} />
      ) : (
        <Save className="inline-block mr-1" size={16} />
      )}
      Save
    </button>
  );
}

export function SaveEmail() {
  const { json, previewText, subject } = useEditorContext((s) => s, shallow);

  const [action] = useServerAction(
    catchActionError(saveEmailAction),
    (result) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Result is always there
      const { error, data } = result!;
      if (error) {
        toast.error(error.message || 'Something went wrong');
        return;
      }

      return redirect(`/template/${data.id}`);
    }
  );

  return (
    <form action={action}>
      <input name="subject" type="hidden" value={subject} />
      <input name="json" type="hidden" value={JSON.stringify(json) || ''} />
      <input name="previewText" type="hidden" value={previewText} />
      <SubmitButton />
    </form>
  );
}
