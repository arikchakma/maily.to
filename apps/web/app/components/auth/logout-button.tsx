import { useFetcher } from 'react-router';
import { Button } from '../ui/button';
import { Loader2Icon, LogOutIcon } from 'lucide-react';

export function LogoutButton() {
  const fetcher = useFetcher({
    key: 'logout',
  });
  const busy = fetcher.state !== 'idle';

  return (
    <fetcher.Form
      action="/auth/logout"
      className="flex grow flex-col"
      method="post"
    >
      <Button
        className="gap-2"
        size="sm"
        type="submit"
        variant="destructive"
        disabled={busy}
      >
        {busy && <Loader2Icon className="h-4 w-4 animate-spin" />}
        {!busy && <LogOutIcon className="h-4 w-4" />}
        Logout
      </Button>
    </fetcher.Form>
  );
}
