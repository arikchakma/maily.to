import { Icons } from '../icons';
import { useFetcher } from 'react-router';
import { Button } from '../ui/button';
import { Loader2Icon } from 'lucide-react';

export function GoogleLoginButton() {
  const fetcher = useFetcher({
    key: 'google-login',
  });
  const busy = fetcher.state !== 'idle';

  return (
    <fetcher.Form className="flex grow flex-col" method="POST">
      <input name="provider" type="hidden" value="google" />
      <Button
        className="gap-2"
        size="sm"
        type="submit"
        variant="outline"
        disabled={busy}
      >
        {busy && <Loader2Icon className="h-4 w-4 animate-spin" />}
        {!busy && <Icons.google className="h-4 w-4" />}
        Continue with Google
      </Button>
    </fetcher.Form>
  );
}
