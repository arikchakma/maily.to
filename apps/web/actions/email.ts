'use server';

import { z } from 'zod';
import { renderAsync } from '@maily-to/render';

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

    return {
      data: {
        html,
        subject,
        from,
        replyTo,
        to,
      },
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
