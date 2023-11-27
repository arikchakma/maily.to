'use server';

import { z } from 'zod';
import { renderAsync } from '@maily-to/render';
import { cookies } from 'next/headers';
import { Envelope } from 'envelope';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { ENVELOPE_API_KEY, ENVELOPE_ENDPOINT } from '@/utils/constants';
import type { Database } from '@/types/database';
import { ActionError } from './error';

const previewEmailSchema = z.object({
  json: z.string().min(1, 'Please provide a JSON'),
  previewText: z.string(),
});

export async function previewEmailAction(formData: FormData) {
  const result = previewEmailSchema.safeParse({
    json: formData.get('json'),
    previewText: formData.get('previewText'),
  });

  if (!result.success) {
    throw new ActionError(
      result.error.issues.map((issue) => issue.message).join(', '),
      'validation_error',
      result.error.issues.map((issue) => issue.message)
    );
  }

  const { json, previewText } = result.data;

  const content = JSON.parse(json);
  const html = await renderAsync(content, {
    preview: previewText,
  });

  return {
    data: html,
    error: null,
  };
}

const sendTestEmailSchema = z.object({
  subject: z.string().min(1, 'Please provide a subject'),
  json: z.string().min(1, 'Please provide a JSON'),
  previewText: z.string(),
  from: z.string().min(1, 'Please provide a valid email'),
  replyTo: z.string(),
  to: z.string().email('Please provide a valid email'),
});

const envelopeConfigSchema = z.object({
  apiKey: z.string().min(1, 'Please provide an API key'),
  endpoint: z.string(),
});

export async function sendTestEmailAction(formData: FormData) {
  const result = sendTestEmailSchema.safeParse({
    subject: formData.get('subject'),
    json: formData.get('json'),
    previewText: formData.get('previewText'),
    from: formData.get('from'),
    replyTo: formData.get('replyTo'),
    to: formData.get('to'),
  });

  const cookieStore = cookies();
  const apiKey = cookieStore.get(ENVELOPE_API_KEY)?.value;
  const endpoint = cookieStore.get(ENVELOPE_ENDPOINT)?.value;

  if (!apiKey) {
    return {
      data: null,
      error: {
        message:
          'Please provide a valid API key, or configure one in the settings.',
        code: 'api_key_error',
      },
    };
  }

  const configResult = envelopeConfigSchema.safeParse({
    apiKey,
    endpoint,
  });

  if (!configResult.success) {
    return {
      data: null,
      error: {
        errors: configResult.error.issues,
        message: configResult.error.issues
          .map((issue) => issue.message)
          .join(', '),
        code: 'validation_error',
      },
    };
  }

  if (!result.success) {
    throw new ActionError(
      result.error.issues.map((issue) => issue.message).join(', '),
      'validation_error',
      result.error.issues.map((issue) => issue.message)
    );
  }

  const { subject, json, previewText, from, replyTo, to } = result.data;

  const content = JSON.parse(json);
  const html = await renderAsync(content, {
    preview: previewText,
  });

  const envelope = new Envelope(apiKey, {
    endpoint,
  });

  await envelope.emails.send({
    to,
    from,
    replyTo,
    subject,
    html,
  });

  return {
    data: {
      status: 'ok',
    },
    error: null,
  };
}

const saveEmailSchema = z.object({
  subject: z.string().min(1, 'Please provide a subject'),
  json: z.string().min(1, 'Please provide a JSON'),
  previewText: z.string(),
});

export async function saveEmailAction(formData: FormData) {
  const result = saveEmailSchema.safeParse({
    subject: formData.get('subject'),
    json: formData.get('json'),
    previewText: formData.get('previewText'),
  });

  if (!result.success) {
    throw new ActionError(
      result.error.issues.map((issue) => issue.message).join(', '),
      'validation_error',
      result.error.issues.map((issue) => issue.message)
    );
  }

  const { subject, json, previewText } = result.data;

  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      data: null,
      error: {
        message: 'Please login to save emails',
        code: 'not_logged_in',
      },
    };
  }

  const { data, error } = await supabase
    .from('mails')
    .insert({
      title: subject,
      content: json,
      user_id: user.id,
      preview_text: previewText,
    })
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        message: error.message,
        code: 'database_error',
      },
    };
  }

  revalidatePath('/template', 'layout');

  return {
    data,
    error: null,
  };
}

const updateEmailSchema = z.object({
  templateId: z.string().min(1, 'Please provide a template ID'),
  subject: z.string().min(1, 'Please provide a subject'),
  json: z.string().min(1, 'Please provide a JSON'),
  previewText: z.string(),
});

export async function updateEmailAction(formData: FormData) {
  const result = updateEmailSchema.safeParse({
    templateId: formData.get('templateId'),
    subject: formData.get('subject'),
    json: formData.get('json'),
    previewText: formData.get('previewText'),
  });

  if (!result.success) {
    throw new ActionError(
      result.error.issues.map((issue) => issue.message).join(', '),
      'validation_error',
      result.error.issues.map((issue) => issue.message)
    );
  }

  const { templateId, subject, json, previewText } = result.data;

  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      data: null,
      error: {
        message: 'Please login to save emails',
        code: 'not_logged_in',
      },
    };
  }

  const { error: templateError } = await supabase
    .from('mails')
    .select()
    .match({
      id: templateId,
      user_id: user.id,
    })
    .single();

  if (templateError) {
    return {
      data: null,
      error: {
        message: templateError.message,
        code: 'database_error',
      },
    };
  }

  const { data, error } = await supabase
    .from('mails')
    .update({
      title: subject,
      content: json,
      preview_text: previewText,
    })
    .match({
      id: templateId,
      user_id: user.id,
    })
    .single();

  if (error) {
    return {
      data: null,
      error: {
        message: error.message,
        code: 'database_error',
      },
    };
  }

  revalidatePath(`/template/${templateId}`, 'page');

  return {
    data,
    error: null,
  };
}

const deleteEmailSchema = z.object({
  templateId: z.string().min(1, 'Please provide a template ID'),
});

export async function deleteEmailAction(formData: FormData) {
  const result = deleteEmailSchema.safeParse({
    templateId: formData.get('templateId'),
  });

  if (!result.success) {
    throw new ActionError(
      result.error.issues.map((issue) => issue.message).join(', '),
      'validation_error',
      result.error.issues.map((issue) => issue.message)
    );
  }

  const { templateId } = result.data;

  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      data: null,
      error: {
        message: 'Please login to save emails',
        code: 'not_logged_in',
      },
    };
  }

  const { error: templateError } = await supabase
    .from('mails')
    .select()
    .match({
      id: templateId,
      user_id: user.id,
    })
    .single();

  if (templateError) {
    return {
      data: null,
      error: {
        message: templateError.message,
        code: 'database_error',
      },
    };
  }

  const { data, error } = await supabase
    .from('mails')
    .delete()
    .match({
      id: templateId,
      user_id: user.id,
    })
    .single();

  if (error) {
    return {
      data: null,
      error: {
        message: error.message,
        code: 'database_error',
      },
    };
  }

  revalidatePath(`/template`, 'page');

  return {
    data,
    error: null,
  };
}
