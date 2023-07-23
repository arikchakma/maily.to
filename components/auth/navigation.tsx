import NextImage from 'next/image';
import NextLink from 'next/link';
import IconImage from '@/public/brand/icon.svg';
import { User } from '@supabase/supabase-js';

import { LogoutButton } from './logout-button';
import { GithubIcon } from 'lucide-react';
import { cn } from '@/utils/classname';
import { buttonVariants } from '../ui/button';

type NavigationType = {
  user: User | null;
};

export async function Navigation(props: NavigationType) {
  const { user } = props;
  return (
    <header className="mt-14 rounded-md border">
      {!user ? (
        <div className="flex w-full items-center justify-between px-5 py-4">
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
          <div className="flex w-full items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <picture className="relative hidden h-16 w-16 items-center justify-center overflow-hidden rounded-md sm:flex">
                <NextImage
                  src={user?.user_metadata?.avatar_url || IconImage}
                  alt="Icon"
                  className="absolute inset-0 h-full w-full object-cover"
                  priority
                  fill
                />
              </picture>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-gray-800">
                  {user?.user_metadata?.full_name || user?.email}
                </h2>
                <p>{user?.email}</p>
              </div>
            </div>
            <LogoutButton />
          </div>
          <div className="border-t px-5 py-4">Hello</div>
        </>
      )}
    </header>
  );
}
