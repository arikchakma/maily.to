import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import type { Editor } from '@tiptap/core';
import { ImportIcon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

type ImportEmailHtmlProps = {
  editor: Editor | null;
};

export function ImportEmailHtml(props: ImportEmailHtmlProps) {
  const { editor } = props;

  const [open, setOpen] = useState(false);
  const [html, setHtml] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = () => {
    if (!editor) {
      toast.error('Editor not ready');
      return;
    }

    if (!html.trim()) {
      toast.error('Please paste some HTML content');
      return;
    }

    setIsImporting(true);

    try {
      // Insert a divider first to separate new content from imported thread
      editor
        .chain()
        .focus('end')
        .insertContent([
          {
            type: 'horizontalRule',
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [{ type: 'bold' }],
                text: '--- Previous conversation ---',
              },
            ],
          },
          {
            type: 'htmlCodeBlock',
            content: [
              {
                type: 'text',
                text: html.trim(),
              },
            ],
          },
        ])
        .run();

      toast.success('Email thread imported successfully');
      setHtml('');
      setOpen(false);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import HTML');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="flex min-h-[28px] cursor-pointer items-center justify-center rounded-md bg-white px-2 py-1 text-sm text-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 max-lg:w-7"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!editor) {
            toast.error('Editor not ready');
            return;
          }

          setOpen(true);
        }}
      >
        <ImportIcon className="inline-block size-4 shrink-0 lg:mr-1" />
        <span className="hidden lg:inline-block">Import HTML</span>
      </DialogTrigger>

      {open && (
        <DialogContent className="z-[99999] flex max-h-[85vh] max-w-3xl flex-col">
          <DialogHeader>
            <DialogTitle>Import Email Thread</DialogTitle>
            <DialogDescription>
              Paste the HTML from a previous email conversation to continue the
              thread. The imported content will be added at the end of your
              email.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-1 flex-col gap-4">
            <textarea
              className="min-h-[300px] flex-1 resize-none rounded-md border border-gray-200 bg-gray-50 p-4 font-mono text-xs focus:border-gray-400 focus:outline-none"
              placeholder="Paste your email HTML here..."
              value={html}
              onChange={(e) => setHtml(e.target.value)}
            />

            <div className="flex items-center justify-end gap-2">
              <button
                className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                  setHtml('');
                  setOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="flex items-center gap-1 rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleImport}
                disabled={isImporting || !html.trim()}
              >
                {isImporting ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <ImportIcon className="size-4" />
                )}
                Import Thread
              </button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
