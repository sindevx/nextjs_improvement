// app/api/posts/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET all posts
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database Error:', error);
      return NextResponse.json(
        { error: 'Error fetching posts' }, 
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

// CREATE new post
export async function POST(request: Request) {
  try {
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
      .insert([
        {
          title: body.title,
          content: body.content,
          image_url: body.image_url || null,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database Error:', error);
      return NextResponse.json(
        { error: 'Error creating post' }, 
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