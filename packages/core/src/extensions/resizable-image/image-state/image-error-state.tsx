import { CircleAlertIcon } from 'lucide-react';

import { ImageState } from './image-state';

export function ImageErrorState() {
  return (
    <ImageState.Root className="mly:text-red-500">
      <ImageState.Icon icon={CircleAlertIcon} />
      <ImageState.Label>Failed to upload image</ImageState.Label>
    </ImageState.Root>
  );
}
