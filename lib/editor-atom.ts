import { atom } from 'jotai';

import { MailEditor } from '@/components/editor';
import { Editor } from '@tiptap/core';

export const editorAtom = atom<MailEditor | null>(null);
export const appEditorAtom = atom<Editor | null>(null);
export const subjectAtom = atom<string>('');
