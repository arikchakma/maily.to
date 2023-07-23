import NextImage from 'next/image';
import NextLink from 'next/link';
import IconImage from '@/public/brand/icon.svg';
import { User } from '@supabase/supabase-js';
import { GithubIcon } from 'lucide-react';

import { cn } from '@/utils/classname';

import { MailListCombobox } from '../mail/mail-list-combobox';
import { SaveMailDialog } from '../mail/save-mail-dialog';
import { buttonVariants } from '../ui/button';
import { LogoutButton } from './logout-button';

type NavigationType = {
  user: User | null;
};

export function Navigation(props: NavigationType) {
  const { user } = props;
  return (
    <header className="mt-14">
      {!user ? (
        <div className="flex w-full items-center justify-between rounded-md border px-5 py-4">
          <div className="flex items-center gap-3">
            <picture className="hidden h-16 w-16 items-center justify-center sm:flex">
              <NextImage
                src={IconImage}
                alt="Icon"
                className="h-12 w-12"
                priority
              />
            </picture>
            <div>
              <NextLink
                href="/"
                className="text-2xl font-semibold tracking-tight text-gray-800"
              >
                maily.to
              </NextLink>
              <p>Editor to help you craft emails.</p>
            </div>
          </div>

          <a
            href="https://github.com/arikchakma/maily.to"
            target="_blank"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'ml-auto text-gray-600 hover:text-gray-800'
            )}
          >
            <GithubIcon className="h-6 w-6" />
          </a>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <MailListCombobox />
            <SaveMailDialog />
          </div>
        </>
      )}
    </header>
  );
}
