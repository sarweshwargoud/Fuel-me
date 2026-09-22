import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

export const supabase: SupabaseClient | null =
  env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    : null;
