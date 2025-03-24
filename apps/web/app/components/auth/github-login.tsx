import { Icons } from '../icons';
import { useFetcher } from 'react-router';
import { Button } from '../ui/button';
import { Loader2Icon } from 'lucide-react';

export function GithubLoginButton() {
  const fetcher = useFetcher({
    key: 'github-login',
  });
  const busy = fetcher.state !== 'idle';

  return (
    <fetcher.Form className="flex grow flex-col" method="post">
      <input name="provider" type="hidden" value="github" />
      <Button
        className="gap-2"
        size="sm"
        type="submit"
        variant="outline"
        disabled={busy}
      >
        {busy && <Loader2Icon className="h-4 w-4 animate-spin" />}
        {!busy && <Icons.github className="h-4 w-4" />}
        Continue with GitHub
      </Button>
    </fetcher.Form>
  );
}
