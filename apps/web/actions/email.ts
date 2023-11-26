'use server';

import { z } from 'zod';
import { renderAsync } from '@maily-to/render';
import { cookies } from 'next/headers';
import { Envelope } from 'envelope';
import { ENVELOPE_API_KEY, ENVELOPE_ENDPOINT } from '@/utils/constants';

const previewEmailSchema = z.object({
  json: z.string().min(1, 'Please provide a JSON'),
  previewText: z.string(),
});

export async function previewEmailAction(formData: FormData) {
  try {
    const result = previewEmailSchema.safeParse({
      json: formData.get('json'),
      previewText: formData.get('previewText'),
    });

    if (!result.success) {
      return {
        data: null,
        error: {
          errors: result.error.issues,
          message: result.error.issues.map((issue) => issue.message).join(', '),
          code: 'validation_error',
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
  } catch (e: unknown) {
    return {
      data: null,
      error: {
        message: (e as Error).message || 'Something went wrong',
        code: 'unknown_error',
      },
    };
  }
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
  try {
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
          errors: [],
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
      return {
        data: null,
        error: {
          errors: result.error.issues,
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
  } catch (e: unknown) {
    console.log(e);
    return {
      data: null,
      error: {
        message: (e as Error).message || 'Something went wrong',
        code: 'unknown_error',
      },
    };
  }
}
