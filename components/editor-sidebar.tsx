'use client';

import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { cn } from '@/utils/classname';
import { fetcher, QueryError } from '@/utils/fetcher';
import { MailsRowType } from '@/app/(playground)/playground/page';

import { LogoutButton } from './auth/logout-button';
import { buttonVariants } from './ui/button';

type EditorSidebarProps = {};

export function EditorSidebar() {
  const { templateId } = useParams();

  const { data, status } = useQuery<
    PostgrestSingleResponse<MailsRowType[]>,
    QueryError
  >({
    queryKey: ['templates'],
    queryFn: () => fetcher('/api/v1/get-list-templates'),
  });

  return (
    <aside className="flex w-[225px] shrink-0 flex-col border-r pb-2">
      <NextLink
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'w-full rounded-none border-none'
        )}
        href="/template"
      >
        + New Email
      </NextLink>

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
                      'h-auto min-h-[40px] w-full justify-start',
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
      <div className="mt-auto px-1">
        <LogoutButton />
      </div>
    </aside>
  );
}
