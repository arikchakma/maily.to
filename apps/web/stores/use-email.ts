import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

type EmailStrore = {
  subject: string;
  setSubject: (subject: string) => void;
  from: string;
  setFrom: (from: string) => void;
  to: string;
  setTo: (to: string) => void;
  replyTo: string;
  setReplyTo: (replyTo: string) => void;
};

export const useEmailStrore = createWithEqualityFn<EmailStrore>(
  (set) => ({
    subject: '',
    setSubject: (subject) => set(() => ({ subject })),
    from: '',
    setFrom: (from) => set(() => ({ from })),
    to: '',
    setTo: (to) => set(() => ({ to })),
    replyTo: '',
    setReplyTo: (replyTo) => set(() => ({ replyTo })),
  }),
  shallow
);
