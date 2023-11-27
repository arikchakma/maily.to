'use client';

import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/utils/classname';
import type { Database } from '@/types/database';
import { LogoutButton } from './auth/logout-button';
import { buttonVariants } from './ui/button';

export type MailsRowType = Database['public']['Tables']['mails']['Row'];

interface TemplateSidebarProps {
  mails: MailsRowType[];
}

export function TemplateSidebar(props: TemplateSidebarProps) {
  const { mails } = props;
  const { templateId } = useParams();

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
        {mails.length === 0 ? (
          <p className="text-center text-sm">No Saved Emails</p>
        ) : (
          <ul className="space-y-0.5 px-1">
            {mails.map((template) => {
              return (
                <li key={template.id}>
                  <NextLink
                    className={cn(
                      'text-sm px-2 py-1.5 rounded-md hover:bg-gray-100',
                      'h-auto w-full flex items-center min-w-0 font-medium',
                      templateId === template.id ? 'bg-gray-100' : ''
                    )}
                    href={`/template/${template.id}`}
                  >
                    <span className="truncate block">{template.title}</span>
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
