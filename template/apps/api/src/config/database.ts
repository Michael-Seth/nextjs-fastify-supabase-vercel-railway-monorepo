import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";
import type { Database } from "../types/database.js";
export const supabase = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, { auth:{ autoRefreshToken:false, persistSession:false } });
export const supabaseAdmin = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth:{ autoRefreshToken:false, persistSession:false } });
