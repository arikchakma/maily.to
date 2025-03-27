import { createSupabaseServerClient } from '~/lib/supabase/server';
import type { Route } from './+types/api.v1.templates.$templateId';
import { z } from 'zod';
import { Maily } from '@maily-to/render';
import { json } from '~/lib/response';
import { serializeZodError } from '~/lib/errors';
import { tryApiKeyAuth } from '~/lib/api-key-auth';

/**
 * @swagger
 * /api/v1/templates/{templateId}/render:
 *   post:
 *     summary: Render an email template
 *     description: Renders an email template using the provided variables and returns the HTML and plain text versions.
 *     tags:
 *       - Templates
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the template to render.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               variables:
 *                 type: object
 *                 additionalProperties: true
 *                 description: Key-value pairs for template variables.
 *               repeatVariables:
 *                 type: object
 *                 additionalProperties: true
 *                 description: Key-value pairs for repeatable template variables.
 *               previewText:
 *                 type: string
 *                 description: Optional preview text for the email.
 *     responses:
 *       200:
 *         description: Successfully rendered the template.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 html:
 *                   type: string
 *                   description: The rendered HTML content of the email.
 *                 plainText:
 *                   type: string
 *                   description: The rendered plain text content of the email.
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid input"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Template not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Template not found"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 405
 *                 message:
 *                   type: string
 *                   example: "Method Not Allowed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 */
export async function action(args: Route.ActionArgs) {
  const { request, params } = args;
  if (request.method !== 'POST') {
    return { status: 405, message: 'Method Not Allowed', errors: [] };
  }

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const body = await request.json();
  const schema = z.object({
    variables: z.record(z.any()).optional(),
    repeatVariables: z.record(z.any()).optional(),
    previewText: z.string().optional(),
  });

  const { data, error } = schema.safeParse(body);
  if (error) {
    return serializeZodError(error);
  }

  const { data: template } = await supabase
    .from('mails')
    .select('*')
    .match({
      id: templateId,
      ...(user ? { user_id: user.id } : {}),
    })
    .single();

  if (!template) {
    return json(
      { errors: [], message: 'Template not found', status: 404 },
      { status: 404 }
    );
  }

  const { variables, repeatVariables, previewText } = data;

  const parsedJson = JSON.parse(template.content as string);
  const maily = new Maily(parsedJson);

  if (variables) {
    maily.setVariableValues(variables);
  }

  if (repeatVariables) {
    maily.setPayloadValues(repeatVariables);
  }

  if (previewText || template.preview_text) {
    maily.setPreviewText(previewText || template.preview_text);
  }

  const html = await maily.render();
  const plainText = await maily.render({ plainText: true });

  return {
    html,
    plainText,
  };
}
