'use client';

import '../editor/editor.css';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EditorContent, useEditor } from '@tiptap/react';
import { useAtom } from 'jotai';
import { Loader2 } from 'lucide-react';

import { appEditorAtom } from '@/lib/editor-atom';
import { fetcher, QueryError } from '@/utils/fetcher';
import { MailsRowType } from '@/app/(playground)/playground/page';

import { EditorBubbleMenu } from '../editor/components/editor-bubble-menu';
import { LogoBubbleMenu } from '../editor/components/logo-bubble-menu';
import { SpacerBubbleMenu } from '../editor/components/spacer-bubble-menu';
import { TiptapExtensions } from '../editor/extensions';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { AppEditorMenuBar } from './app-editor-menubar';
import { AppEmailPreviewDialog } from './app-email-preview-dialog';
import { AppGetHtmlButton } from './app-get-html-button';

type AppEditorProps = {
  params?: {
    templateId: string;
  };
  template?: MailsRowType;
};

export function AppEditor(props: AppEditorProps) {
  const { templateId } = props.params ?? {};
  const { template } = props;

  const [subject, setSubject] = useState(template?.title ?? '');
  const [_, setEditor] = useAtom(appEditorAtom);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: `prose w-full`,
        spellCheck: 'true',
      },
      handleDOMEvents: {
        keydown: (_view, event) => {
          // prevent default event listeners from firing when slash command is active
          if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
            const slashCommand = document.querySelector('#slash-command');
            if (slashCommand) {
              return true;
            }
          }
        },
      },
    },
    onCreate(props) {
      setEditor(props?.editor);
    },
    extensions: TiptapExtensions,
    content: JSON.parse(
      (template?.content as string) ??
      `{
      "type": "doc",
      "content": [
        {
          "type": "paragraph"
        }
      ]
    }`
    ),
  });

  const getTemplate = useQuery({
    queryKey: ['template', templateId],
    queryFn: () => {
      return fetcher<MailsRowType>(`/api/v1/get-template/${templateId}`);
    },
    enabled: !!templateId,
    onSuccess: (data) => {
      setSubject(data?.title ?? '');
      editor?.commands.setContent(JSON.parse((data?.content as string) ?? ''));
    },
    onError: (error: QueryError) => {
      toast({
        variant: 'destructive',
        title: 'Error fetching the template.',
        description: error?.message ?? 'Something went wrong',
      });
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    initialData: template,
  });

  const saveTemplate = useMutation({
    mutationFn: () => {
      return fetcher<MailsRowType>('/api/v1/save-template', {
        method: 'POST',
        body: JSON.stringify({
          title: subject,
          content: editor?.getJSON() ?? {
            type: 'doc',
            content: [{ type: 'paragraph' }],
          },
        }),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['templates']);
      router.replace(`/template/${data.id}`);
    },
    onError: (error: QueryError) => {
      toast({
        variant: 'destructive',
        title: 'Error saving the template.',
        description: error?.message ?? 'Something went wrong',
      });
    },
  });

  const updateTemplate = useMutation({
    mutationFn: () => {
      return fetcher<MailsRowType>(`/api/v1/update-template/${templateId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: subject,
          content: editor?.getJSON() ?? {
            type: 'doc',
            content: [{ type: 'paragraph' }],
          },
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      queryClient.invalidateQueries(['template', templateId]);
      toast({
        title: 'Template updated successfully.',
      });
    },
    onError: (error: QueryError) => {
      toast({
        variant: 'destructive',
        title: 'Error updating the template.',
        description: error?.message ?? 'Something went wrong',
      });
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: () => {
      return fetcher<MailsRowType>(`/api/v1/delete-template/${templateId}`, {
        method: 'DELETE',
        body: JSON.stringify({}),
      });
    },
    onSuccess: () => {
      setSubject('');
      editor?.commands.setContent({
        type: 'doc',
        content: [{ type: 'paragraph' }],
      });
      queryClient.invalidateQueries(['templates']);
      router.push('/template');
    },
    onError: (error: QueryError) => {
      toast({
        variant: 'destructive',
        title: 'Error updating the template.',
        description: error?.message ?? 'Something went wrong',
      });
    },
  });

  return (
    <>
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject"
            className="mt-2 w-full"
          />
        </div>
      </div>
      {editor && (
        <>
          <div className="mail-editor mt-6 overflow-hidden rounded-md border antialiased">
            <AppEditorMenuBar editor={editor} />
            <div className="bg-white p-4">
              <EditorBubbleMenu editor={editor} />
              <LogoBubbleMenu editor={editor} />
              <SpacerBubbleMenu editor={editor} />
              <EditorContent editor={editor} />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AppEmailPreviewDialog editor={editor} />
              <AppGetHtmlButton editor={editor} />
            </div>

            <div className="flex items-center">
              {templateId && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    deleteTemplate.mutate();
                  }}
                  className="mr-2 min-w-[100px]"
                >
                  {deleteTemplate.isLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    'Delete'
                  )}
                </Button>
              )}

              <Button
                disabled={saveTemplate.isLoading || updateTemplate.isLoading}
                onClick={() => {
                  if (templateId) {
                    updateTemplate.mutate();
                    return;
                  }
                  if (!subject.trim()) {
                    toast({
                      variant: 'destructive',
                      title: 'Subject is required.',
                      description: 'Please enter a subject.',
                    });
                    return;
                  }
                  saveTemplate.mutate();
                }}
                className="min-w-[100px]"
              >
                {saveTemplate.isLoading || updateTemplate.isLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>{templateId ? 'Update' : 'Save'}</>
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
