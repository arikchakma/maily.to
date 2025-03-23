import { Loader2Icon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function EmailLoginForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const fetcher = useFetcher({
    key: 'email-login',
  });
  const busy = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.data && fetcher.data.status === 200) {
      toast.success('Magic link sent');
      formRef.current?.reset();
    } else if (
      fetcher.data &&
      fetcher.data?.status === 400 &&
      fetcher.data?.errors
    ) {
      toast.error(fetcher.data.message || 'Failed to send magic link');
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form className="flex grow flex-col" method="POST" ref={formRef}>
      <input name="provider" type="hidden" value="email" />

      <div>
        <Label className="sr-only" htmlFor="email">
          Email
        </Label>
        <Input
          className="border-gray-300"
          id="email"
          name="email"
          placeholder="john@example.com"
        />
      </div>

      <button
        className="mt-2 flex h-9 items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
        disabled={busy}
        type="submit"
      >
        {busy ? (
          <Loader2Icon className="h-5 w-5 animate-spin" />
        ) : (
          'Send magic link'
        )}
      </button>
    </fetcher.Form>
  );
}
