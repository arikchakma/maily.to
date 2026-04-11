import { ImageIcon } from 'lucide-react';

import { ImageState } from './image-state';

export function ImageIdleState() {
  return (
    <ImageState.Root>
      <ImageState.Icon icon={ImageIcon} />
      <ImageState.Label>No image</ImageState.Label>
    </ImageState.Root>
  );
}
