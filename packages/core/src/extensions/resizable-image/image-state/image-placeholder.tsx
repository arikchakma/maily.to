import { ArrowDownToLineIcon, GrabIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import { cn } from '~/utils/classname';

import { ALLOWED_IMAGE_MIME_TYPES } from '../../image-upload/image-upload';
import { ImageState } from './image-state';

type ImagePlaceholderProps = {
  onFileSelect: (file: File) => void;
};

export function ImagePlaceholder(props: ImagePlaceholderProps) {
  const { onFileSelect } = props;
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);
    },
    []
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);

      const file = event.dataTransfer.files[0];
      if (
        file &&
        (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)
      ) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <ImageState.Root
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'mly:relative mly:cursor-pointer mly:bubble-container-border mly:transition-colors',
        isDragOver
          ? 'mly:bg-gray-200'
          : 'hover:mly:bg-soft-gray/60 mly:bg-soft-gray'
      )}
    >
      <ImageState.Icon icon={isDragOver ? ArrowDownToLineIcon : GrabIcon} />
      <ImageState.Label>
        {isDragOver ? 'Drop image to upload' : 'Click or Drop image here'}
      </ImageState.Label>
      <input
        type="file"
        accept={ALLOWED_IMAGE_MIME_TYPES.join(',')}
        className="mly:absolute mly:inset-0 mly:cursor-pointer mly:opacity-0"
        onChange={handleFileChange}
      />
    </ImageState.Root>
  );
}
