import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export async function POST(request: Request) {
    try {
        const { postId, categoryId } = await request.json();
        
        console.log('Received data:', { postId, categoryId });

        // Input validation
        if (!postId || !categoryId) {
            console.log('Missing required fields');
            return NextResponse.json(
                { error: 'Post ID and Category ID are required' }, 
                { status: 400 }
            );
        }

        // Try the insertion with more detailed logging
        try {
            const { data, error } = await supabase
                .from('post_categories')
                .insert([{ 
                    post_id: Number(postId), 
                    category_id: Number(categoryId) 
                }])
                .select();

            console.log('Supabase response:', { data, error });

            if (error) {
                console.error('Database error:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    fullError: JSON.stringify(error)
                });
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json({ 
                message: 'Category post created successfully',
                data 
            });

        } catch (dbError) {
            console.error('Database operation error:', dbError);
            return NextResponse.json(
                { error: 'Database operation failed' }, 
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Request processing error:', error);
        return NextResponse.json(
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    }
}