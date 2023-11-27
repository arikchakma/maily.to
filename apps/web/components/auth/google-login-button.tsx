import { Button } from '../ui/button';
import { Icons } from '../icons';

export function GoogleLoginButton() {
  return (
    <form action="/auth/login" className="flex flex-col grow" method="POST">
      <input name="provider" type="hidden" value="google" />
      <Button className="gap-2" type="submit" variant="outline">
        {/* eslint-disable-next-line react/jsx-pascal-case -- This is a icon */}
        <Icons.google />
        Continue with Google
      </Button>
    </form>
  );
}
