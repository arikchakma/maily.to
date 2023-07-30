import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import * as z from 'zod';

import { Database } from '@/types/database';

export const POST = async (request: NextRequest) => {
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

  const body = await request.json();
  const schema = z.object({
    title: z.string().trim().min(3).max(255).nonempty(),
    content: z.object({
      type: z.enum(['doc']),
      content: z.array(z.any()),
    }),
  });

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        type: 'Invalid request',
        message: result.error.issues,
      },
      {
        status: 400,
      }
    );
  }

  const { title, content } = result.data;
  const { data, error } = await supabase
    .from('mails')
    .insert({
      title,
      content: JSON.stringify(content),
      user_id: session?.user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      {
        type: 'Database error',
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(data);
};
