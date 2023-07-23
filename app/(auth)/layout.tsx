import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout(props: AuthLayoutProps) {
  const { children } = props;
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return redirect('/playground')

  return (
    <div className="max-w-[680px] mx-auto">
      {children}
    </div>
  )
}
