import { EmailEditorSandbox } from '~/components/email-editor-sandbox';
import { mergeRouteModuleMeta } from '~/lib/merge-meta';

export const meta = mergeRouteModuleMeta(() => {
  const title = 'Templates | Maily';
  const description = 'List of your created templates.';

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

export default function Templates() {
  return <EmailEditorSandbox autofocus="end" />;
}
