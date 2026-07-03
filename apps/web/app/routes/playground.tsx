import type { Route } from './+types/playground';
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

export async function loader() {
  return null;
}

export default function Playground(props: Route.ComponentProps) {
  return (
    <main className="mx-auto w-full">
      <EmailEditorSandbox showSaveButton={false} autofocus={false} />
    </main>
  );
}
