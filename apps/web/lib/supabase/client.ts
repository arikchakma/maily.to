import { createBrowserClient } from '@supabase/ssr';
import { config } from '../config';

export function createSupabaseBrowserClient() {
  return createBrowserClient(config.supabase.url, config.supabase.anonKey);
}
