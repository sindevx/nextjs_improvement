// app/api/comments/[id]/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';

export async function DELETE(
    { params }: { params: { id: string } }
) {
    console.log('Delete comment request for ID:', params.id); // Debug log

    if (!params.id) {
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
            console.error('Auth error:', authError);
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Delete the comment
        const { error: deleteError } = await supabase
            .from('comments')
            .delete()
            .eq('id', params.id)
            .eq('user_id', session.user.id);

        if (deleteError) {
            console.error('Delete error:', deleteError);
            return NextResponse.json(
                { error: deleteError.message },
                { status: 500 }
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json(
            { error: 'Error deleting comment' },
            { status: 500 }
        );
    }
}