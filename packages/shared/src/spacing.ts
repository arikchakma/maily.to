import { MAILY_NODE_TYPES } from './node';

export const BLOCK_CONTAINER_TYPES: string[] = [
  MAILY_NODE_TYPES.DOCUMENT,
  MAILY_NODE_TYPES.BODY,
  MAILY_NODE_TYPES.CONTAINER,
  MAILY_NODE_TYPES.SECTION,
  MAILY_NODE_TYPES.COLUMN,
  MAILY_NODE_TYPES.REPEAT,
  MAILY_NODE_TYPES.BULLET_LIST,
  MAILY_NODE_TYPES.ORDERED_LIST,
];

export const MARGIN_TOP_ABSORBER_TYPES: string[] = [MAILY_NODE_TYPES.SPACER];

export const MARGIN_BOTTOM_ABSORBER_TYPES: string[] = [
  MAILY_NODE_TYPES.SPACER,
  MAILY_NODE_TYPES.HORIZONTAL_RULE,
];

export type NodePosition = {
  isFirst: boolean;
  isLast: boolean;
  nextType?: string | undefined;
  parentType?: string | undefined;
  previousType?: string | undefined;
};

export function getSuppressedMargins(position: NodePosition) {
  const { isFirst, isLast, nextType, parentType, previousType } = position;
  const stacks =
    parentType !== undefined && BLOCK_CONTAINER_TYPES.includes(parentType);

  return {
    marginBottom:
      !stacks ||
      isLast ||
      MARGIN_BOTTOM_ABSORBER_TYPES.includes(nextType ?? ''),
    marginTop:
      !stacks ||
      isFirst ||
      MARGIN_TOP_ABSORBER_TYPES.includes(previousType ?? ''),
  };
}
