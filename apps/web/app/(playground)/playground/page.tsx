import NextLink from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import { LogIn } from 'lucide-react';
import { SendTestEmail } from '@/components/send-test-email';
import { PreviewEmail } from '@/components/preview-email';
import { CopyEmailHtml } from '@/components/copy-email-html';
import { EnvelopeConfig } from '@/components/envelope-config';
import { EditorPreview } from '@/components/editor-preview';

export default function Home() {
  return (
    <main className="max-w-[calc(36rem+40px)] px-5 mx-auto w-full">
      <header className="mt-14 border-b pb-6">
        <p className="sm:text-lg">
          <Balancer>
            You can create an account to save email templates as well. It&apos;s
            free and easy to use.
          </Balancer>
        </p>

        <div className="mt-5 flex items-stretch gap-2">
          <NextLink
            className="rounded-md bg-black px-2 py-1 text-sm text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            href="/login"
          >
            <LogIn className="mr-1 inline-block" size={16} />
            Login / Register
          </NextLink>
        </div>
      </header>
      <div className="flex items-center gap-1.5 justify-end mt-6">
        <SendTestEmail />
        <PreviewEmail />
        <CopyEmailHtml />
        <EnvelopeConfig />
      </div>
      <EditorPreview />
    </main>
  );
}
