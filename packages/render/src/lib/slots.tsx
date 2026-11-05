import { Img, Preview } from '@react-email/components';

import type { RenderContext } from '../context';
import { preview as renderPreview } from './preview';

export function getPreviewSlot(ctx: RenderContext): React.ReactNode {
  const { preview } = ctx.config;
  if (!preview) {
    return null;
  }

  return <Preview>{renderPreview({ ctx, preview })}</Preview>;
}

export function getTrackingPixelSlot(ctx: RenderContext): React.ReactNode {
  const { openTrackingPixel } = ctx.config;
  if (!openTrackingPixel) {
    return null;
  }

  return (
    <Img
      alt=""
      height="1"
      src={openTrackingPixel}
      style={{ display: 'none' }}
      width="1"
    />
  );
}
