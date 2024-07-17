import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return new Response('Hello, World!', {
    headers: { 'content-type': 'text/plain' },
  });
}
