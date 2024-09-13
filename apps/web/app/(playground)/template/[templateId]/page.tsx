import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { JSONContent } from '@tiptap/core';
import {
  MAILY_API_KEY,
  MAILY_ENDPOINT,
  MAILY_PROVIDER,
} from '@/utils/constants';
import { EditorPreview } from '@/components/editor-preview';
import type { Database } from '@/types/database';
import { EditorProvider } from '@/stores/editor-store';
import { PreviewEmail } from '@/components/preview-email';
import { CopyEmailHtml } from '@/components/copy-email-html';
import { UpdateEmail } from '@/components/update-email';
import { DeleteEmail } from '@/components/delete-email';
import { ApiConfiguration } from '@/components/api-config';
import { SendTestEmail } from '@/components/send-test-email';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

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

interface TemplatePageProps {
  params?: {
    templateId: string;
  };
}

export default async function TemplatePage(props: TemplatePageProps) {
  const { templateId } = props.params || {};

  const cookieStore = cookies();
  const apiKey = cookieStore.get(MAILY_API_KEY)?.value;
  const endpoint = cookieStore.get(MAILY_ENDPOINT)?.value;
  const provider = cookieStore.get(MAILY_PROVIDER)?.value;

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  if (!templateId) {
    return redirect('/template');
  }

  const { data: template } = await supabase
    .from('mails')
    .select('*')
    .eq('id', templateId)
    .eq('user_id', user.id)
    .single();

  if (!template) {
    return redirect('/template');
  }

  const { preview_text, title } = template;
  let { content } = template;
  content = JSON.parse(content as string);

  return (
    <EditorProvider
      apiKey={apiKey}
      endpoint={endpoint}
      provider={provider}
      // eslint-disable-next-line camelcase, react/jsx-sort-props -- This is a prop
      previewText={preview_text || ''}
      subject={title || ''}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <ApiConfiguration />
          <PreviewEmail />
          <CopyEmailHtml />
          <SendTestEmail />
        </div>
        <div className="flex items-center gap-1.5">
          <DeleteEmail templateId={templateId} />
          <UpdateEmail templateId={templateId} />
        </div>
      </div>
      <EditorPreview
        config={{
          autofocus: 'end',
        }}
        content={content as JSONContent}
      />
    </EditorProvider>
  );
}
