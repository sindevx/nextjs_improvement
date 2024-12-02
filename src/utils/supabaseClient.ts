import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gmzrajwskshtxunekvlr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtenJhandza3NodHh1bmVrdmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMTk5ODcsImV4cCI6MjA0ODY5NTk4N30.yP7SnN-skzPc0M3-J6M4jKl_GN1fg3QY5JAA20wSig0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
