import NextLink from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { GithubLoginButton } from '@/components/auth/github-login-button';
import { cn } from '@/utils/classname';

export const metadata = {
  title: 'Sign Up - Maily',
};

type Props = {
  searchParams: {
    code?: string;
  };
};

export default async function SignupPage(props: Props) {
  const { code } = props.searchParams;
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center sm:grid lg:max-w-none lg:px-0">
      <NextLink
        prefetch={false}
        href="/login"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        Log in
      </NextLink>
      <NextLink
        prefetch={false}
        href="/playground"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-4 top-4 md:left-8 md:top-8'
        )}
      >
        Playground
      </NextLink>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your email below to create your account
            </p>
          </div>

          <GithubLoginButton code={code} />
        </div>
      </div>
    </div>
  );
}
