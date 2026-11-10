import { supabase } from '@/integrations/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

/** Shared Lovable Cloud client for all WinMix cloud operations. */
export function getSupabase(): SupabaseClient {
  return supabase as unknown as SupabaseClient;
}

export async function sessionToken(required = false): Promise<string | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (required && !data.session) throw new Error('A feltöltéshez jelentkezz be operátori fiókkal.');
  return data.session?.access_token ?? null;
}

export { supabase };
