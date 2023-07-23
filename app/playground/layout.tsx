import { cookies } from 'next/headers';
import NextLink from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { ArrowLeft, LogIn } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { Navigation } from '@/components/auth/navigation';
import { UserMenu } from '@/components/user-menu';
import { cn } from '@/utils/classname';

export const dynamic = 'force-dynamic';

type PlaygroundLayoutProps = {
  children: React.ReactNode;
};

export const metadata = {
  title: 'Playground - Maily',
};

export default async function PlaygroundLayout(props: PlaygroundLayoutProps) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="pb-10">
      <div className="mx-auto flex max-w-[680px] flex-col px-5 md:px-10">
        <div className="mt-4 flex items-center justify-between">
          <NextLink
            href="/"
            className={cn(buttonVariants({ variant: 'ghost' }), 'gap-2')}
          >
            <ArrowLeft size={16} /> Go back
          </NextLink>

          {user ? (
            <UserMenu user={user} />
          ) : (
            <NextLink
              href="/login"
              className={cn(buttonVariants({ variant: 'ghost' }), 'gap-2')}
            >
              Login <LogIn size={16} />
            </NextLink>
          )}
        </div>

        <Navigation user={user} />
        {props.children}
      </div>
    </div>
  );
}
