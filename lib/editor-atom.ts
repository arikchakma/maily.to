import { atom } from 'jotai';

import { MailEditor } from '@/components/editor';

export const editorAtom = atom<MailEditor | null>(null);
