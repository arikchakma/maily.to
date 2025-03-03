import { NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import { useEffect } from 'react';
import { useState } from 'react';
import { LogoAttributes, logoSizes } from './logo';
import { ImageStatus, ImageStatusLabel } from '../image/image-view';

export function LogoView(props: NodeViewProps) {
  const { node, editor } = props;

  const [status, setStatus] = useState<ImageStatus>('idle');

  let {
    alignment = 'center',
    src: logoSrc,
    isSrcVariable,
    size = 'sm',
  } = (node.attrs || {}) as LogoAttributes;

  const hasImageSrc = !!logoSrc;

  // load the image using new Image() to avoid layout shift
  // then if the image is loaded, set the status to loaded
  useEffect(() => {
    if (!logoSrc) {
      return;
    }

    setStatus('loading');
    const img = new Image();
    img.src = logoSrc;
    img.onload = () => {
      setStatus('loaded');
    };
    img.onerror = () => {
      setStatus('error');
    };

    return () => {
      img.src = '';
      img.onload = null;
      img.onerror = null;
    };
  }, [logoSrc]);

  const logoSize = logoSizes[size];

  return (
    <NodeViewWrapper
      as="div"
      draggable={editor.isEditable}
      data-drag-handle={editor.isEditable}
      style={{
        overflow: 'hidden',
        position: 'relative',
        // Weird! Basically tiptap/prose wraps this in a span and the line height causes an annoying buffer.
        lineHeight: '0px',
        display: 'block',
      }}
    >
      {!hasImageSrc && <ImageStatusLabel status="idle" minHeight={logoSize} />}
      {hasImageSrc && isSrcVariable && (
        <ImageStatusLabel status="variable" minHeight={logoSize} />
      )}
      {hasImageSrc && status === 'loading' && !isSrcVariable && (
        <ImageStatusLabel status="loading" minHeight={logoSize} />
      )}
      {hasImageSrc && status === 'error' && !isSrcVariable && (
        <ImageStatusLabel status="error" minHeight={logoSize} />
      )}

      {hasImageSrc && status === 'loaded' && !isSrcVariable && (
        <img
          src={logoSrc}
          alt="Logo"
          style={{
            height: logoSize,
            width: logoSize,
            cursor: 'default',
            marginBottom: 0,
            ...({
              center: { marginLeft: 'auto', marginRight: 'auto' },
              left: { marginRight: 'auto' },
              right: { marginLeft: 'auto' },
            }[alignment] || {}),
          }}
          draggable={editor.isEditable}
        />
      )}
    </NodeViewWrapper>
  );
}
