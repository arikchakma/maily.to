'use client';

import { cn } from '@/utils/classname';
import { ApiConfiguration } from './api-config';
import { CopyEmailHtml } from './copy-email-html';
import { DeleteEmail } from './delete-email';
import { PreviewEmail } from './preview-email';
import { SendTestEmail } from './send-test-email';
import { UpdateEmail } from './update-email';
import { useEditorContext } from '@/stores/editor-store';
import { SaveEmail } from './save-email';

type EditorTopbarProps = {
  templateId?: string;
  showSaveButton?: boolean;
  className?: string;
};

export function EditorTopbar(props: EditorTopbarProps) {
  const { templateId, showSaveButton, className } = props;

  const isEditorFocused = useEditorContext((s) => s.isEditorFocused);

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-1.5',
        'transition-all duration-200 ease-in-out',
        isEditorFocused ? 'opacity-30' : 'opacity-100',
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <ApiConfiguration />
        <PreviewEmail />
        <CopyEmailHtml />
        <SendTestEmail />
      </div>

      {templateId && (
        <div className="flex items-center gap-1.5">
          <DeleteEmail templateId={templateId} />
          <UpdateEmail templateId={templateId} />
        </div>
      )}

      {showSaveButton && <SaveEmail />}
    </div>
  );
}
