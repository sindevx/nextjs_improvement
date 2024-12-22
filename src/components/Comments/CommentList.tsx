// components/Comments/CommentList.tsx
import { useState } from 'react';
import Image from 'next/image';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import type { Comment } from '@/types/comment';

interface CommentListProps {
    comments: Comment[];
    currentUser: any;
    onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export default function CommentList({ comments, currentUser, onDelete }: CommentListProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleDelete = async (commentId: string) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            const result = await onDelete(commentId);
            if (!result.success) {
                alert(result.error || 'Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment. Please try again.');
        }
    };

    if (comments.length === 0) {
        return (
            <div className="text-center py-12">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
                <p className="mt-4 text-gray-500">
                    No comments yet. Be the first to share your thoughts!
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-4">
                        <div className="flex-shrink-0">
                            {comment.user?.raw_user_meta_data?.avatar_url ? (
                                <Image
                                    src={comment.user.raw_user_meta_data.avatar_url}
                                    alt={comment.user.raw_user_meta_data.full_name || 'User'}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-500 font-medium">
                                        {(comment.user.raw_user_meta_data.full_name || comment.user.email || 'A')[0].toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <div className="bg-gray-50 rounded-lg px-4 py-3">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-gray-900">
                                            {comment.user.raw_user_meta_data.full_name || comment.user.email}
                                        </span>
                                        {currentUser?.id === comment.user_id && (
                                            <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">You</span>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                                {comment.images && comment.images.length > 0 && (
                                    <div className="mt-3 grid grid-cols-3 gap-2 max-w-[400px]">
                                        {comment.images.map((image, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => setSelectedImage(image)}
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`Comment image ${index + 1}`}
                                                    fill
                                                    className="rounded-lg object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {currentUser?.id === comment.user_id && (
                                <div className="mt-2 flex justify-end">
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1 px-2 py-1 rounded hover:bg-red-50"
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Image Preview Modal */}
            <Dialog
                open={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="relative bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-hidden">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-2 right-2 z-10 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {selectedImage && (
                            <div className="relative w-full max-w-[800px]">
                                <Image
                                    src={selectedImage}
                                    alt="Preview"
                                    width={800}
                                    height={600}
                                    className="object-contain"
                                />
                            </div>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
}