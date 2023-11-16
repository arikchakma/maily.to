import { Maily } from './maily';
import type { MailyConfig, JSONContent } from './maily';

export function render(content: JSONContent, config?: MailyConfig): string {
  const maily = new Maily(content, config);
  return maily.render();
}
