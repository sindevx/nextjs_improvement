import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// please add log for me check the request and execute the code
export async function POST(request: Request) {
    const { postId, tagId } = await request.json();
    console.log('postId', postId);
    console.log('tagId', tagId);    
    const { error } = await supabase.from('post_tags').insert({ post_id: postId, tag_id: tagId });
    if (error) {
        console.log('error', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Tag post created successfully' }, { status: 200 });
}


