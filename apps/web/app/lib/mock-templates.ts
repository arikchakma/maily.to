import type { Database } from '~/types/database';
import defaultEmailJSON from '~/lib/default-editor-json.json';

type MailRow = Database['public']['Tables']['mails']['Row'];

/**
 * In-memory template store for local development.
 * Data persists only while the server is running.
 */
let templates: MailRow[] = [
  {
    id: 'welcome-email',
    title: 'Welcome Email',
    preview_text: 'Welcome aboard! Here is how to get started.',
    content: JSON.stringify(defaultEmailJSON) as MailRow['content'],
    user_id: 'local-dev-user',
    created_at: '2026-06-12T00:00:00.000Z',
    updated_at: '2026-06-12T00:00:00.000Z',
  },
  {
    id: 'marketing-campaign',
    title: 'Marketing Campaign',
    preview_text: 'Big news from our team this month.',
    content: JSON.stringify(defaultEmailJSON) as MailRow['content'],
    user_id: 'local-dev-user',
    created_at: '2026-06-01T00:00:00.000Z',
    updated_at: '2026-06-01T00:00:00.000Z',
  },
];

let idCounter = 1;

function generateId(): string {
  return `template-${Date.now()}-${idCounter++}`;
}

export function getMockTemplates(): MailRow[] {
  return [...templates].sort(
    (a, b) =>
      new Date(b.created_at || 0).getTime() -
      new Date(a.created_at || 0).getTime()
  );
}

export function getMockTemplateById(id: string): MailRow | undefined {
  return templates.find((template) => template.id === id);
}

export function createMockTemplate(data: {
  title: string;
  previewText?: string;
  content: string;
}): MailRow {
  const now = new Date().toISOString();
  const newTemplate: MailRow = {
    id: generateId(),
    title: data.title,
    preview_text: data.previewText || null,
    content: data.content as MailRow['content'],
    user_id: 'local-dev-user',
    created_at: now,
    updated_at: now,
  };
  templates.push(newTemplate);
  return newTemplate;
}

export function updateMockTemplate(
  id: string,
  data: {
    title: string;
    previewText?: string;
    content: string;
  }
): MailRow | null {
  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) return null;

  templates[index] = {
    ...templates[index],
    title: data.title,
    preview_text: data.previewText || null,
    content: data.content as MailRow['content'],
    updated_at: new Date().toISOString(),
  };
  return templates[index];
}

export function deleteMockTemplate(id: string): boolean {
  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) return false;
  templates.splice(index, 1);
  return true;
}

export function duplicateMockTemplate(id: string): MailRow | null {
  const original = getMockTemplateById(id);
  if (!original) return null;

  return createMockTemplate({
    title: `${original.title} (Copy)`,
    previewText: original.preview_text || undefined,
    content: original.content as string,
  });
}
