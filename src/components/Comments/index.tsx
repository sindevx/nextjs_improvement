// components/Comments/index.tsx
'use client';

import { useEffect } from 'react';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/contexts/AuthContext';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface CommentsProps {
    postId: number;
}

export default function Comments({ postId }: CommentsProps) {
    const { comments, loading, error, addComment, deleteComment, refreshComments } = useComments(postId);
    const { user } = useAuth();

    useEffect(() => {
        refreshComments();
    }, [postId, refreshComments]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">Error: {error}</p>
                <button
                    onClick={() => refreshComments()}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const handleAddComment = async (content: string, images: File[]) => {
        console.log('Adding comment:', { content, imageCount: images.length });
        const result = await addComment(content, images);
        if (result.success) {
            await refreshComments();
        }
        return result;
    };

    const handleDeleteComment = async (commentId: string) => {
        console.log('Deleting comment:', commentId);
        const result = await deleteComment(commentId);
        if (result.success) {
            await refreshComments();
        }
        return result;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Comments ({comments.length})
                </h2>

                <CommentForm
                    postId={postId}
                    onSubmit={handleAddComment}
                    isLoading={loading}
                />

                <div className="mt-8 border-t pt-8">
                    <CommentList
                        comments={comments}
                        currentUser={user}
                        onDelete={handleDeleteComment}
                    />
                </div>
            </div>
        </div>
    );
}