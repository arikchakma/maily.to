import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { z } from 'zod';

import { Database } from '@/types/database';

export const GET = async (
  req: NextRequest,
  context: {
    params: {
      id: string;
    };
  }
) => {
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

  const params = context.params;
  const schema = z.object({
    id: z.string().trim().nonempty(),
  });

  const result = schema.safeParse(params);
  if (!result.success) {
    return {
      status: 400,
      body: {
        type: 'Invalid request',
        message: result.error.issues,
      },
    };
  }

  const { id } = result.data;
  const mail = await supabase.from('mails').select('*').eq('id', id).single();

  if (mail.error) {
    return NextResponse.json(
      {
        type: 'Database error',
        message: mail.error.message,
      },
      {
        status: mail.status,
      }
    );
  }

  if (mail?.data?.user_id !== session?.user.id) {
    return NextResponse.json(
      {
        type: 'Unauthorized',
        message: 'You are not authorized to delete this resource.',
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.json(mail.data);
};
