import { createSupabaseServerClient } from '~/lib/supabase/server';
import type { Route } from './+types/api.v1.templates.$templateId';
import { z } from 'zod';
import { json } from '~/lib/response';
import { serializeZodError } from '~/lib/errors';
import { tryApiKeyAuth } from '~/lib/api-key-auth';

export async function loader(args: Route.LoaderArgs) {
  const { request, params } = args;
  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // TODO: keep track of middlewares in React Router (https://reactrouter.com/start/changelog#middleware-unstable)
  // They are unstable now, but can be useful in the future
  const isApiKeyAuth = tryApiKeyAuth(request.headers);

  if (!user && !isApiKeyAuth) {
    return json(
      {
        status: 401,
        message: 'Unauthorized',
        errors: ['Unauthorized'],
      },
      {
        status: 401,
      }
    );
  }

  const paramsSchema = z.object({
    templateId: z.string(),
  });
  const { data: paramsData, error: paramsError } =
    paramsSchema.safeParse(params);
  if (paramsError) {
    return serializeZodError(paramsError);
  }

  const { templateId } = paramsData;

  const { data: template, error } = await supabase
    .from('mails')
    .select('*')
    .match({
      id: templateId,
      ...(user ? { user_id: user.id } : {}),
    })
    .single();

  if (error || !template) {
    return json(
      { errors: [], message: 'Template not found', status: 404 },
      { status: 404 }
    );
  }

  return json({
    ...template,
    content: JSON.parse(template.content as string),
  }, { status: 200 });
}

export async function action(args: Route.ActionArgs) {
  const { request, params } = args;
  if (!['POST', 'DELETE'].includes(request.method)) {
    return { status: 405, message: 'Method Not Allowed', errors: [] };
  }

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return json(
      {
        status: 401,
        message: 'Unauthorized',
        errors: ['Unauthorized'],
      },
      {
        status: 401,
      }
    );
  }

  const paramsSchema = z.object({
    templateId: z.string(),
  });
  const { data: paramsData, error: paramsError } =
    paramsSchema.safeParse(params);
  if (paramsError) {
    return serializeZodError(paramsError);
  }

  const { templateId } = paramsData;

  if (request.method === 'POST') {
    const body = await request.json();
    const schema = z.object({
      title: z.string().trim().min(3),
      previewText: z.string().trim().optional(),
      content: z.string(),
    });

    const { data, error } = schema.safeParse(body);
    if (error) {
      return serializeZodError(error);
    }

    const { data: template } = await supabase
      .from('mails')
      .select('*')
      .eq('id', templateId)
      .eq('user_id', user.id)
      .single();

    if (!template) {
      return json(
        { errors: [], message: 'Template not found', status: 404 },
        { status: 404 }
      );
    }

    const { title, previewText, content } = data;
    const { error: updateError } = await supabase
      .from('mails')
      .update({ title, preview_text: previewText, content })
      .eq('id', templateId)
      .eq('user_id', user.id)
      .single();

    if (updateError) {
      return json(
        { errors: [], message: 'Failed to update template', status: 500 },
        { status: 500 }
      );
    }

    return { status: 'ok' };
  } else if (request.method === 'DELETE') {
    const { error } = await supabase
      .from('mails')
      .delete()
      .eq('id', templateId)
      .eq('user_id', user.id);

    if (error) {
      return json(
        { errors: [], message: 'Failed to delete template', status: 500 },
        { status: 500 }
      );
    }

    return { status: 'ok' };
  }
}
