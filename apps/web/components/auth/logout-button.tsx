import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';

export function LogoutButton() {
  return (
    <form action="/auth/logout" className="flex grow flex-col" method="POST">
      <Button className="gap-2" type="submit" variant="destructive">
        <LogOut className="stroke-2" size={16} />
        Logout
      </Button>
    </form>
  );
}
