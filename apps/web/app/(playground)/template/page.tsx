import type { Metadata } from 'next';
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
import { ApiConfiguration } from '@/components/api-config';
import { SendTestEmail } from '@/components/send-test-email';
import { EditorTopbar } from '@/components/editor-topbar';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Templates - Playground',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function TemplatePage() {
  const cookieStore = cookies();
  const apiKey = cookieStore.get(MAILY_API_KEY)?.value;
  const endpoint = cookieStore.get(MAILY_ENDPOINT)?.value;
  const provider = cookieStore.get(MAILY_PROVIDER)?.value;

  return (
    <EditorProvider apiKey={apiKey} endpoint={endpoint} provider={provider}>
      <EditorTopbar showSaveButton={true} />
      <EditorPreview
        config={{
          autofocus: 'end',
        }}
      />
    </EditorProvider>
  );
}
