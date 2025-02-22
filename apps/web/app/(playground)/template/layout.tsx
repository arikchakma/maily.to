import { redirect } from 'next/navigation';
import { TemplateSidebar } from '@/components/template-sidebar';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface PlaygroundLayoutProps {
  children: React.ReactNode;
}

export default async function PlaygroundLayout(props: PlaygroundLayoutProps) {
  const { children } = props;

  const supabase = createSupabaseServerClient();
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
        <div className="mx-auto w-full max-w-[calc(600px+40px)] p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
