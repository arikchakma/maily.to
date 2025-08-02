// import { useMutation } from '@tanstack/react-query';
// import { FilePlus2Icon } from 'lucide-react';
// import {
//   Link,
//   NavLink,
//   Outlet,
//   redirect,
//   useNavigate,
//   useRevalidator,
// } from 'react-router';
// import { toast } from 'sonner';
// import { LogoutButton } from '~/components/auth/logout-button';
// import { buttonVariants } from '~/components/ui/button';
// import { cn } from '~/lib/classname';
// import { httpPost } from '~/lib/http';
// import { createSupabaseServerClient } from '~/lib/supabase/server';
// import type { Route } from './+types/templates._index';

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
//   const { loaderData } = props;
//   const { mails } = loaderData;

//   const data = mails?.data || [];

//   const revalidator = useRevalidator();
//   const navigate = useNavigate();

//   const {
//     mutateAsync: handleEmailDuplicate,
//     isPending: isDuplicateEmailPending,
//   } = useMutation({
//     mutationFn: async (templateId: string) => {
//       return httpPost<{ template: { id: string } }>(
//         `/api/v1/templates/${templateId}/duplicate`,
//         {}
//       );
//     },
//     onSettled: () => {
//       revalidator.revalidate();
//     },
//     onSuccess: (data) => {
//       navigate(`/templates/${data.template.id}`);
//     },
//   });

//   return (
//     <div className="flex h-screen w-screen items-stretch overflow-hidden">
//       <aside className="flex w-[225px] shrink-0 flex-col border-r border-gray-200 pb-2 max-lg:w-[180px]">
//         <Link
//           className={cn(
//             buttonVariants({ variant: 'outline' }),
//             'w-full rounded-none border-x-0 border-b border-t-0 border-gray-200'
//           )}
//           to="/templates"
//         >
//           + New Email
//         </Link>

//         {data.length === 0 && (
//           <p className="py-2 text-center text-sm">No Saved Emails</p>
//         )}

//         {data.length > 0 && (
//           <div className="flex grow flex-col pb-4 pt-1">
//             <div className="relative grow overflow-hidden">
//               <div className="no-scrollbar absolute inset-0 overflow-y-scroll">
//                 <ul className="space-y-0.5 px-1">
//                   {data.map((template) => {
//                     return (
//                       <li
//                         className="group relative flex items-center"
//                         key={template.id}
//                       >
//                         <NavLink
//                           className={({ isActive }) =>
//                             cn(
//                               'rounded-md px-2 py-1.5 pr-7 text-sm hover:bg-gray-100',
//                               'flex h-auto w-full min-w-0 items-center font-medium',
//                               isActive ? 'bg-gray-100' : ''
//                             )
//                           }
//                           to={`/templates/${template.id}`}
//                           end={true}
//                         >
//                           <span className="block truncate">
//                             {template.title}
//                           </span>
//                         </NavLink>
//                         <button
//                           className="absolute right-0 mr-1.5 hidden cursor-pointer group-hover:block"
//                           onClick={() => {
//                             toast.promise(handleEmailDuplicate(template.id), {
//                               loading: 'Duplicating Template...',
//                               success: 'Duplicate Template Created!',
//                               error: (err) =>
//                                 err?.message || 'Something went wrong!',
//                             });
//                           }}
//                           disabled={isDuplicateEmailPending}
//                           type="button"
//                         >
//                           <FilePlus2Icon className="h-4 w-4 shrink-0" />
//                         </button>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="mt-auto px-1">
//           <LogoutButton />
//         </div>
//       </aside>

//       <div className="grow overflow-y-auto">
//         <Outlet />
//       </div>
//     </div>
//   );
// }

import { redirect } from "react-router";

export async function loader() {
  return redirect('https://app.maily.to/auth/login', {
    headers: new Headers(),
    status: 301,
  });
}