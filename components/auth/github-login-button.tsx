'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GithubIcon, Loader2 } from 'lucide-react';

import { supabase } from '@/lib/supabase';

import { BaseButton } from '../editor/components/base-button';
import { config } from '@/lib/config';

type GithubLoginButtonProps = {
  code?: string;
};

export function GithubLoginButton(props: GithubLoginButtonProps) {
  const { code } = props;
  const [isLoading, setIsLoading] = useState(code ? true : false);
  const router = useRouter();
  async function handleLogin() {
    setIsLoading(true);
    console.log(location)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${config.appUrl}/signup`
      },
    });

    if (error) {
      setIsLoading(false);
      console.error(error);
    }

    router.refresh();
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN') {
          router.push('/playground');
        }
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <BaseButton
      variant="outline"
      onClick={handleLogin}
      className="gap-2"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        <GithubIcon size={16} />
      )}
      Continue with GitHub
    </BaseButton>
  );
}
