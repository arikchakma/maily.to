import { SendTestEmail } from '@/components/send-test-email';
import { PreviewEmail } from '@/components/preview-email';
import { CopyEmailHtml } from '@/components/copy-email-html';
import { EnvelopeConfig } from '@/components/envelope-config';
import { EditorPreview } from '@/components/editor-preview';

export default function Home() {
  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="flex items-center gap-1.5 justify-end mt-20">
        <SendTestEmail />
        <PreviewEmail />
        <CopyEmailHtml />
        <EnvelopeConfig />
      </div>
      <EditorPreview />
    </div>
  );
}
