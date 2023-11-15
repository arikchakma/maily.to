import { type JSONContent, Maily, type RenderOptions } from './maily';

export function render(content: JSONContent, options?: RenderOptions): string {
  const maily = new Maily(content);
  return maily.render(options);
}