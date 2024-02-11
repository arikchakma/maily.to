'use client';

// @ts-ignore
import { useFormStatus } from 'react-dom';
import { ClipboardCopy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { shallow } from 'zustand/shallow';
import { previewEmailAction } from '@/actions/email';
import { useServerAction } from '@/utils/use-server-action';
import { useCopyToClipboard } from '@/utils/use-copy-to-clipboard';
import { useEditorContext } from '@/stores/editor-store';
import { catchActionError } from '@/actions/error';

interface SubmitButtonProps {
  disabled?: boolean;
}

function SubmitButton(props: SubmitButtonProps) {
  const { disabled } = props;
  const { pending } = useFormStatus();

  return (
    <button
      className="flex min-h-[28px] items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-7"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <Loader2
          className="inline-block shrink-0 animate-spin sm:mr-1"
          size={16}
        />
      ) : (
        <ClipboardCopy className="inline-block shrink-0 sm:mr-1" size={16} />
      )}
      <span className="hidden sm:inline-block">Copy HTML</span>
    </button>
  );
}

export function CopyEmailHtml() {
  const { json, previewText } = useEditorContext((s) => {
    return {
      json: s.json,
      previewText: s.previewText,
    };
  }, shallow);
  const [_, copy] = useCopyToClipboard();

  const [action] = useServerAction(
    catchActionError(previewEmailAction),
    async (result) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Result is always there
      const { data, error } = result!;
      if (error) {
        toast.error(error.message || 'Something went wrong');
        return;
      }

      await copy(data);
      toast.success('Email HTML copied to clipboard');
    }
  );

  return (
    <form action={action}>
      <input name="json" type="hidden" value={JSON.stringify(json) || ''} />
      <input name="previewText" type="hidden" value={previewText} />
      <SubmitButton disabled={!json} />
    </form>
  );
}
