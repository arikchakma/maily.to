import type { Route } from './+types/playground';
import { Link, redirect } from 'react-router';
import { LogInIcon } from 'lucide-react';
import { createSupabaseServerClient } from '~/lib/supabase/server';
import { EmailEditorSandbox } from '~/components/email-editor-sandbox';
import { mergeRouteModuleMeta } from '~/lib/merge-meta';

export const meta = mergeRouteModuleMeta(() => {
  const title = 'Playground | Maily';
  const description =
    'Try out Maily, the Open-source editor for crafting emails.';

  return [
    { title: title },
    {
      name: 'description',
      content: description,
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'og:title',
      content: title,
    },
    {
      name: 'og:description',
      content: description,
    },
  ];
});

export async function loader(args: Route.LoaderArgs) {
  const { request } = args;

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/templates', { headers });
  }

  return new Response(null, {
    headers,
  });
}

export default function Playground() {
  return (
    <main className="mx-auto w-full">
      <header className="mx-auto mt-14 max-w-[calc(600px+80px)] border-b border-gray-200 px-10 pb-6">
        <p className="text-balance sm:text-lg">
          You can create an account to save email templates as well. It&apos;s
          free and easy to use.
        </p>

        <div className="mt-5 flex items-stretch gap-2">
          <Link
            className="flex items-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            to="/login"
          >
            <LogInIcon className="mr-1 inline-block size-4" />
            Login / Register
          </Link>
        </div>
      </header>

      <EmailEditorSandbox showSaveButton={false} autofocus={false} />
    </main>
  );
}
