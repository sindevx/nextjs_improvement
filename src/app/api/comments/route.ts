// app/api/comments/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');
        const supabase = createRouteHandlerClient({ cookies });

        if (!postId) {
            return NextResponse.json(
                { error: 'Post ID is required' },
                { status: 400 }
            );
        }

        // Get comments without join
        const { data: comments, error: commentsError } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: false });

        if (commentsError) {
            console.error('Comments fetch error:', commentsError);
            throw commentsError;
        }

        // Get user data for each comment
        const commentsWithUsers = await Promise.all(
            comments.map(async (comment) => {
                const { data: { user } } = await supabase.auth.getUser();

                return {
                    ...comment,
                    user: {
                        email: user?.email || 'Anonymous',
                        raw_user_meta_data: {
                            full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous User',
                            avatar_url: user?.user_metadata?.avatar_url || null
                        }
                    }
                };
            })
        );

        return NextResponse.json(commentsWithUsers);
    } catch (error) {
        console.error('Error in GET /api/comments:', error);
        return NextResponse.json(
            { error: 'Error fetching comments' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const supabase = createRouteHandlerClient({ cookies });

        // Get current user's session
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError || !session) {
            console.error('Auth error:', authError);
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Add the comment
        const { data: newComment, error: insertError } = await supabase
            .from('comments')
            .insert([
                {
                    content: body.content,
                    post_id: body.postId,
                    user_id: session.user.id
                }
            ])
            .select('*')
            .single();

        if (insertError) {
            console.error('Insert error:', insertError);
            throw insertError;
        }

        // Add user data to the response
        const commentWithUser = {
            ...newComment,
            user: {
                email: session.user.email,
                raw_user_meta_data: {
                    full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Anonymous User',
                    avatar_url: session.user.user_metadata?.avatar_url || null
                }
            }
        };

        return NextResponse.json(commentWithUser);
    } catch (error) {
        console.error('Error in POST /api/comments:', error);
        return NextResponse.json(
            { error: 'Error creating comment' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
        return NextResponse.json(
            { error: 'Comment ID is required' },
            { status: 400 }
        );
    }

    try {
        const supabase = createRouteHandlerClient({ cookies });

        // Get current user's session
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError || !session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Delete the comment
        const { error: deleteError } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId)
            .eq('user_id', session.user.id);

        if (deleteError) throw deleteError;

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error in DELETE /api/comments:', error);
        return NextResponse.json(
            { error: 'Error deleting comment' },
            { status: 500 }
        );
    }
}