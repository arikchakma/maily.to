'use client';

import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Loader2, Trash } from 'lucide-react';
import { DialogClose } from '@radix-ui/react-dialog';
import { deleteEmailAction } from '@/actions/email';
import { useServerAction } from '@/utils/use-server-action';
import { catchActionError } from '@/actions/error';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface SubmitButtonProps {
  disabled?: boolean;
}

function SubmitButton(props: SubmitButtonProps) {
  const { disabled } = props;
  const { pending } = useFormStatus();

  return (
    <button
      className="flex min-h-[28px] items-center justify-center rounded-md bg-red-100 px-2 py-1 text-sm text-red-800 disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-7"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <Loader2
          className="inline-block shrink-0 animate-spin sm:mr-1"
          size={16}
        />
      ) : null}
      <span className="hidden sm:inline-block">Delete</span>
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

      window.location.href = '/template';
    }
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="flex min-h-[28px] items-center justify-center rounded-md bg-red-100 px-2 py-1 text-sm text-red-800 disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-7"
          type="button"
        >
          <Trash className="inline-block shrink-0 sm:mr-1" size={16} />
          Delete
        </button>
      </DialogTrigger>
      <DialogContent className="animation-none w-full max-w-[400px] p-5">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the email
            and remove data from our servers.
          </DialogDescription>
        </DialogHeader>
        <form action={action}>
          <input name="templateId" type="hidden" value={templateId} />
          <div className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <button
                className="flex min-h-[28px] items-center justify-center rounded-md bg-gray-100 px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-7"
                type="button"
              >
                Cancel
              </button>
            </DialogClose>
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
