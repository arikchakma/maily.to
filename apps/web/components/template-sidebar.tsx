'use client';

import NextLink from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FilePlus2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils/classname';
import type { Database } from '@/types/database';
import { duplicateEmailAction } from '@/actions/email';
import { LogoutButton } from './auth/logout-button';
import { buttonVariants } from './ui/button';

export type MailsRowType = Database['public']['Tables']['mails']['Row'];

interface TemplateSidebarProps {
  mails: MailsRowType[];
}

export function TemplateSidebar(props: TemplateSidebarProps) {
  const { mails } = props;
  const { templateId } = useParams();
  const router = useRouter();

  const handleEmailDuplicate = (oldTemplateId: string) => {
    const template = mails.find((mail) => mail.id === oldTemplateId);

    const formData = new FormData();
    formData.set('templateId', oldTemplateId);

    toast.promise(duplicateEmailAction(formData), {
      loading: `Duplicating ${template?.title}...`,
      success(data) {
        router.push(`/template/${data.data?.id}`);
        return 'Template Duplicated';
      },
      error(error: Error) {
        return error.message;
      },
    });
  };

  return (
    <aside className="flex w-[225px] shrink-0 flex-col border-r pb-2 max-lg:w-[180px]">
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
                <li
                  className="group relative flex items-center"
                  key={template.id}
                >
                  <NextLink
                    className={cn(
                      'rounded-md px-2 py-1.5 pr-7 text-sm hover:bg-gray-100',
                      'flex h-auto w-full min-w-0 items-center font-medium',
                      templateId === template.id ? 'bg-gray-100' : ''
                    )}
                    href={`/template/${template.id}`}
                  >
                    <span className="block truncate">{template.title}</span>
                  </NextLink>
                  <button
                    className="absolute right-0 mr-1.5 hidden group-hover:block"
                    onClick={() => {
                      handleEmailDuplicate(template.id);
                    }}
                    type="button"
                  >
                    <FilePlus2 className="h-4 w-4 shrink-0" />
                  </button>
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
