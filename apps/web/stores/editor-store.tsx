'use client';

import { MailyEditor } from '@maily-to/core';
import { JSONContent } from '@tiptap/core';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useRef } from 'react';
import { createStore } from 'zustand';
import { useStoreWithEqualityFn } from 'zustand/traditional';

interface EditorProps {
  editor?: MailyEditor;
  json: JSONContent;
  previewText: string;

  subject: string;
  from: string;
  to: string;
  replyTo?: string;

  provider?: string;
  apiKey?: string;
  endpoint?: string;

  isEditorFocused: boolean;
}

interface EditorState extends EditorProps {
  setEditor: (editor: MailyEditor | undefined) => void;
  setJson: (json: JSONContent) => void;
  setPreviewText: (previewText: string) => void;

  setSubject: (subject: string) => void;
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  setReplyTo: (replyTo: string) => void;

  setProvider: (provider: string) => void;
  setApiKey: (apiKey: string) => void;
  setEndpoint: (endpoint: string) => void;

  setState: (state: Partial<EditorState>) => void;
}

export type EditorStore = ReturnType<typeof createEditorStore>;

const createEditorStore = (initProps?: Partial<EditorProps>) => {
  const DEFAULT_PROPS: EditorProps = {
    editor: undefined,
    json: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello World!',
            },
          ],
        },
      ],
    },

    previewText: '',
    subject: '',
    from: '',
    to: '',
    replyTo: '',

    apiKey: undefined,
    endpoint: undefined,

    isEditorFocused: false,
  };

  return createStore<EditorState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setEditor: (editor) => {
      set(() => ({ editor }));
    },
    setJson: (json) => {
      set(() => ({ json }));
    },
    setPreviewText: (previewText) => {
      set(() => ({ previewText }));
    },
    setSubject: (subject) => {
      set(() => ({ subject }));
    },
    setFrom: (from) => {
      set(() => ({ from }));
    },
    setTo: (to) => {
      set(() => ({ to }));
    },
    setReplyTo: (replyTo) => {
      set(() => ({ replyTo }));
    },

    setProvider: (provider) => {
      set(() => ({ provider }));
    },
    setApiKey: (apiKey) => {
      set(() => ({ apiKey }));
    },
    setEndpoint: (endpoint) => {
      set(() => ({ endpoint }));
    },

    setState: (state) => {
      set(() => state);
    },
  }));
};

export const EditorContext = createContext<EditorStore | null>(null);

type EditorProviderProps = PropsWithChildren<Partial<EditorProps>>;

export function EditorProvider(props: EditorProviderProps) {
  const { children, ...defaultProps } = props;

  const storeRef = useRef<EditorStore>();
  if (!storeRef.current) {
    storeRef.current = createEditorStore(defaultProps);
  }

  return (
    <EditorContext.Provider value={storeRef.current}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext<T>(
  selector: (state: EditorState) => T,
  equalityFn?: (left: T, right: T) => boolean
): T {
  const store = useContext(EditorContext);
  if (!store) {
    throw new Error('Missing EditorContext.Provider in the tree');
  }
  return useStoreWithEqualityFn(store, selector, equalityFn);
}
