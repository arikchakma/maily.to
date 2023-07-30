import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { Database } from '@/types/database';
import { AppEditor } from '@/components/app-editor';

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
    .eq('user_id', user.id)
    .single();

  if (!template) {
    redirect('/template');
  }

  return (
    <AppEditor params={props.params} template={template} />
  );
}
