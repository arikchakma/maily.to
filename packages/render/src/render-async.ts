import { Maily } from './maily';
import type { MailyConfig, JSONContent } from './maily';

export async function renderAsync(
  content: JSONContent,
  config?: MailyConfig
): Promise<string> {
  const maily = new Maily(content, config);
  return maily.renderAsync();
}
