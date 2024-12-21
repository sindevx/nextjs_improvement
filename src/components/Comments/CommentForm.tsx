// components/Comments/CommentForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface CommentFormProps {
    onSubmit: (content: string) => Promise<{ success: boolean; error?: string }>;
    isLoading: boolean;
}

export default function CommentForm({ onSubmit, isLoading }: CommentFormProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth(); // Get user from AuthContext

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const result = await onSubmit(content.trim());
            if (result.success) {
                setContent('');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAuthenticated = !!user; // Check if user exists

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={isAuthenticated ? "Write a comment..." : "Please sign in to comment"}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            disabled={!isAuthenticated || isSubmitting}
        />
                {!isAuthenticated && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-center space-x-2">
                            <svg
                                className="h-5 w-5 text-yellow-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <p className="text-sm text-yellow-700">
                                Please sign in to leave a comment
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={!isAuthenticated || isSubmitting || !content.trim()}
                    className={`
            inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
            transition-colors duration-200
            ${!isAuthenticated || isSubmitting || !content.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }
          `}
                >
                    {isSubmitting ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Posting...
                        </>
                    ) : (
                        'Post Comment'
                    )}
                </button>
            </div>
        </form>
    );
}