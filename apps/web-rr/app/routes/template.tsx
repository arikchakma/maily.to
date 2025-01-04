import type { Route } from './+types/template';
import { Link, redirect } from 'react-router';
import { createSupabaseServerClient } from '~/lib/supabase/server';

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
  const { request, params } = args;
  const { templateId } = params;

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login', { headers });
  }

  const { data: template } = await supabase
    .from('mails')
    .select('*')
    .eq('id', templateId)
    .eq('user_id', user.id)
    .single();

  if (!template) {
    return redirect('/templates');
  }

  return { template };
}

export default function TemplatePage(props: Route.ComponentProps) {
  const { loaderData } = props;
  const { template } = loaderData;

  return (
    <div className="mx-auto w-full max-w-[700px] p-5">
      <h1>{template.title}</h1>
    </div>
  );
}
