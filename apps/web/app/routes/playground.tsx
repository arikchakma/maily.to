import { EmailEditorSandbox } from '~/components/email-editor-sandbox';
import { mergeRouteModuleMeta } from '~/lib/merge-meta';

import type { Route } from './+types/playground';

export const meta = mergeRouteModuleMeta(() => {
  const title = 'Playground | Maily';
  const description =
    'Try out Maily, the Open-source editor for crafting emails.';

  return [
    { title },
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
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
  ];
});

export default function Playground(_props: Route.ComponentProps) {
  return (
    <main className="mx-auto w-full">
      <h1 className="sr-only">Email Playground</h1>
      <EmailEditorSandbox autofocus={false} />
    </main>
  );
}
