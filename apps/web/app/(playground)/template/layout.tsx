import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';
import { TemplateSidebar } from '@/components/template-sidebar';

export const dynamic = 'force-dynamic';

interface PlaygroundLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: 'Templates - Playground',
};

export default async function PlaygroundLayout(props: PlaygroundLayoutProps) {
  const { children } = props;

  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/playground');
  }

  const mails = await supabase
    .from('mails')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="flex h-screen w-screen items-stretch overflow-hidden">
      <TemplateSidebar mails={mails.data || []} />

      <div className="grow overflow-y-auto">
        <div className="mx-auto w-full max-w-[700px] p-5">{children}</div>
      </div>
    </div>
  );
}
