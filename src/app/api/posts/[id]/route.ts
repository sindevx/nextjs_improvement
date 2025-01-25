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

// GET single post
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

    if (!id) {
      return NextResponse.json(
          { error: 'Post ID is required' },
          { status: 400 }
      );
    }

    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
      return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
      const { id } = await params;

      // 1. ตรวจสอบ auth
      const { user, error: authError } = await verifyAuth(request);
      console.log('Current user:', user?.id);

      if (authError || !user) {
          return NextResponse.json(
              { error: 'Unauthorized' },
              { status: 401 }
          );
      }

      // 2. ดึงข้อมูลโพสต์
      const { data: post, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

      console.log('Post data:', post);

      if (fetchError) {
          console.error('Fetch error:', fetchError);
          return NextResponse.json(
              { error: 'Post not found' },
              { status: 404 }
          );
      }

      // 3. อัพเดทข้อมูล
      const body = await request.json();
      
      const { data: updatedPost, error: updateError } = await supabase
          .from('posts')
          .update({
              title: body.title.trim(),
              content: body.content.trim(),
              image_url: body.image_url,
              updated_at: new Date().toISOString(),
              // user_id: user.id  // เพิ่ม user_id
          })
          .eq('id', id)
          .select()
          .single();

      if (updateError) {
          console.error('Update error:', updateError);
          return NextResponse.json(
              { error: 'Failed to update post' },
              { status: 500 }
          );
      }

      return NextResponse.json(updatedPost);
  } catch (error) {
      console.error('Server error:', error);
      return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
      );
  }
}



export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Delete request for post ID:', id); // เพิ่ม log

    // ตรวจสอบว่ามีโพสต์อยู่จริงไหม
    const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select()
        .eq('id', id)
        .single();

    console.log('Fetch result:', { post, fetchError }); // เพิ่ม log

    if (fetchError || !post) {
      return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
      );
    }

    // ลบโพสต์
    const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (deleteError) {
      console.error('Delete error:', deleteError); // เพิ่ม log
      return NextResponse.json(
          { error: 'Failed to delete post' },
          { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    );
  }
}