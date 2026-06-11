import { clamp } from '@maily-to/shared';
import type { UIEvent } from 'react';
import { useRef } from 'react';

type UseSuggestionFaderScrollOptions = {
  itemCount: number;
  threshold?: number;
};

export function useSuggestionFaderScroll(
  options: UseSuggestionFaderScrollOptions
) {
  const { itemCount, threshold = 6 } = options;

  const topFaderRef = useRef<HTMLDivElement | null>(null);
  const bottomFaderRef = useRef<HTMLDivElement | null>(null);

  const showFaders = itemCount >= threshold;

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    if (!showFaders) {
      return;
    }

    const bottomFader = bottomFaderRef.current;
    const topFader = topFaderRef.current;
    if (!bottomFader || !topFader) {
      return;
    }

    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    const scrollBottom = scrollTop + clientHeight;

    const distance = scrollHeight - scrollBottom;
    const bottomOpacity = clamp(distance / 17, [0, 1]);
    bottomFader.style.opacity = String(bottomOpacity);

    const topDistance = scrollTop;
    const topOpacity = clamp(topDistance / 15, [0, 1]);
    topFader.style.opacity = String(topOpacity);
  };

  return {
    showFaders,
    topFaderRef,
    bottomFaderRef,
    onScroll,
  };
}
