import { useMutation } from '@tanstack/react-query';
import type { Editor } from '@tiptap/core';
import { FileCogIcon, Loader2Icon, SaveIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router';
import { toast } from 'sonner';
import { cn } from '~/lib/classname';
import { httpPost } from '~/lib/http';
import type { Database } from '~/types/database';
import { CopyEmailHtml } from './copy-email-html';
import { DeleteEmailDialog } from './delete-email-dialog';
import { EmailEditor } from './email-editor';
import { PreviewEmailDialog } from './preview-email-dialog';

type EmailEditorSandboxProps = {
  template?: Database['public']['Tables']['mails']['Row'];
};

type UpdateTemplateData = {
  title: string;
  previewText: string;
  content: string;
};

type SaveTemplateResponse = {
  template: Database['public']['Tables']['mails']['Row'];
};

export function EmailEditorSandbox(props: EmailEditorSandboxProps) {
  const { template } = props;

  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const [subject, setSubject] = useState(template?.title || '');
  const [previewText, setPreviewText] = useState(template?.preview_text || '');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [editor, setEditor] = useState<Editor | null>(null);

  const { mutateAsync: updateTemplate, isPending: isUpdateTemplatePending } =
    useMutation({
      mutationFn: (data: UpdateTemplateData) => {
        return httpPost(`/api/v1/templates/${template?.id}`, data);
      },
      onSettled: () => {
        revalidator.revalidate();
      },
    });

  const { mutateAsync: saveTemplate, isPending: isSaveTemplatePending } =
    useMutation({
      mutationFn: (data: UpdateTemplateData) => {
        return httpPost<SaveTemplateResponse>(`/api/v1/templates`, data);
      },
      onSuccess: (data) => {
        navigate(`/templates/${data.template.id}`);
      },
    });

  return (
    <>
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <PreviewEmailDialog previewText={previewText} editor={editor} />
          <CopyEmailHtml previewText={previewText} editor={editor} />
        </div>

        {!template?.id && (
          <button
            className={cn(
              'flex min-h-[28px] cursor-pointer items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed max-sm:w-7'
            )}
            disabled={isSaveTemplatePending}
            onClick={() => {
              const json = editor?.getJSON();

              const trimmedSubject = subject.trim();
              const trimmedPreviewText = previewText.trim();
              if (!trimmedSubject || !json) {
                toast.error('Subject, Preview Text and Content are required');
                return;
              }

              if (trimmedSubject.length < 3) {
                toast.error('Subject must be at least 3 characters');
                return;
              }

              toast.promise(
                saveTemplate({
                  title: trimmedSubject,
                  previewText: trimmedPreviewText,
                  content: JSON.stringify(json),
                }),
                {
                  loading: 'Saving Template...',
                  success: 'Template has been saved',
                  error: (err) => err?.message || 'Failed to save email',
                }
              );
            }}
          >
            {isSaveTemplatePending ? (
              <Loader2Icon className="inline-block size-4 shrink-0 animate-spin sm:mr-1" />
            ) : (
              <SaveIcon className="inline-block size-4 shrink-0 sm:mr-1" />
            )}
            <span className="hidden sm:inline-block">Save</span>
          </button>
        )}

        {template?.id && (
          <div className="flex items-center gap-1.5">
            <DeleteEmailDialog templateId={template.id} />
            <button
              className={cn(
                'flex min-h-[28px] cursor-pointer items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed max-sm:w-7'
              )}
              disabled={isUpdateTemplatePending}
              onClick={() => {
                const json = editor?.getJSON();

                const trimmedSubject = subject.trim();
                const trimmedPreviewText = previewText.trim();
                if (!trimmedSubject || !json) {
                  toast.error('Subject, Preview Text and Content are required');
                  return;
                }

                if (trimmedSubject.length < 3) {
                  toast.error('Subject must be at least 3 characters');
                  return;
                }

                toast.promise(
                  updateTemplate({
                    title: trimmedSubject,
                    previewText: trimmedPreviewText,
                    content: JSON.stringify(json),
                  }),
                  {
                    loading: 'Updating Template...',
                    success: 'Template has been updated',
                    error: (err) => err?.message || 'Failed to update email',
                  }
                );
              }}
            >
              {isUpdateTemplatePending ? (
                <Loader2Icon className="inline-block size-4 shrink-0 animate-spin sm:mr-1" />
              ) : (
                <FileCogIcon className="inline-block size-4 shrink-0 sm:mr-1" />
              )}
              <span className="hidden sm:inline-block">Update</span>
            </button>
          </div>
        )}
      </div>

      <EmailEditor
        key={template?.id}
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
