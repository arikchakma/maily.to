import type { Route } from './+types/login';
import { data, Link, redirect } from 'react-router';
import * as v from 'valibot';
import { EmailLoginForm } from '~/components/auth/email-login';
import { buttonVariants } from '~/components/ui/button';
import { createSupabaseServerClient } from '~/lib/supabase/server';
import { cn } from '~/lib/classname';
import { mergeRouteModuleMeta } from '~/lib/merge-meta';
import { json } from '~/lib/response';

export const meta = mergeRouteModuleMeta(() => {
  const title = 'Login | Maily';
  const description = 'Login to your Maily account.';

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

export async function action(args: Route.ActionArgs) {
  const { request } = args;
  const formData = await request.formData();

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const bodySchema = v.object({
    email: v.pipe(v.string(), v.trim(), v.email()),
    password: v.string(),
  });

  const bodyResult = v.safeParse(bodySchema, {
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!bodyResult.success) {
    return data(
      {
        message: bodyResult.issues.map((issue) => issue.message).join(', '),
        errors: bodyResult.issues,
        status: 400,
      },
      {
        status: 400,
      }
    );
  }

  const { error } = await supabase.auth.signInWithPassword(bodyResult.output);

  if (error) {
    return json(
      {
        message: error.message,
        errors: [error?.message],
        status: 400,
      },
      {
        status: 400,
      }
    );
  }

  return redirect('/templates', { headers });
}

export async function loader(args: Route.LoaderArgs) {
  const { request } = args;

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/templates', { headers });
  }

  return new Response(null, {
    headers,
  });
}

export default function Login() {
  return (
    <main className="mx-auto w-full max-w-[calc(36rem+40px)] px-5">
      <div className="container relative flex h-screen flex-col items-center justify-center sm:grid lg:max-w-none lg:px-0">
        <Link
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute left-4 top-4 md:left-8 md:top-8'
          )}
          to="/playground"
        >
          Playground
        </Link>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center sm:w-[360px]">
            <div className="mb-10 flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            </div>

            <EmailLoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
