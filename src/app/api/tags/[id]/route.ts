// app/api/posts/[id]/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

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

// GET single tag
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {

  try {
    const { id } = await params;

    // Verify authentication
    const { user, error: authError } = await verifyAuth(request);

    if (authError) {
      return NextResponse.json(
          { error: authError },
          { status: 401 }
      );
    }

    const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Error fetching tag' },
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

// DELETE single tag
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

    const { data, error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id)
        .select();

    if (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Error deleting tag' },
            { status: 500 }
        );
    }

    return NextResponse.json(data);
}

// UPDATE single tag
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
        .from('tags')
        .update(body)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Error updating tag' },
            { status: 500 }
        );
    }

    return NextResponse.json(data);
}

// UPDATE single tag
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

  console.log('body', body);
  const { data, error } = await supabase
      .from('tags')
      .update(body)
      .eq('id', id)
      .select();

  if (error) {
      console.error('Database Error:', error);
      return NextResponse.json(
          { error: 'Error updating tag' },
          { status: 500 }
      );
  }

  return NextResponse.json(data);
}