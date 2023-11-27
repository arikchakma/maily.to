'use server';

import { z } from 'zod';
import { renderAsync } from '@maily-to/render';
import { cookies } from 'next/headers';
import { Envelope } from 'envelope';
import { Resend } from 'resend';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import {
  MAILY_API_KEY,
  MAILY_ENDPOINT,
  MAILY_PROVIDER,
} from '@/utils/constants';
import type { Database } from '@/types/database';
import { UnreachableCaseError } from './error';

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
    return {
      data: null,
      error: {
        message: result.error.issues.map((issue) => issue.message).join(', '),
        code: 'validation_error',
        errors: result.error.issues.map((issue) => issue.message),
      },
    };
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
  provider: z.union([z.literal('resend'), z.literal('envelope')]),
  apiKey: z
    .string()
    .min(
      1,
      'Please provide a valid API key, or configure one in the settings.'
    ),
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
  const configResult = envelopeConfigSchema.safeParse({
    provider: cookieStore.get(MAILY_PROVIDER)?.value,
    apiKey: cookieStore.get(MAILY_API_KEY)?.value,
    endpoint: cookieStore.get(MAILY_ENDPOINT)?.value,
  });

  if (!configResult.success) {
    return {
      data: null,
      error: {
        errors: configResult.error.issues.map((issue) => issue.message),
        message: configResult.error.issues
          .map((issue) => issue.message)
          .join(', '),
        code: 'validation_error',
      },
    };
  }

  if (!result.success) {
    return {
      data: null,
      error: {
        errors: result.error.issues.map((issue) => issue.message),
        message: result.error.issues.map((issue) => issue.message).join(', '),
        code: 'validation_error',
      },
    };
  }

  const { subject, json, previewText, from, replyTo, to } = result.data;

  const content = JSON.parse(json);
  const html = await renderAsync(content, {
    preview: previewText,
  });

  const { provider, apiKey, endpoint } = configResult.data;
  if (provider === 'resend') {
    const resend = new Resend(apiKey);

    const enrichedTo = Array.isArray(to)
      ? to
      : to.split(',').map((email) => email.trim());
    const { error } = await resend.emails.send({
      to: enrichedTo,
      from,
      reply_to: replyTo,
      subject,
      html,
    });

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.name,
        },
      };
    }
  } else if (provider === 'envelope') {
    const envelope = new Envelope(apiKey, {
      endpoint,
    });

    const { error } = await envelope.emails.send({
      to,
      from,
      replyTo,
      subject,
      html,
    });

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.status,
        },
      };
    }
  } else {
    throw new UnreachableCaseError(provider);
  }

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
    return {
      data: null,
      error: {
        message: result.error.issues.map((issue) => issue.message).join(', '),
        code: 'validation_error',
        errors: result.error.issues.map((issue) => issue.message),
      },
    };
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
    return {
      data: null,
      error: {
        message: result.error.issues.map((issue) => issue.message).join(', '),
        code: 'validation_error',
        errors: result.error.issues.map((issue) => issue.message),
      },
    };
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

  revalidatePath(`/template/${templateId}`);

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
    return {
      data: null,
      error: {
        message: result.error.issues.map((issue) => issue.message).join(', '),
        code: 'validation_error',
        errors: result.error.issues.map((issue) => issue.message),
      },
    };
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
