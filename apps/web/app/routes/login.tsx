import type { Route } from './+types/login';
import { data, Link, redirect } from 'react-router';
import * as v from 'valibot';
import { EmailLoginForm } from '~/components/auth/email-login';
import { GithubLoginButton } from '~/components/auth/github-login';
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
  const _provider = formData.get('provider');

  const schema = v.union([v.literal('github'), v.literal('email')]);
  const result = v.safeParse(schema, _provider);

  if (!result.success) {
    return json(
      {
        message: result.issues.map((issue) => issue.message).join(', '),
        errors: result.issues,
        status: 400,
      },
      {
        status: 400,
      }
    );
  }

  const provider = result.output;
  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  if (provider === 'email') {
    const _email = formData.get('email');
    const emailSchema = v.pipe(v.string(), v.trim(), v.email());

    const emailResult = v.safeParse(emailSchema, _email);
    if (!emailResult.success) {
      return data(
        {
          message: emailResult.issues.map((issue) => issue.message).join(', '),
          errors: emailResult.issues,
          status: 400,
        },
        {
          status: 400,
        }
      );
    }

    const email = emailResult.output;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`,
      },
    });

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

    return {
      status: 200,
    };
  } else {
    const { data: oAuthData } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`,
      },
    });

    if (!oAuthData.url) {
      return json(
        {
          message: 'Invalid OAuth URL',
          errors: ['Invalid OAuth URL'],
          status: 400,
        },
        {
          status: 400,
        }
      );
    }

    return redirect(oAuthData.url, {
      headers,
      status: 301,
    });
  }
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
              <h1 className="text-2xl font-semibold tracking-tight">
                Login / Register
              </h1>
              <p className="text-muted-foreground text-sm">
                Continue with your email address or GitHub account.
              </p>
            </div>

            <EmailLoginForm />

            <div className="flex w-full items-center gap-2 py-6 text-sm text-gray-600">
              <div className="h-px w-full bg-gray-200" />
              OR
              <div className="h-px w-full bg-gray-200" />
            </div>

            <div className="flex flex-col gap-2">
              <GithubLoginButton />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
