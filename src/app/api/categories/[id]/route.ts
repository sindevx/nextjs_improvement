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

// GET single category
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(request);

    if (authError) {
      return NextResponse.json(
          { error: authError },
          { status: 401 }
      );
    }

    const { id } = await params;

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Error fetching category' },
            { status: 500 }
        );
    }

    return NextResponse.json(data);
}

// UPDATE single category
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(request);

    if (authError) {
      return NextResponse.json(
          { error: authError },
          { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
        .from('categories')
        .update(body)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Error updating category' },
            { status: 500 }
        );
    }

    return NextResponse.json(data);

}

// UPDATE single category
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Verify authentication
  const { user, error: authError } = await verifyAuth(request);

  if (authError) {
    return NextResponse.json(
        { error: authError },
        { status: 401 }
    );
  }

  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabase
      .from('categories')
      .update(body)
      .eq('id', id)
      .select();

  if (error) {
      console.error('Database Error:', error);
      return NextResponse.json(
          { error: 'Error updating category' },
          { status: 500 }
      );
  }

  return NextResponse.json(data);

}

// DELETE single category
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(request);

    if (authError) {
      return NextResponse.json(
          { error: authError },
          { status: 401 }
      );
    }

    const { id } = await params;

    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Error deleting category' },
            { status: 500 }
        );
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
}