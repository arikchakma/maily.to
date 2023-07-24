import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { Database } from '@/types/database';
import { AppEditor } from '@/components/app-editor';
import { EditorSidebar } from '@/components/editor-sidebar';

export const dynamic = 'force-dynamic';

type EditorPageProps = {
  searchParams?: {
    t: string;
  }
}

export default async function EditorPage(props: EditorPageProps) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen w-screen items-stretch overflow-hidden">
      <EditorSidebar searchParams={props.searchParams} />

      <div className="mx-auto w-full max-w-[700px] overflow-y-auto p-5">
        <AppEditor searchParams={props.searchParams} />
      </div>
    </div>
  );
}
