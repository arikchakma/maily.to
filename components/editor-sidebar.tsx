'use client';

import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { fetcher, QueryError } from '@/utils/fetcher';
import { MailsRowType } from '@/app/(playground)/playground/page';

import { Button } from './ui/button';
import { useAtomValue, useSetAtom } from 'jotai';
import { appEditorAtom, subjectAtom } from '@/lib/editor-atom';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/classname';

type EditorSidebarProps = {
  searchParams?: {
    t: string;
  }
};

export function EditorSidebar(props: EditorSidebarProps) {
  const editor = useAtomValue(appEditorAtom)
  const setSubject = useSetAtom(subjectAtom)

  const { t: templateId } = props.searchParams || {}
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
      <Button className="w-full rounded-none border-none" variant="outline"
        onClick={() => {
          setSubject('')
          editor?.commands.setContent('')
          router.replace(`/template`)
        }}
      >
        + New Email
      </Button>

      <div className="border-t py-2">
        {status === 'loading' && (
          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
        )}
        {data?.data?.length === 0 ? (
          <p className="text-sm text-center">No Saved Emails</p>
        ) : (
          <ul className="px-1">
            {data?.data?.map((template) => {
              return <li key={template.id}>
                <Button variant="ghost" className={cn("w-full justify-start",
                  templateId === template.id ? 'bg-gray-100' : ''
                )}
                  onClick={() => {
                    setSubject(template.title)
                    editor?.commands.setContent(JSON.parse(template.content as string))
                    router.replace(`/template?t=${template.id}`)
                  }}
                >
                  {template.title}
                </Button>
              </li>;
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
