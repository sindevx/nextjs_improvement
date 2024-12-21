// hooks/useComments.ts
import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    post_id: number;
    user: {
        email: string;
        raw_user_meta_data: {
            full_name?: string;
            avatar_url?: string;
        };
    };
}

export function useComments(postId: number) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClientComponentClient();

    // Create a fetchComments function that we can reuse
    const fetchComments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/comments?postId=${postId}`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error fetching comments');
            }

            const data = await response.json();
            console.log('Fetched comments:', data);
            setComments(data);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [postId]);

    // Initial fetch
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // Set up realtime subscription
    useEffect(() => {
        const channel = supabase
            .channel(`comments:${postId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comments',
                    filter: `post_id=eq.${postId}`
                },
                async (payload) => {
                    console.log('Realtime event received:', payload);

                    if (payload.eventType === 'INSERT') {
                        // Fetch the latest comments to ensure we have the most up-to-date data
                        await fetchComments();
                    } else if (payload.eventType === 'DELETE') {
                        setComments(current =>
                            current.filter(comment => comment.id !== payload.old.id)
                        );
                    } else if (payload.eventType === 'UPDATE') {
                        await fetchComments();
                    }
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status);
            });

        // Cleanup subscription
        return () => {
            console.log('Cleaning up subscription');
            supabase.removeChannel(channel);
        };
    }, [postId, supabase, fetchComments]);

    const addComment = async (content: string) => {
        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ content, postId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add comment');
            }

            // Fetch latest comments after adding new one
            await fetchComments();

            return { success: true };
        } catch (err) {
            console.error('Error adding comment:', err);
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const deleteComment = async (commentId: string) => {
        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete comment');
            }

            // Remove comment from local state
            setComments(current => current.filter(comment => comment.id !== commentId));

            return { success: true };
        } catch (err) {
            console.error('Error deleting comment:', err);
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    return {
        comments,
        loading,
        error,
        addComment,
        deleteComment,
        refreshComments: fetchComments // Export the refresh function
    };
}