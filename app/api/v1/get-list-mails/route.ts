import { NextApiRequest } from 'next';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import { Database } from '@/types/database';

export const GET = async (req: NextApiRequest) => {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.user.role !== 'authenticated') {
    return NextResponse.json(
      {
        type: 'Unauthorized',
        message: 'You must be logged in to access this resource.',
      },
      {
        status: 401,
      }
    );
  }

  const mails = await supabase
    .from('mails')
    .select('*')
    .eq('user_id', session?.user.id)
    .order('created_at', { ascending: false });

  return NextResponse.json(mails);
};
