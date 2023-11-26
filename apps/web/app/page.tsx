import { cookies } from 'next/headers';
import { Toaster } from 'sonner';
import { CopyEmailHtml } from '@/components/copy-email-html';
import { EditorPreview } from '@/components/editor-preview';
import { EnvelopeConfig } from '@/components/envelope-config';
import { PreviewEmail } from '@/components/preview-email';
import { SendTestEmail } from '@/components/send-test-email';
import { ENVELOPE_API_KEY, ENVELOPE_ENDPOINT } from '@/utils/constants';

export default function Home() {
  const cookieStore = cookies();
  const apiKey = cookieStore.get(ENVELOPE_API_KEY)?.value;
  const endpoint = cookieStore.get(ENVELOPE_ENDPOINT)?.value;

  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="flex items-center gap-1.5 justify-end mt-20">
        <SendTestEmail />
        <PreviewEmail />
        <CopyEmailHtml />
        <EnvelopeConfig apiKey={apiKey} endpoint={endpoint} />
      </div>
      <EditorPreview />
      <Toaster richColors />
    </div>
  );
}
