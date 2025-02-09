// app/api/posts/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
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
    return { error: 'Authentication failed'+ error };
  }
}

// GET all posts
export async function GET(request: Request) {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(request);

    if (authError) {
      return NextResponse.json(
          { error: authError },
          { status: 401 }
      );
    }

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
    // Verify authentication
    const { user, error: authError } = await verifyAuth(request);

    if (authError) {
      return NextResponse.json(
          { error: authError },
          { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    if (!body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json(
          { error: 'Title and content are required' },
          { status: 400 }
      );
    }

    const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: body.title.trim(),
            content: body.content.trim(),
            image_url: body.image_url?.trim() || null,
            author: user?.id, // Add user_id from authenticated user
            created_at: new Date().toISOString(),
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

       // ส่ง email notification
    // await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/email`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       postTitle: body.title.trim(),
    //       postContent: body.content.trim(),
    //       postId: data.id
    //     })
    // })

    //call api map tag and post to tag_post table
    //loop tag and post to tag_post table
    console.log('body.tags', body.tags);
    for (const tag of body.tags) {
      console.log('tag', tag);
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tag_post`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          postId: data.id,
          tagId: tag
        })
      })
    }

    //loop category and post to category_post table
    console.log('body.categories', body.categories);
    for (const category of body.categories) {
      console.log('category', category);
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/category_post`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          postId: data.id,
          categoryId: category
        })
      })
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