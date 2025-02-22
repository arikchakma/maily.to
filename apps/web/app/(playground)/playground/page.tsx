import type { Metadata } from 'next';
import NextLink from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import { LogIn } from 'lucide-react';
import { redirect } from 'next/navigation';
import { SendTestEmail } from '@/components/send-test-email';
import { PreviewEmail } from '@/components/preview-email';
import { CopyEmailHtml } from '@/components/copy-email-html';
import { EditorPreview } from '@/components/editor-preview';
import { ApiConfiguration } from '@/components/api-config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { EditorTopbar } from '@/components/editor-topbar';

export const metadata: Metadata = {
  title: 'Playground | Maily',
  description: 'Try out Maily, the Open-source editor for crafting emails.',
  twitter: {
    creator: '@imarikchakma',
    title: 'Playground | Maily',
    description: 'Try out Maily, the Open-source editor for crafting emails.',
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    siteName: 'Maily',
    title: 'Playground | Maily',
    description: 'Try out Maily, the Open-source editor for crafting emails.',
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

export default async function Playground() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/template');
  }

  return (
    <main className="mx-auto w-full max-w-[calc(600px+40px)] px-5">
      <header className="mt-14 border-b pb-6">
        <p className="sm:text-lg">
          <Balancer>
            You can create an account to save email templates as well. It&apos;s
            free and easy to use.
          </Balancer>
        </p>

        <div className="mt-5 flex items-stretch gap-2">
          <NextLink
            className="flex items-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            href="/login"
          >
            <LogIn className="mr-1 inline-block" size={16} />
            Login / Register
          </NextLink>
        </div>
      </header>
      <EditorTopbar className="mt-6" />
      <EditorPreview />
    </main>
  );
}
