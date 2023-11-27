'use client';

import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Loader2, Trash } from 'lucide-react';
import { redirect } from 'next/navigation';
import { deleteEmailAction } from '@/actions/email';
import { useServerAction } from '@/utils/use-server-action';

interface SubmitButtonProps {
  disabled?: boolean;
}

function SubmitButton(props: SubmitButtonProps) {
  const { disabled } = props;
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md bg-red-100 px-2 py-1 text-sm text-red-800 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <Loader2 className="inline-block mr-1 animate-spin" size={16} />
      ) : (
        <Trash className="inline-block mr-1" size={16} />
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

  const [action] = useServerAction(deleteEmailAction, (result) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Result is always there
    const { error } = result!;
    if (error) {
      toast.error(error.message || 'Something went wrong');
      return;
    }

    return redirect('/template');
  });

  return (
    <form action={action}>
      <input name="templateId" type="hidden" value={templateId} />
      <SubmitButton />
    </form>
  );
}
