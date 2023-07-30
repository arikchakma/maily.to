import { User } from '@supabase/auth-helpers-nextjs';

import { LogoutButton } from './auth/logout-button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type UserMenuProps = {
  user: User | null;
};

export async function UserMenu(props: UserMenuProps) {
  const { user } = props;
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex shrink-0 border-none bg-transparent p-0 hover:bg-transparent hover:opacity-90 focus:bg-transparent">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="text-sm">{name[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-60 rounded-xl p-0">
        <div className="flex items-center gap-x-2 border-b px-4 py-2.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="text-sm">{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold tracking-tighter">{name}</h3>
            <span className="text-xs tracking-tight text-gray-500">
              {user?.email}
            </span>
          </div>
        </div>
        <div className="p-2">
          <LogoutButton />
        </div>
      </PopoverContent>
    </Popover>
  );
}
