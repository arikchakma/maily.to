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
  return <div>Hello</div>;
}
