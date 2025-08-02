// import type { Route } from './+types/templates._index';
// import { redirect } from 'react-router';
// import { EmailEditorSandbox } from '~/components/email-editor-sandbox';
// import { mergeRouteModuleMeta } from '~/lib/merge-meta';
// import { createSupabaseServerClient } from '~/lib/supabase/server';

// export const meta = mergeRouteModuleMeta(() => {
//   const title = 'Templates | Maily';
//   const description = 'List of your created templates.';

//   return [
//     { title: title },
//     {
//       name: 'description',
//       content: description,
//     },
//     {
//       name: 'twitter:title',
//       content: title,
//     },
//     {
//       name: 'twitter:description',
//       content: description,
//     },
//     {
//       name: 'og:title',
//       content: title,
//     },
//     {
//       name: 'og:description',
//       content: description,
//     },

//     // no index
//     {
//       name: 'robots',
//       content: 'noindex',
//     },
//     {
//       name: 'googlebot',
//       content: 'noindex',
//     },
//   ];
// });

// export async function loader(args: Route.LoaderArgs) {
//   const { request } = args;

//   const headers = new Headers();
//   const supabase = createSupabaseServerClient(request, headers);

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return redirect('/login', { headers });
//   }

//   const mails = await supabase
//     .from('mails')
//     .select('id, title, created_at')
//     .eq('user_id', user.id)
//     .order('created_at', { ascending: false });

//   return {
//     mails,
//     user: user.user_metadata as {
//       avatar_url: string;
//       email: string;
//       name: string;
//     },
//   };
// }

// export default function Templates(props: Route.ComponentProps) {
//   return <EmailEditorSandbox autofocus="end" />;
// }

import { redirect } from "react-router";

export async function loader() {
  return redirect('https://app.maily.to/auth/login', {
    headers: new Headers(),
    status: 301,
  });
}