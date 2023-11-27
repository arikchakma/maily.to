import NextLink from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import { LogIn } from 'lucide-react';
import { SendTestEmail } from '@/components/send-test-email';
import { PreviewEmail } from '@/components/preview-email';
import { CopyEmailHtml } from '@/components/copy-email-html';
import { EditorPreview } from '@/components/editor-preview';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ApiConfiguration } from '@/components/api-config';

export default async function Playground() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/template');
  }

  return (
    <main className="mx-auto w-full max-w-[calc(36rem+40px)] px-5">
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
      <div className="mt-6 flex items-center gap-1.5">
        <ApiConfiguration />
        <PreviewEmail />
        <CopyEmailHtml />
        <SendTestEmail />
      </div>
      <EditorPreview />
    </main>
  );
}
