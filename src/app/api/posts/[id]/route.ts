import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET single post
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { error: 'Post ID is required' }, 
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', params.id)
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

// UPDATE post
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { error: 'Post ID is required' }, 
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' }, 
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('posts')
      .update({
        title: body.title,
        content: body.content,
        image_url: body.image_url,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Database Error:', error);
      return NextResponse.json(
        { error: 'Error updating post' }, 
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

// DELETE post
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { error: 'Post ID is required' }, 
        { status: 400 }
      );
    }

    // First, get the post to check if it has an image
    const { data: post } = await supabase
      .from('posts')
      .select('image_url')
      .eq('id', params.id)
      .single();

    // If post has an image, delete it from storage
    if (post?.image_url) {
      const fileName = post.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('post-images')
          .remove([fileName]);
      }
    }

    // Delete the post
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Database Error:', error);
      return NextResponse.json(
        { error: 'Error deleting post' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}