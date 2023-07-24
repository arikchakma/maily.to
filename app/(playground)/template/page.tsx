import { AppEditor } from '@/components/app-editor';
import { EditorPreview } from '@/components/editor-preview';
import { EditorSidebar } from '@/components/editor-sidebar';
import { Database } from '@/types/database';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditorPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex w-screen h-screen items-stretch overflow-hidden">
      <EditorSidebar />

      <div className="mx-auto max-w-[700px] p-5 w-full overflow-y-auto">
        <AppEditor />
      </div>
    </div>
  );
}
