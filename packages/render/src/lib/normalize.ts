import type { AnyMailyNode, BodyNode, DocumentNode } from '@maily-to/shared';
import { is, MAILY_NODE_TYPES } from '@maily-to/shared';

function getUnwrappedBodies(content: AnyMailyNode[]): AnyMailyNode[] {
  return content.flatMap((node) => {
    return is.body(node) ? node.content : [node];
  });
}

function getShellBody(content: AnyMailyNode[]): BodyNode {
  const [only] = content;
  if (content.length === 1 && is.body(only)) {
    return only;
  }

  const authored = content.find((node) => {
    return is.body(node);
  });

  return {
    ...(authored?.attrs ? { attrs: authored.attrs } : {}),
    content: getUnwrappedBodies(content),
    type: MAILY_NODE_TYPES.BODY,
  };
}

function getShellContainers(body: BodyNode): AnyMailyNode[] {
  const shelled = body.content.every((node) => {
    return is.container(node);
  });

  if (body.content.length > 0 && shelled) {
    return body.content;
  }

  return [{ content: body.content, type: MAILY_NODE_TYPES.CONTAINER }];
}

export type NormalizedDocumentOptions = {
  document: DocumentNode;
};

export function getNormalizedDocument(
  options: NormalizedDocumentOptions
): DocumentNode {
  const { document } = options;
  const body = getShellBody(document.content ?? []);

  return {
    ...document,
    content: [{ ...body, content: getShellContainers(body) }],
  };
}
