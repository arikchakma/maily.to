import { Editor } from '@tiptap/core';
import { atom } from 'jotai';

import { MailEditor } from '@/components/editor';

export const editorAtom = atom<MailEditor | null>(null);
export const appEditorAtom = atom<Editor | null>(null);
export const subjectAtom = atom<string>('');
