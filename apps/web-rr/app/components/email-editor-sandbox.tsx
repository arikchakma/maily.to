import type { Editor } from '@tiptap/core';
import { useState } from 'react';
import { EmailEditor } from './email-editor';
import { PreviewEmailDialog } from './preview-email-dialog';
import type { Database } from '~/types/database';

type EmailEditorSandboxProps = {
  template?: Database['public']['Tables']['mails']['Row'];
};

export function EmailEditorSandbox(props: EmailEditorSandboxProps) {
  const { template } = props;

  const [subject, setSubject] = useState(template?.title || '');
  const [previewText, setPreviewText] = useState(template?.preview_text || '');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [editor, setEditor] = useState<Editor | null>(null);

  return (
    <>
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <PreviewEmailDialog previewText={previewText} editor={editor} />
        </div>
      </div>

      <EmailEditor
        defaultContent={template?.content || ''}
        subject={subject}
        setSubject={setSubject}
        previewText={previewText}
        setPreviewText={setPreviewText}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
        replyTo={replyTo}
        setReplyTo={setReplyTo}
        setEditor={setEditor}
      />
    </>
  );
}
