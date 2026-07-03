import type { Route } from './+types/templates.$templateId';
import { redirect } from 'react-router';
import { EmailEditorSandbox } from '~/components/email-editor-sandbox';
import { mergeRouteModuleMeta } from '~/lib/merge-meta';
import { getMockTemplateById } from '~/lib/mock-templates';

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
  const { params } = args;
  const { templateId } = params;

  // Auth/Supabase disabled for local development. Load from mock templates.
  const template = getMockTemplateById(templateId);

  if (!template) {
    throw redirect('/templates');
  }

  return { template };
}

export default function TemplatePage(props: Route.ComponentProps) {
  const { loaderData } = props;
  const { template } = loaderData;

  return (
    <EmailEditorSandbox key={template.id} template={template} autofocus="end" />
  );
}
