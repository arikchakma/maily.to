import type { MetaDescriptor } from 'react-router';
import type {
  CreateMetaArgs,
  MetaDescriptors,
} from 'react-router/route-module';

/**
 * Merging helper that works with Route Module Type Safety
 *
 * If you can't avoid the merge problem with global meta or index routes, we've created
 * a helper that you can put in your app that can override and append to parent meta easily.
 *
 * @example
 * ```typescript
 * import type { Route } from './+types/leaf';
 *
 * import { mergeRouteModuleMeta } from '~/utils/meta-utils';
 *
 * export const meta: Route.MetaFunction = mergeRouteModuleMeta(({ data }) => {
 *   return [
 *     { title: "My Leaf Route" },
 *   ];
 * });
 *
 * // In a parent route:
 * import type { Route } from './+types/root';
 *
 * export const meta: Route.MetaFunction = ({ data }) => {
 *   return [
 *     { title: "My Parent Route" },
 *     { name: 'description', content: "This is the parent route" },
 *   ];
 * }
 * ```
 * The resulting meta will contain both `title: 'My Leaf Route'` and `description: 'This is the parent route'`.
 */
export function mergeRouteModuleMeta<TMetaArgs extends CreateMetaArgs<any>>(
  leafMetaFn: (args: TMetaArgs) => MetaDescriptors
): (args: TMetaArgs) => MetaDescriptors {
  return (args) => {
    const leafMeta = leafMetaFn(args);

    return args.matches.reduceRight((acc, match) => {
      for (const parentMeta of match?.meta ?? []) {
        addUniqueMeta(acc, parentMeta);
      }

      return acc;
    }, leafMeta);
  };
}

function addUniqueMeta(
  acc: MetaDescriptor[] | undefined,
  parentMeta: MetaDescriptor
) {
  if (acc?.findIndex((meta) => isMetaEqual(meta, parentMeta)) === -1) {
    acc.push(parentMeta);
  }
}

function isMetaEqual(meta1: MetaDescriptor, meta2: MetaDescriptor): boolean {
  return (
    ('name' in meta1 && 'name' in meta2 && meta1.name === meta2.name) ||
    ('property' in meta1 &&
      'property' in meta2 &&
      meta1.property === meta2.property) ||
    ('title' in meta1 && 'title' in meta2) ||
    /**
     * Final attempt where some meta slips through the above checks and duplication is still possible.
     *
     * E.g. `{ href: "https://example.com/my-stylesheet/${aDynamicOrgId}", rel: "stylesheet", tagName: "link" }` where
     * we wouldn't want two of the same link to exist.
     */
    JSON.stringify(meta1) === JSON.stringify(meta2)
  );
}
