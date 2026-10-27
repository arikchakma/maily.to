import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';

import { VisuallyHidden } from '~/components/interface/visually-hidden';
import { ALLOWED_IMAGE_MIME_TYPES } from '~/extensions/image-upload/image-upload';

export type ImageStateName =
  | 'error'
  | 'idle'
  | 'loading'
  | 'placeholder'
  | 'variable';

type ImageStateProps = ComponentPropsWithRef<'div'> & {
  icon?: LucideIcon;
  state: ImageStateName;
};

export function ImageState(props: ImageStateProps) {
  const { children, icon: Icon, state, ...rest } = props;

  return (
    <div {...rest} data-mly-image-state="" data-state={state}>
      {Icon ? <Icon size={16} strokeWidth={2.5} /> : null}
      <span data-mly-image-state-label="">{children}</span>
    </div>
  );
}

export function ImageIdleState() {
  return <ImageState state="idle">No image</ImageState>;
}

export function ImageErrorState() {
  return (
    <ImageState role="alert" state="error">
      Failed to upload image
    </ImageState>
  );
}

export function ImageVariableState() {
  return <ImageState state="variable">Dynamic image source</ImageState>;
}

type ImageLoadingStateProps = {
  alt?: string | null;
  src: string;
};

export function ImageLoadingState(props: ImageLoadingStateProps) {
  const { alt, src } = props;

  return (
    <div aria-busy="true" data-mly-image-loading="">
      <img alt={alt ?? undefined} data-mly-image-preview="" src={src} />
      <span data-mly-image-spinner="" />
      <VisuallyHidden role="status">Uploading image</VisuallyHidden>
    </div>
  );
}

type ImagePlaceholderProps = {
  onFileSelect: (file: File) => void;
};

export function ImagePlaceholder(props: ImagePlaceholderProps) {
  const { onFileSelect } = props;

  return (
    <ImageState state="placeholder">
      Click or drop an image here
      <input
        accept={ALLOWED_IMAGE_MIME_TYPES.join(',')}
        data-mly-image-input=""
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onFileSelect(file);
          }
        }}
        type="file"
      />
    </ImageState>
  );
}
