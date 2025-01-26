import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Middleware function to verify token
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
    return { error: 'Authentication failed' + error };
  }
}

export async function GET(request: Request) {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(request);

    if (authError) {
      return NextResponse.json(
          { error: authError },
          { status: 401 }
      );
    }

    const { data, error } = await supabase
        .from('categories')
        .select('*');

    if (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Error fetching categories' },
            { status: 500 }
        );
    }

    return NextResponse.json(data);
}

// CREATE single category
export async function POST(request: Request) {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(request);

    if (authError) {
      return NextResponse.json(
          { error: authError },
          { status: 401 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            name: body.name.trim(),
            slug: body.slug.trim(),
            description: body.description.trim(),
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

    if (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Error creating category' },
            { status: 500 }
        );
    }

    return NextResponse.json(data);
}