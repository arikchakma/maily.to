import { useState, useEffect } from 'react';

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

export function useCopyToClipboard(timeout = 2000): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  // Clear copiedText after 'timeout' milliseconds
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (copiedText) {
      timer = setTimeout(() => {
        setCopiedText(null);
      }, timeout);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [copiedText, timeout]);

  const copy: CopyFn = async (text) => {
    if (!navigator.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}
