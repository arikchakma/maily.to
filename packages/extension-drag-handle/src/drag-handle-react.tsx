import type { Editor } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import type { Plugin } from '@tiptap/pm/state';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { defaultComputePositionConfig } from './drag-handle-extension';
import type { DragHandlePluginProps } from './drag-handle-plugin';
import {
  DragHandlePlugin,
  dragHandlePluginDefaultKey,
} from './drag-handle-plugin';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type OnNodeChange = (data: {
  node: Node | null;
  editor: Editor;
  pos: number;
}) => void;

export type DragHandleProps = Omit<
  Optional<DragHandlePluginProps, 'pluginKey'>,
  'element'
> & {
  className?: string;
  onNodeChange?: OnNodeChange;
  children: ReactNode;
};

export function DragHandle(props: DragHandleProps): ReactNode {
  const {
    className = 'drag-handle',
    children,
    editor,
    pluginKey = dragHandlePluginDefaultKey,
    onNodeChange,
    onElementDragStart,
    onElementDragEnd,
    computePositionConfig = defaultComputePositionConfig,
  } = props;
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const plugin = useRef<Plugin | null>(null);

  useEffect(() => {
    let initPlugin: {
      plugin: Plugin;
      unbind: () => void;
    } | null = null;

    if (!element) {
      return () => {
        plugin.current = null;
      };
    }

    if (editor.isDestroyed) {
      return () => {
        plugin.current = null;
      };
    }

    if (!plugin.current) {
      initPlugin = DragHandlePlugin({
        editor,
        element,
        pluginKey,
        computePositionConfig: {
          ...defaultComputePositionConfig,
          ...computePositionConfig,
        },
        onElementDragStart,
        onElementDragEnd,
        onNodeChange,
      });
      plugin.current = initPlugin.plugin;

      editor.registerPlugin(plugin.current);
    }

    return () => {
      editor.unregisterPlugin(pluginKey);
      plugin.current = null;
      if (initPlugin) {
        initPlugin.unbind();
        initPlugin = null;
      }
    };
  }, [
    element,
    editor,
    onNodeChange,
    pluginKey,
    computePositionConfig,
    onElementDragStart,
    onElementDragEnd,
  ]);

  return (
    <div
      className={className}
      style={{ visibility: 'hidden', position: 'absolute' }}
      ref={setElement}
    >
      {children}
    </div>
  );
}
