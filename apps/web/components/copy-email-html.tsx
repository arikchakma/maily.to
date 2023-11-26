'use client';

import { useFormStatus } from 'react-dom';
import { ClipboardCopy, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { previewEmailAction } from '@/actions/email';
import { useEditorStrore } from '@/stores/use-editor';
import { useServerAction } from '@/utils/use-server-action';
import { useCopyToClipboard } from '@/utils/use-copy-to-clipboard';

interface SubmitButtonProps {
  disabled?: boolean;
}

function SubmitButton(props: SubmitButtonProps) {
  const { disabled } = props;
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md bg-black px-2 py-1 text-sm text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <Loader2 className="inline-block mr-1 animate-spin" size={16} />
      ) : (
        <ClipboardCopy className="inline-block mr-1" size={16} />
      )}
      Copy HTML
    </button>
  );
}

export function CopyEmailHtml() {
  const { json, previewText } = useEditorStrore();
  const [_, copy] = useCopyToClipboard();

  const [action] = useServerAction(previewEmailAction, (result) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Result is always there
    const { data, error } = result!;
    if (error) {
      toast.error(error.message || 'Something went wrong');
      return;
    }

    copy(data);
    toast.success('Email HTML copied to clipboard');
  });

  return (
    <form action={action}>
      <input name="json" type="hidden" value={JSON.stringify(json) || ''} />
      <input name="previewText" type="hidden" value={previewText} />
      <SubmitButton disabled={!json} />
    </form>
  );
}
