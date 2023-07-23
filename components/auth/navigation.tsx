import NextLink from 'next/link';
import { User } from '@supabase/supabase-js';
import { MailListCombobox } from '../mail/mail-list-combobox';
import { SaveMailDialog } from '../mail/save-mail-dialog';
import { Balancer } from 'react-wrap-balancer';

type NavigationType = {
  user: User | null;
};

export function Navigation(props: NavigationType) {
  const { user } = props;
  return (
    <header className="mt-14">
      {!user ? (
        <div className="rounded-md border px-5 py-4">
          <p className="text-lg">
            <Balancer>
              You can create an account to save email templates as well. It&apos;s free and easy to use.
            </Balancer>
          </p>

          <div className="flex items-stretch gap-2 mt-5">
            <NextLink
              href="/login"
              className="flex items-center justify-center gap-3 rounded-xl bg-black px-4 py-1.5 font-medium text-white transition-all hover:bg-red-500 focus:outline-0"
            >
              Login
            </NextLink>
            <NextLink
              href="/signup"
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-1.5 font-medium text-black transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white focus:outline-0"
            >
              Sign up
            </NextLink>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center sm:justify-between gap-3">
            <MailListCombobox />
            <SaveMailDialog />
          </div>
        </>
      )
      }
    </header >
  );
}
