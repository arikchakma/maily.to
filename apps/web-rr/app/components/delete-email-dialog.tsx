import { DialogClose } from '@radix-ui/react-dialog';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon, Trash2Icon } from 'lucide-react';
import { useNavigate, useRevalidator } from 'react-router';
import { httpDelete } from '~/lib/http';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

type DeleteEmailDialogProps = {
  templateId: string;
};

export function DeleteEmailDialog(props: DeleteEmailDialogProps) {
  const { templateId } = props;

  const revalidator = useRevalidator();
  const navigate = useNavigate();

  const { mutate: deleteTemplate, isPending: isDeleteTemplatePending } =
    useMutation({
      mutationFn: async () => {
        return httpDelete(`/api/v1/templates/${templateId}`);
      },
      onSettled: () => {
        revalidator.revalidate();
      },
      onSuccess: () => {
        navigate('/templates');
      },
    });

  return (
    <Dialog>
      <DialogTrigger
        className="flex min-h-[28px] cursor-pointer items-center justify-center rounded-md bg-red-100 px-2 py-1 text-sm text-red-800 disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-7"
        disabled={isDeleteTemplatePending}
      >
        {isDeleteTemplatePending ? (
          <Loader2Icon className="inline-block size-4 shrink-0 animate-spin sm:mr-1" />
        ) : (
          <Trash2Icon className="inline-block size-4 shrink-0 sm:mr-1" />
        )}
        <span className="hidden sm:inline-block">Delete</span>
      </DialogTrigger>

      <DialogContent className="w-full max-w-xs p-4">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the email
            and remove data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2">
          <DialogClose>
            <button
              className="flex min-h-[28px] w-full cursor-pointer items-center justify-center rounded-md bg-gray-100 px-2 py-1.5 text-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={isDeleteTemplatePending}
            >
              Cancel
            </button>
          </DialogClose>
          <button
            className="flex min-h-[28px] w-full cursor-pointer items-center justify-center rounded-md bg-black px-2 py-1.5 text-sm text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-7"
            type="button"
            disabled={isDeleteTemplatePending}
            onClick={() => deleteTemplate()}
          >
            {isDeleteTemplatePending ? (
              <Loader2Icon className="inline-block size-4 shrink-0 animate-spin sm:mr-1" />
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
