'use client';

import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Loader2, Trash } from 'lucide-react';
import { redirect } from 'next/navigation';
import { deleteEmailAction } from '@/actions/email';
import { useServerAction } from '@/utils/use-server-action';
import { catchActionError } from '@/actions/error';

interface SubmitButtonProps {
  disabled?: boolean;
}

function SubmitButton(props: SubmitButtonProps) {
  const { disabled } = props;
  const { pending } = useFormStatus();

  return (
    <button
      className="flex items-center rounded-md bg-red-100 px-2 py-1 text-sm text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <Loader2 className="mr-1 inline-block animate-spin" size={16} />
      ) : (
        <Trash className="mr-1 inline-block" size={16} />
      )}
      Delete
    </button>
  );
}

interface SaveEmailProps {
  templateId: string;
}

export function DeleteEmail(props: SaveEmailProps) {
  const { templateId } = props;

  const [action] = useServerAction(
    catchActionError(deleteEmailAction),
    (result) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Result is always there
      const { error } = result!;
      if (error) {
        toast.error(error.message || 'Something went wrong');
        return;
      }

      return redirect('/template');
    }
  );

  return (
    <form action={action}>
      <input name="templateId" type="hidden" value={templateId} />
      <SubmitButton />
    </form>
  );
}
