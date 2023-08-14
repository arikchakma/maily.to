import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { Database } from '@/types/database';
import { EditorSidebar } from '@/components/editor-sidebar';

export const dynamic = 'force-dynamic';

type PlaygroundLayoutProps = {
  children: React.ReactNode;
  params?: {
    templateId: string;
  };
};

export const metadata = {
  title: 'Templates - Playground',
};

export default async function PlaygroundLayout(props: PlaygroundLayoutProps) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/playground');
  }
  return (
    <div className="flex h-screen w-screen items-stretch overflow-hidden">
      <EditorSidebar params={props.params} />

      <div className="grow overflow-y-auto">
        <div className="mx-auto w-full max-w-[700px] p-5">{props.children}</div>
      </div>
    </div>
  );
}
