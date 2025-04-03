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
    if (fetcher.data && fetcher.data?.status === 400 && fetcher.data?.errors) {
      toast.error(fetcher.data.message || 'Failed to sign in');
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form className="flex grow flex-col" method="POST" ref={formRef}>
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            className="border-gray-300"
            id="email"
            name="email"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <Label htmlFor="email">Password</Label>
          <Input
            type="password"
            className="border-gray-300"
            id="password"
            name="password"
          />
        </div>

        <button
          className="mt-2 flex h-9 items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={busy}
          type="submit"
        >
          {busy ? <Loader2Icon className="h-5 w-5 animate-spin" /> : 'Sign in'}
        </button>
      </div>
    </fetcher.Form>
  );
}
