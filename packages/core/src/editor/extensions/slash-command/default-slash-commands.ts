import { button, linkCard } from '@/blocks/button';
import { image, logo } from '@/blocks/image';
import { columns, divider, repeat, section, spacer } from '@/blocks/layout';
import { bulletList, orderedList } from '@/blocks/list';
import { BlockItem } from '@/blocks/types';
import {
  blockquote,
  clearLine,
  footer,
  hardBreak,
  heading1,
  heading2,
  heading3,
  text,
} from '@/blocks/typography';

export const DEFAULT_SLASH_COMMANDS: BlockItem[] = [
  text,
  heading1,
  heading2,
  heading3,
  bulletList,
  orderedList,
  image,
  logo,
  columns,
  section,
  repeat,
  divider,
  spacer,
  button,
  linkCard,
  hardBreak,
  blockquote,
  footer,
  clearLine,
];
