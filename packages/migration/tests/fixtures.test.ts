import { is, MAILY_NODE_TYPES } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { migrate, requireContentMigration } from '../src/index';
import defaultEditorFixture from './fixtures/default-editor.json';
import kitchenSinkFixture from './fixtures/kitchen-sink.json';

type AnyNode = Record<string, any>;

const LEGACY_ATTRIBUTE_KEYS = [
  'showIfKey',
  'textDirection',
  'textAlign',
  'alignment',
  'text',
  'isTextVariable',
  'isUrlVariable',
  'isSrcVariable',
  'isExternalLinkVariable',
  'buttonColor',
  'textColor',
  'variant',
  'borderRadius',
  'borderWidth',
  'borderColor',
  'backgroundColor',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'columnId',
  'size',
  'maily-component',
  'mailyComponent',
  'isUpdatingKey',
  'aspectRatio',
  'lockAspectRatio',
  '_containerWidth',
  'paddingMode',
  'marginMode',
  'borderRadiusMode',
  'borderWidthMode',
  'heightMode',
  'borderStyle',
  'borderTopLeftRadius',
  'borderTopWidth',
];

const getNodes = (root: AnyNode): AnyNode[] => {
  const nodes: AnyNode[] = [];
  const stack: AnyNode[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;
    nodes.push(node);

    if (Array.isArray(node.content)) {
      for (let index = node.content.length - 1; index >= 0; index--) {
        stack.push(node.content[index]);
      }
    }
  }

  return nodes;
};

const getNodeTypes = (root: AnyNode): string[] => {
  return getNodes(root).map((node) => {
    return node.type;
  });
};

const getMarks = (root: AnyNode): AnyNode[] => {
  return getNodes(root).flatMap((node) => {
    return Array.isArray(node.marks) ? node.marks : [];
  });
};

const getGuard = (type: string): ((value: unknown) => boolean) | undefined => {
  return (is as Record<string, unknown>)[type] as
    | ((value: unknown) => boolean)
    | undefined;
};

const getLegacyKeys = (options: {
  attrs: AnyNode | undefined;
  type: string;
}): string[] => {
  const { attrs, type } = options;

  if (!attrs) {
    return [];
  }

  const keys = [...LEGACY_ATTRIBUTE_KEYS];

  if (type === MAILY_NODE_TYPES.IMAGE) {
    keys.push('height');
  }

  if (type === MAILY_NODE_TYPES.LIST_ITEM) {
    keys.push('color');
  }

  return keys
    .filter((key) => {
      return key in attrs;
    })
    .map((key) => {
      return `${type}.${key}`;
    });
};

const getSurvivingLegacyKeys = (root: AnyNode): string[] => {
  const survivors: string[] = [];

  for (const node of getNodes(root)) {
    survivors.push(...getLegacyKeys({ attrs: node.attrs, type: node.type }));

    for (const mark of Array.isArray(node.marks) ? node.marks : []) {
      survivors.push(...getLegacyKeys({ attrs: mark.attrs, type: mark.type }));
    }
  }

  return survivors;
};

const getWithoutGeneratedIds = (root: AnyNode): AnyNode => {
  const stripped = structuredClone(root);

  for (const node of getNodes(stripped)) {
    if (node.type !== MAILY_NODE_TYPES.VARIABLE && node.attrs) {
      delete node.attrs.id;
    }
  }

  return stripped;
};

const FIXTURES = [
  { fixture: defaultEditorFixture as AnyNode, name: 'default-editor' },
  { fixture: kitchenSinkFixture as AnyNode, name: 'kitchen-sink' },
];

for (const { fixture, name } of FIXTURES) {
  describe(`fixture ${name}`, () => {
    it('requires migration before and not after', () => {
      expect(requireContentMigration(fixture)).toBe(true);
      expect(requireContentMigration(migrate(fixture).json)).toBe(false);
    });

    it('is idempotent', () => {
      const first = migrate(fixture);
      const second = migrate(first.json);

      expect(second.json).toBe(first.json);
      expect(second.warnings).toEqual([]);
    });

    it('does not mutate the input', () => {
      const before = structuredClone(fixture);
      migrate(fixture);

      expect(fixture).toEqual(before);
    });

    it('produces nodes that satisfy their v2 guard', () => {
      const { json } = migrate(fixture);

      expect(getNodeTypes(json)).not.toContain('for');
      expect(getNodeTypes(json)).not.toContain('logo');

      for (const node of getNodes(json)) {
        expect(is.node(node), `node type "${node.type}"`).toBe(true);

        const guard = getGuard(node.type);
        expect(guard, `guard for "${node.type}"`).toBeTypeOf('function');
        expect(guard!(node), `guard is.${node.type}`).toBe(true);
      }
    });

    it('produces marks that satisfy their v2 guard', () => {
      const { json } = migrate(fixture);

      for (const mark of getMarks(json)) {
        expect(is.mark(mark), `mark type "${mark.type}"`).toBe(true);

        const guard = getGuard(mark.type);
        expect(guard, `guard for "${mark.type}"`).toBeTypeOf('function');
        expect(guard!(mark), `guard is.${mark.type}`).toBe(true);
      }
    });

    it('leaves no v1 or beta attribute behind', () => {
      const { json } = migrate(fixture);

      expect(getSurvivingLegacyKeys(json)).toEqual([]);
    });

    it('matches the migrated snapshot', () => {
      const { json } = migrate(fixture);

      expect(getWithoutGeneratedIds(json)).toMatchSnapshot();
    });

    it('matches the warnings snapshot', () => {
      const { warnings } = migrate(fixture);

      expect(warnings).toMatchSnapshot();
    });
  });
}
