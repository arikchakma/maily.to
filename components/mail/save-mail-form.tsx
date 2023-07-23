'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { editorAtom } from '@/lib/editor-atom';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { fetcher, QueryError } from '@/utils/fetcher';

import { useToast } from '../editor/hooks/use-toast';

const formSchema = z.object({
  title: z.string().trim().min(3).max(255),
});

type SaveMailFormProps = {
  onSave?: () => void;
};

export function SaveMailForm(props: SaveMailFormProps) {
  const { onSave } = props;
  const editor = useAtomValue(editorAtom);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const saveMail = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetcher('/api/v1/save-mail', {
        method: 'POST',
        body: JSON.stringify({
          ...values,
          content: editor?.getEditor().getJSON() ?? '{}',
        }),
      });
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries(['mails']);
      onSave?.();
    },
    onError: (error: QueryError) => {
      toast({
        variant: 'destructive',
        title: 'Error saving mail',
        description: error?.message ?? 'Something went wrong',
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    saveMail.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Welcome mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}
