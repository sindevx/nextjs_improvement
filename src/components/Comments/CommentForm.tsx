// components/Comments/CommentForm.tsx
'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { XCircle } from 'lucide-react';

interface CommentFormProps {
    postId: number;
    onSubmit: (content: string, images: File[]) => Promise<{ success: boolean; error?: string }>;
    isLoading: boolean;
}

export default function CommentForm({ postId, onSubmit, isLoading }: CommentFormProps) {
    const [content, setContent] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (images.length + files.length > 3) {
            setError('Maximum 3 images allowed');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const validFiles = files.filter(file => {
            if (!allowedTypes.includes(file.type)) {
                setError('Only JPEG, PNG and WebP images are allowed');
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('File size too large. Maximum size is 5MB');
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
            setImages(prev => [...prev, ...validFiles]);
            setError(null);
        }
    }, [images]);

    const removeImage = useCallback((index: number) => {
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        setImages(prev => prev.filter((_, i) => i !== index));
    }, [previewUrls]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await onSubmit(content.trim(), images);
            if (result.success) {
                setContent('');
                setImages([]);
                setPreviewUrls(urls => {
                    urls.forEach(url => URL.revokeObjectURL(url));
                    return [];
                });
            } else {
                setError(result.error || 'Failed to post comment');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to post comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={user ? "Write a comment..." : "Please sign in to comment"}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    disabled={!user || isSubmitting}
                />

                {/* Image Preview Section */}
                <div className="mt-3">
                    <div className="flex flex-wrap gap-3">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative w-24 h-24 group">
                                <Image
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    fill
                                    className="rounded-lg object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <XCircle className="w-6 h-6 text-red-500" />
                                </button>
                            </div>
                        ))}

                        {images.length < 3 && user && (
                            <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={isSubmitting}
                                />
                                <svg
                                    className="w-6 h-6 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </label>
                        )}
                    </div>

                    {error && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={!user || isSubmitting || !content.trim()}
                    className={`
                        inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
                        transition-colors duration-200
                        ${!user || isSubmitting || !content.trim()
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