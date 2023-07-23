import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, TrashIcon } from 'lucide-react';

import { fetcher, QueryError } from '@/utils/fetcher';

import { useToast } from '../editor/hooks/use-toast';
import { Button } from '../ui/button';

type MailDeleteButtonProps = {
  mailId: string;
  onDelete?: () => void;
};

export function MailDeleteButton(props: MailDeleteButtonProps) {
  const { mailId, onDelete } = props;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMail = useMutation({
    mutationFn: () => {
      return fetcher(`/api/v1/delete-mail/${mailId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mails']);
      toast({
        description: 'Mail deleted successfully',
      });
      onDelete?.();
    },
    onError: (error: QueryError) => {
      toast({
        variant: 'destructive',
        title: 'Unable to delete mail',
        description: error?.message || 'Something went wrong',
      });
    },
  });
  return (
    <Button
      disabled={deleteMail.isLoading}
      variant="secondary"
      className="h-6 w-6 bg-red-400 p-0 text-white hover:bg-red-500"
      onClick={(e) => {
        e.stopPropagation();
        deleteMail.mutate();
      }}
    >
      {deleteMail.isLoading ? (
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
      ) : (
        <TrashIcon className="h-3.5 w-3.5 shrink-0" />
      )}
    </Button>
  );
}
