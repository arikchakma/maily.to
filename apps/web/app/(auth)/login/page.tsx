import NextLink from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { GithubLoginButton } from '@/components/auth/github-login-button';
import { cn } from '@/utils/classname';
import { GoogleLoginButton } from '@/components/auth/google-login-button';

export const metadata = {
  title: 'Login - Maily',
};

export default function LoginPage() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center sm:grid lg:max-w-none lg:px-0">
      <NextLink
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-4 top-4 md:left-8 md:top-8'
        )}
        href="/playground"
        prefetch={false}
      >
        Playground
      </NextLink>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[360px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login / Register
            </h1>
            <p className="text-muted-foreground text-sm">
              You can continue with your GitHub / Google account.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <GithubLoginButton />
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </div>
  );
}
