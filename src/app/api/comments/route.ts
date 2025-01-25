// app/api/comments/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
// import {createClient} from "@supabase/supabase-js";
//
// const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );
//
// async function verifyAuth(request: Request) {
//     const authHeader = request.headers.get('authorization');
//
//     if (!authHeader?.startsWith('Bearer ')) {
//         return { error: 'No bearer token provided' };
//     }
//
//     const token = authHeader.split(' ')[1];
//
//     try {
//         const { data: { user }, error } = await supabase.auth.getUser(token);
//
//         if (error || !user) {
//             return { error: 'Invalid or expired token' };
//         }
//
//         return { user };
//     } catch (error) {
//         return { error: 'Authentication failed'+ error };
//     }
// }


export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const content = formData.get('content') as string;
        const postId = formData.get('postId') as string;
        const imageFiles = formData.getAll('images') as File[];

        // Validate required fields
        if (!content?.trim()) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError || !session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Upload images if any
        const imageUrls = [];
        if (imageFiles.length > 0) {
            for (const file of imageFiles) {
                try {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                    const filePath = `${session.user.id}/${fileName}`;

                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    const { error: uploadError } = await supabase.storage
                        .from('comment-images')
                        .upload(filePath, buffer, {
                            contentType: file.type,
                            cacheControl: '3600'
                        });

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('comment-images')
                        .getPublicUrl(filePath);

                    imageUrls.push(publicUrl);
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    // Continue with other images if one fails
                }
            }
        }

        // Add the comment
        const { data: newComment, error: insertError } = await supabase
            .from('comments')
            .insert({
                content: content.trim(),
                post_id: postId,
                user_id: session.user.id,
                images: imageUrls
            })
            .select('*')
            .single();

        if (insertError) {
            console.error('Insert error:', insertError);
            throw insertError;
        }

        return NextResponse.json({
            ...newComment,
            user: {
                email: session.user.email,
                raw_user_meta_data: {
                    full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                    avatar_url: session.user.user_metadata?.avatar_url
                }
            }
        });
    } catch (error) {
        console.error('Error in POST /api/comments:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error creating comment' },
            { status: 500 }
        );
    }
}
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');
         const cookieStore = cookies();
         const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        if (!postId) {
            return NextResponse.json(
                { error: 'Post ID is required' },
                { status: 400 }
            );
        }

        // Get comments without joining
        const { data: comments, error: commentsError } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: false });

        if (commentsError) throw commentsError;

        // Get all unique user IDs from comments
        const userIds = [...new Set(comments.map(comment => comment.user_id))];

        // Get user data for each unique user ID
        const userDataMap = new Map();

        for (const userId of userIds) {
            const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
            if (!userError && user) {
                userDataMap.set(userId, {
                    email: user.email,
                    raw_user_meta_data: {
                        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                        avatar_url: user.user_metadata?.avatar_url
                    }
                });
            }
        }

        // Map comments with user data
        const commentsWithUsers = comments.map(comment => ({
            ...comment,
            user: userDataMap.get(comment.user_id) || {
                email: 'Anonymous',
                raw_user_meta_data: {
                    full_name: 'Anonymous User',
                    avatar_url: null
                }
            }
        }));

        return NextResponse.json(commentsWithUsers);
    } catch (error) {
        console.error('Error in GET /api/comments:', error);
        return NextResponse.json(
            { error: 'Error fetching comments' },
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

        // Get comment to delete its images
        const { data: comment } = await supabase
            .from('comments')
            .select('images')
            .eq('id', commentId)
            .single();

        if (comment?.images?.length > 0) {
            // Delete images from storage
            await Promise.all(
                comment?.images?.map(async (imageUrl: string) => {
                    const path = new URL(imageUrl).pathname.split('/').pop();
                    if (path) {
                        await supabase.storage
                            .from('comment-images')
                            .remove([path]);
                    }
                })
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