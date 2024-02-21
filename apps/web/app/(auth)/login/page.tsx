import NextLink from 'next/link';
import type { Metadata } from 'next';
import { buttonVariants } from '@/components/ui/button';
import { GithubLoginButton } from '@/components/auth/github-login-button';
import { cn } from '@/utils/classname';
import { GoogleLoginButton } from '@/components/auth/google-login-button';
import { EmailLoginForm } from '@/components/auth/email-login-form';

export const metadata: Metadata = {
  title: 'Login - Maily',
  description: 'Login to your Maily account.',
  openGraph: {
    siteName: 'Maily',
    title: 'Login - Maily',
    description: 'Login to your Maily account.',
    type: 'website',
    url: 'https://maily.to',
    locale: 'en-US',
    images: {
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Maily Preview',
    },
  },
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
        <div className="mx-auto flex w-full flex-col justify-center sm:w-[360px]">
          <div className="mb-10 flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login / Register
            </h1>
            <p className="text-muted-foreground text-sm">
              You can continue with your GitHub / Google account.
            </p>
          </div>

          <EmailLoginForm />

          <div className="flex w-full items-center gap-2 py-6 text-sm text-gray-600">
            <div className="h-px w-full bg-gray-200" />
            OR
            <div className="h-px w-full bg-gray-200" />
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
