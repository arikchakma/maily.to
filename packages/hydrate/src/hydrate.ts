import { JSONContent, Transformer } from './transformer';

export async function hydrate(content: string): Promise<JSONContent> {
  const transformer = new Transformer();
  return transformer.transform(content);
}
