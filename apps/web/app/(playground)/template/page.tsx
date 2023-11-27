import { cookies } from 'next/headers';
import { CopyEmailHtml } from '@/components/copy-email-html';
import { EditorPreview } from '@/components/editor-preview';
import { PreviewEmail } from '@/components/preview-email';
import { SaveEmail } from '@/components/save-email';
import { EditorProvider } from '@/stores/editor-store';
import { ENVELOPE_API_KEY, ENVELOPE_ENDPOINT } from '@/utils/constants';

export const dynamic = 'force-dynamic';

export default function TemplatePage() {
  const cookieStore = cookies();
  const apiKey = cookieStore.get(ENVELOPE_API_KEY)?.value;
  const endpoint = cookieStore.get(ENVELOPE_ENDPOINT)?.value;

  return (
    <EditorProvider apiKey={apiKey} endpoint={endpoint}>
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 mt-6">
          <PreviewEmail />
          <CopyEmailHtml />
        </div>
        <SaveEmail />
      </div>
      <EditorPreview
        config={{
          autofocus: 'end',
        }}
      />
    </EditorProvider>
  );
}
