'use client';

import { useRouter } from 'next/navigation';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import { Loader2 } from 'lucide-react';

import { appEditorAtom, subjectAtom } from '@/lib/editor-atom';
import { cn } from '@/utils/classname';
import { fetcher, QueryError } from '@/utils/fetcher';
import { MailsRowType } from '@/app/(playground)/playground/page';

import { Button, buttonVariants } from './ui/button';
import NextLink from 'next/link'

type EditorSidebarProps = {
  params?: {
    templateId: string;
  };
};

export function EditorSidebar(props: EditorSidebarProps) {
  const editor = useAtomValue(appEditorAtom);
  const setSubject = useSetAtom(subjectAtom);

  const { templateId } = props.params || {};
  const router = useRouter();

  const { data, status } = useQuery<
    PostgrestSingleResponse<MailsRowType[]>,
    QueryError
  >({
    queryKey: ['templates'],
    queryFn: () => fetcher('/api/v1/get-list-templates'),
  });

  return (
    <aside className="w-[225px] shrink-0 border-r">
      <Button
        className="w-full rounded-none border-none"
        variant="outline"
        onClick={() => {
          setSubject('');
          editor?.commands.setContent('');
          router.replace(`/template`);
        }}
      >
        + New Email
      </Button>

      <div className="border-t py-2">
        {status === 'loading' && (
          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
        )}
        {data?.data?.length === 0 ? (
          <p className="text-center text-sm">No Saved Emails</p>
        ) : (
          <ul className="space-y-0.5 px-1">
            {data?.data?.map((template) => {
              return (
                <li key={template.id}>
                  <NextLink
                    className={cn(
                      buttonVariants({ variant: 'ghost' }),
                      'w-full justify-start',
                      templateId === template.id ? 'bg-gray-100' : ''
                    )}
                    href={`/template/${template.id}`}
                  >
                    {template.title}
                  </NextLink>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
