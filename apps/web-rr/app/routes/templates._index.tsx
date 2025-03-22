import type { Route } from './+types/templates._index';
import { Link, redirect } from 'react-router';
import {
  MailIcon,
  PlusIcon,
  SquarePenIcon,
  Trash2Icon,
  User2Icon,
} from 'lucide-react';
import { createSupabaseServerClient } from '~/lib/supabase/server';
import { cn } from '~/utils/classname';
import { useState } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Playground | Maily' },
    {
      name: 'description',
      content: 'Try out Maily, the Open-source editor for crafting emails.',
    },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const { request } = args;

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login', { headers });
  }

  const mails = await supabase
    .from('mails')
    .select('id, title, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return {
    mails,
    user: user.user_metadata as {
      avatar_url: string;
      email: string;
      name: string;
    },
  };
}

export default function Templates(props: Route.ComponentProps) {
  const { loaderData } = props;
  const { mails, user } = loaderData;

  const [activeTab, setActiveTab] = useState<'all' | 'create'>('all');

  return (
    <main className="mx-auto max-w-md pb-10 pt-20">
      <nav className="sticky top-0 z-10 bg-white pt-6">
        <div className="flex items-center gap-3">
          {user?.avatar_url && (
            <img
              src={user?.avatar_url}
              alt={user.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          )}

          {!user?.avatar_url && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200">
              <User2Icon className="h-6 w-6" />
            </div>
          )}

          <div className="flex flex-col gap-0">
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
        </div>

        <div className="relative my-6 grid grid-cols-2 rounded-xl border bg-white p-1">
          <button
            className={cn(
              'z-50 flex flex-grow items-center justify-center rounded-lg py-2 text-sm font-medium',
              {
                'bg-zinc-900 text-white': activeTab === 'all',
                'text-zinc-700': activeTab !== 'all',
              }
            )}
            onClick={() => setActiveTab('all')}
          >
            <MailIcon size={16} className="mr-1.5 inline-block" />
            All Emails
          </button>
          <button
            className={cn(
              'group relative z-50 flex flex-grow items-center justify-center rounded-lg py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-80',
              {
                'bg-zinc-900 text-white': activeTab === 'create',
                'text-zinc-700': activeTab !== 'create',
              }
            )}
            onClick={() => setActiveTab('create')}
          >
            <PlusIcon size={16} className="mr-1.5 inline-block" />
            Craft New Email
          </button>
        </div>
      </nav>

      <ul className="flex flex-col divide-y">
        {mails?.data?.map((mail) => {
          const url = `/templates/${mail.id}`;

          return (
            <li
              className="relative flex items-stretch justify-between overflow-hidden hover:bg-zinc-50"
              key={mail.id}
            >
              <Link to={url} className="flex-grow truncate p-2.5 text-sm">
                {mail.title}
              </Link>
              <span className="mr-2 flex items-stretch gap-0.5">
                <button className="px-1 opacity-40 hover:opacity-100">
                  <Trash2Icon className="h-4 w-4" />
                </button>
                <Link
                  to={url}
                  className="inline-flex cursor-pointer items-center justify-center px-1 opacity-40 hover:opacity-100"
                >
                  <SquarePenIcon className="h-4 w-4" />
                </Link>
              </span>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
