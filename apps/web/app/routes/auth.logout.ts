import { redirect } from 'react-router';
import type { Route } from './+types/auth.logout';

export async function action(_args: Route.ActionArgs) {
  // Auth disabled for local development. Just send the user back to templates.
  return redirect('/templates', {
    headers: new Headers(),
    status: 302,
  });
}