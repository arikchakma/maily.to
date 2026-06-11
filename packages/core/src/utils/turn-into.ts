import type { LucideIcon } from 'lucide-react';

type TurnIntoOption = {
  type: 'option';
  id: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  isActive: boolean;
  onClick: () => void;
};

type TurnIntoCategory = {
  type: 'category';
  id: string;
  label: string;
};

export type TurnIntoItem = TurnIntoOption | TurnIntoCategory;
export type TurnIntoItems = Array<TurnIntoItem>;

function isTurnIntoOption(option: TurnIntoItem): option is TurnIntoOption {
  return option.type === 'option';
}

export function isTurnIntoCategory(
  option: TurnIntoItem
): option is TurnIntoCategory {
  return option.type === 'category';
}

export function isActiveTurnIntoItem(
  item: TurnIntoItem
): item is TurnIntoOption {
  return isTurnIntoOption(item) && item.isActive;
}
