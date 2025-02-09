import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function verifyAuth(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return { error: 'No bearer token provided' };
    }

    const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { error: 'Invalid or expired token' };
    }

    return { user };
  } catch (error) {
    return { error: 'Authentication failed'+ error };
  }
    
}

// GET all posts
export async function GET(request: Request) {
    try {
      // Verify authentication
      const {  error: authError } = await verifyAuth(request);
  
      if (authError) {
        return NextResponse.json(
            { error: authError },
            { status: 401 }
        );
      }
  
      const { data, error } = await supabase
          .from('tags')
          .select('*')
          .order('created_at', { ascending: false });
  
      if (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Error fetching tags' },
            { status: 500 }
        );
      }
  
      return NextResponse.json(data);
    } catch (error) {
      console.error('Server Error:', error);
      return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
      );
    }
  }
  

export async function POST(request: Request) {
    // Verify authentication
    const {  error: authError } = await verifyAuth(request);

    if (authError) {
      return NextResponse.json(
          { error: authError },
          { status: 401 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
        .from('tags')
        .insert([
          {
            name: body.name.trim(),
            slug: body.slug.trim(),
            status: body.status.trim(),
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

    if (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Error creating tag' },
            { status: 500 }
        );
    }

    return NextResponse.json(data);
}