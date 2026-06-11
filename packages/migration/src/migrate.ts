import { button } from './transforms/button';
import { column } from './transforms/column';
import { columns } from './transforms/columns';
import { footer } from './transforms/footer';
import { global } from './transforms/global';
import { htmlCodeBlock } from './transforms/html-code-block';
import { image } from './transforms/image';
import { inlineImage } from './transforms/inline-image';
import { link } from './transforms/link';
import { logo } from './transforms/logo';
import { repeat } from './transforms/repeat';
import { section } from './transforms/section';
import { spacer } from './transforms/spacer';
import type { MigrationResult, MigrationWarning } from './types';
import { annotateContainerWidths } from './utils/container-width';

type NodeTransform = (
  node: Record<string, any>,
  warnings: MigrationWarning[]
) => void;

type MarkTransform = (
  mark: Record<string, any>,
  warnings: MigrationWarning[]
) => void;

const NODE_TRANSFORMS: Record<string, NodeTransform> = {
  button,
  htmlCodeBlock,
  image,
  logo,
  section,
  columns,
  column,
  spacer,
  repeat,
  footer,
  inlineImage,
};

const MARK_TRANSFORMS: Record<string, MarkTransform> = {
  link,
};

/**
 * Checks whether a Maily JSON document needs migration.
 * Returns `true` when the document has no `version` attribute
 * or when `version` is less than 2, indicating it is a v1 document
 * that should be passed through `migrate` before use.
 */
export function requireContentMigration(json: Record<string, any>): boolean {
  return !(json.attrs?.version >= 2);
}

/**
 * Converts a Maily v1 JSON document to the v2 schema.
 * Deep-clones the input so the original is never mutated, then
 * walks the tree iteratively (stack-based) applying global transforms
 * (showIfKey → visibilityRule, textDirection → dir, id generation)
 * followed by node-specific transforms (button, image, section, etc.)
 * and mark transforms (link).
 *
 * If the document is already v2+ (version >= 2), it is returned as-is
 * with an empty warnings array. Warnings are emitted when v1 attributes
 * are dropped without a v2 equivalent (e.g. column styling attributes).
 */
export function migrate(json: Record<string, any>): MigrationResult {
  if (!requireContentMigration(json)) {
    return { json, warnings: [] };
  }

  // Deep clone
  const doc = structuredClone(json);
  const warnings: MigrationWarning[] = [];

  // Set version
  if (!doc.attrs) {
    doc.attrs = {};
  }
  doc.attrs.version = 2;

  // Pre-pass: stamp _containerWidth on image/logo nodes so transforms can
  // compute accurate pixel → percentage conversions.
  annotateContainerWidths(doc);

  // Walk tree iteratively (stack-based)
  const stack: Record<string, any>[] = [doc];

  while (stack.length > 0) {
    const node = stack.pop()!;

    // Apply global transforms
    global(node, warnings);

    // Apply node-specific transform
    const transform = NODE_TRANSFORMS[node.type];
    if (transform) {
      transform(node, warnings);
    }

    // Process marks
    if (Array.isArray(node.marks)) {
      for (const mark of node.marks) {
        const markTransform = MARK_TRANSFORMS[mark.type];
        if (markTransform) {
          markTransform(mark, warnings);
        }
      }
    }

    // Push children to stack (reverse order for correct traversal)
    if (Array.isArray(node.content)) {
      for (let i = node.content.length - 1; i >= 0; i--) {
        stack.push(node.content[i]);
      }
    }
  }

  return { json: doc, warnings };
}
