// hooks/useComments.ts
import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Comment } from '@/types/comment';

export function useComments(postId: number) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClientComponentClient();

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
            setComments(data);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

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
                    await fetchComments(); // Always fetch fresh data
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [postId, supabase, fetchComments]);

    const addComment = async (content: string, images: File[]) => {
        try {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('postId', postId.toString());

            images.forEach(image => {
                formData.append('images', image);
            });

            const response = await fetch('/api/comments', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add comment');
            }

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
            const response = await fetch(`/api/comments?id=${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete comment');
            }

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
        refreshComments: fetchComments
    };
}