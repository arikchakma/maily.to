import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { Database } from '@/types/database';
import { AppEditor } from '@/components/app-editor';
import { EditorSidebar } from '@/components/editor-sidebar';

export const dynamic = 'force-dynamic';

type EditorPageProps = {
  params?: {
    templateId: string;
  };
};

export default async function TemplatePage(props: EditorPageProps) {
  const { templateId } = props.params || {};
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  if (!templateId) {
    redirect('/template');
  }

  const { data: template } = await supabase
    .from('mails')
    .select('*')
    .eq('id', templateId)
    .single();

  if (!template) {
    redirect('/template');
  }

  return (
    <div className="flex h-screen w-screen items-stretch overflow-hidden">
      <EditorSidebar params={props.params} />

      <div className="grow overflow-y-auto">
        <div className="mx-auto w-full max-w-[700px] p-5">
          <AppEditor params={props.params} />
        </div>
      </div>
    </div>
  );
}
