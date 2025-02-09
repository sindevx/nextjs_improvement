import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from 'next/server';


export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    //help me fix get id from params
    const id = await params;
    console.log('Delete comment request for ID:', id); // Debug log
    console.log('request', request);
    if (!id) {
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

        const id = await params;

        // Delete the comment
        const { error: deleteError } = await supabase
            .from('comments')
            .delete()
            .eq('id', id)
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