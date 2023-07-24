import { Navigation } from '@/components/auth/navigation';
import { EditorPreview } from '@/components/editor-preview';
import { Icons } from '@/components/icons';
import { Database } from '@/types/database';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import NextLink from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export type MailsRowType = Database['public']['Tables']['mails']['Row']

export default async function PlaygroundPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let mailsCount: number = 0;
  if (user) {
    const { data, error, count } = await supabase
      .from('mails')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (error) {
      throw error;
    }

    if (data) {
      mailsCount = count || 0;
    }
  }

  if (user && mailsCount > 0) {
    return redirect('/editor')
  }

  return (
    <>
      {!user && (
        <div className="mx-auto flex max-w-[680px] flex-col px-5 md:px-10">
          <Navigation />
          <EditorPreview />
        </div>
      )}

      {user && mailsCount === 0 && (
        <div className="mx-auto flex h-screen justify-center max-w-sm text-center items-center flex-col px-5 md:px-10">
          <Icons.emptyInbox className="h-32 w-32" />
          <div className="mt-5">
            <h2 className="text-2xl font-semibold">No Emails Saved</h2>
            <p>Create you first email.</p>
          </div>
          <NextLink href="/template"
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-1.5 font-medium text-black transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white focus:outline-0 mt-4"
          >
            Open Editor
          </NextLink>
        </div>
      )}
    </>
  );
}
