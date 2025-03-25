import type { Route } from './+types/templates.$templateId';
import { redirect } from 'react-router';
import { createSupabaseServerClient } from '~/lib/supabase/server';
import { EmailEditorSandbox } from '~/components/email-editor-sandbox';
import { mergeRouteModuleMeta } from '~/lib/merge-meta';

export const meta: Route.MetaFunction = mergeRouteModuleMeta((args) => {
  const { template } = args.data;

  const title = template ? `${template?.title} | Maily` : 'Template | Maily';
  const description = template
    ? `Edit your template: ${template?.title}`
    : 'Edit your template.';

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

    // no index
    {
      name: 'robots',
      content: 'noindex',
    },
    {
      name: 'googlebot',
      content: 'noindex',
    },
  ];
});

export async function loader(args: Route.LoaderArgs) {
  const { request, params } = args;
  const { templateId } = params;

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect('/login', { headers });
  }

  const { data: template } = await supabase
    .from('mails')
    .select('*')
    .eq('id', templateId)
    .eq('user_id', user.id)
    .single();

  if (!template) {
    throw redirect('/templates');
  }

  return { template };
}

export default function TemplatePage(props: Route.ComponentProps) {
  const { loaderData } = props;
  const { template } = loaderData;

  return <EmailEditorSandbox key={template.id} template={template} />;
}
