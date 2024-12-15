// types/post.ts
export interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
  }
  
  // lib/supabase.ts
  import { createClient } from '@supabase/supabase-js';
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  export const supabase = createClient(supabaseUrl, supabaseKey);