import NextLink from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { GithubLoginButton } from '@/components/auth/github-login-button';
import { cn } from '@/utils/classname';

export const metadata = {
  title: 'Login - Maily',
};

type Props = {
  searchParams: {
    code?: string;
  };
};

export default async function LoginPage(props: Props) {
  const { code } = props.searchParams;
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center sm:grid lg:max-w-none lg:px-0">
      <NextLink
        prefetch={false}
        href="/signup"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        Sign up
      </NextLink>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to your account
            </h1>
            <p className="text-muted-foreground text-sm">
              Welcome back! Let&apos;s take you to your account.
            </p>
          </div>

          <GithubLoginButton code={code} />
        </div>
      </div>
    </div>
  );
}
