import { BracesIcon } from 'lucide-react';

import { ImageState } from './image-state';

export function ImageVariableState() {
  return (
    <ImageState.Root>
      <ImageState.Icon icon={BracesIcon} />
      <ImageState.Label>Dynamic Image Source</ImageState.Label>
    </ImageState.Root>
  );
}
