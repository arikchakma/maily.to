import type { LucideIcon } from 'lucide-react';

type TurnIntoOption = {
  disabled?: boolean;
  icon: LucideIcon;
  id: string;
  isActive: boolean;
  label: string;
  onClick: () => void;
  type: 'option';
};

type TurnIntoCategory = {
  id: string;
  label: string;
  type: 'category';
};

export type TurnIntoItem = TurnIntoCategory | TurnIntoOption;
export type TurnIntoItems = TurnIntoItem[];

function isTurnIntoOption(item: TurnIntoItem): item is TurnIntoOption {
  return item.type === 'option';
}

export function isTurnIntoCategory(
  item: TurnIntoItem
): item is TurnIntoCategory {
  return item.type === 'category';
}

export function isActiveTurnIntoItem(
  item: TurnIntoItem
): item is TurnIntoOption {
  return isTurnIntoOption(item) && item.isActive;
}
