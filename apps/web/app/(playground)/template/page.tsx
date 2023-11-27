import { cookies } from 'next/headers';
import { CopyEmailHtml } from '@/components/copy-email-html';
import { EditorPreview } from '@/components/editor-preview';
import { PreviewEmail } from '@/components/preview-email';
import { SaveEmail } from '@/components/save-email';
import { EditorProvider } from '@/stores/editor-store';
import {
  MAILY_API_KEY,
  MAILY_ENDPOINT,
  MAILY_PROVIDER,
} from '@/utils/constants';

export const dynamic = 'force-dynamic';

export default function TemplatePage() {
  const cookieStore = cookies();
  const apiKey = cookieStore.get(MAILY_API_KEY)?.value;
  const endpoint = cookieStore.get(MAILY_ENDPOINT)?.value;
  const provider = cookieStore.get(MAILY_PROVIDER)?.value;

  return (
    <EditorProvider apiKey={apiKey} endpoint={endpoint} provider={provider}>
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
