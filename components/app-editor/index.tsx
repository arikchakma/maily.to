'use client';

import React, { useEffect } from 'react';
import {
  EditorContent,
  Editor as TipTapEditor,
  useEditor,
} from '@tiptap/react';

import { EditorBubbleMenu } from '../editor/components/editor-bubble-menu';
import { LogoBubbleMenu } from '../editor/components/logo-bubble-menu';
import { SpacerBubbleMenu } from '../editor/components/spacer-bubble-menu';
import { TiptapExtensions } from '../editor/extensions';

import '../editor/editor.css';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AppEditorMenuBar } from './app-editor-menubar';
import { AppEmailPreviewDialog } from './app-email-preview-dialog';
import { AppGetHtmlButton } from './app-get-html-button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryError, fetcher } from '@/utils/fetcher';
import { useToast } from '../ui/use-toast';
import { MailsRowType } from '@/app/(playground)/playground/page';
import { useAtom } from 'jotai';
import { appEditorAtom, subjectAtom } from '@/lib/editor-atom';

type AppEditorProps = {
  searchParams?: {
    t: string;
  }
};

export function AppEditor(props: AppEditorProps) {
  const [subject, setSubject] = useAtom(subjectAtom)
  const [_, setEditor] = useAtom(appEditorAtom)

  const { t: templateId } = props.searchParams ?? {}
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
      setEditor(props?.editor)
    },
    extensions: TiptapExtensions,
    content: `<p></p>`,
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
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      router.replace(`/template?t=${templateId}`);
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
    onSuccess: () => {
      queryClient.invalidateQueries(['mails']);
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
          <div className="mt-6 overflow-hidden rounded-md border antialiased">
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

            <Button
              disabled={saveTemplate.isLoading || updateTemplate.isLoading}
              onClick={() => {
                if (templateId) {
                  updateTemplate.mutate();
                  return;
                }
                saveTemplate.mutate();
              }}
            >
              {templateId ? 'Update' : 'Save'}
            </Button>
          </div>
        </>
      )}
    </>
  );
}
