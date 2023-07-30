'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut } from 'lucide-react';

import { supabase } from '@/lib/supabase';

import { Button } from '../ui/button';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function handleLogout() {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      setIsLoading(false);
    }

    router.refresh();
  }
  return (
    <Button
      disabled={isLoading}
      onClick={handleLogout}
      variant={'destructive'}
      className="w-full"
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin stroke-2" />
      ) : (
        <LogOut size={16} className="stroke-2" />
      )}
      <span className="ml-2 text-sm font-medium tracking-tight">Log out</span>
    </Button>
  );
}
