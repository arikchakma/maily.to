import { Loader2Icon } from 'lucide-react';

type ImageLoadingStateProps = {
  src: string;
  alt?: string;
};

export function ImageLoadingState(props: ImageLoadingStateProps) {
  const { src, alt } = props;

  return (
    <div className="mly:relative">
      <img
        src={src}
        alt={alt}
        className="mly:h-auto mly:w-full mly:max-w-full mly:opacity-40"
      />
      <div className="mly:absolute mly:inset-0 mly:flex mly:items-center mly:justify-center">
        <Loader2Icon className="mly:size-6 mly:animate-spin mly:stroke-3 mly:text-gray-600" />
      </div>
    </div>
  );
}
