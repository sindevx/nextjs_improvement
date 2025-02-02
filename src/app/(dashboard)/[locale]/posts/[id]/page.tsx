// app/posts/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { X, Minus, Plus, RotateCcw } from 'lucide-react';
import Index from '@/components/Comments';
import {fetchWithAuth} from "@/utils/api";
import { useLanguage } from '@/hooks/useLanguage';
interface Post {
    id: number;
    title: string;
    content: string;
    image_url: string | null;
    created_at: string;
}

export default function PostDetails({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const { t } = useLanguage();
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await fetchWithAuth(`/api/posts/${params.id}`);
                setPost(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [params.id]);

    const handleImageClick = () => {
        setIsImageOpen(true);
        setZoomLevel(1);
    };

    const handleCloseImage = () => {
        setIsImageOpen(false);
        setZoomLevel(1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {error || t('post.postNotFound')}
                    </h2>
                    <button
                        onClick={() => router.push('/posts')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        {t('post.backToPosts')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <button
                            onClick={() => router.push('/posts')}
                            className="inline-flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            {t('post.backToPosts')}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <article className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Hero Image with Click Handler */}
                    {post.image_url && (
                        <div
                            className="relative w-full h-96 cursor-pointer group"
                            onClick={handleImageClick}
                        >
                            <Image
                                src={post.image_url}
                                alt={post.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                                priority
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-opacity duration-200">
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg
                                        className="w-12 h-12 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Post Content */}
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {post.title}
                        </h1>
                        <div className="flex items-center text-gray-500 text-sm mb-8">
                            <span>
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="prose prose-lg max-w-none">
                            <div className="prose max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                            </div>
                        </div>
                    </div>
                </article>

                {/* Image Dialog */}
                <Dialog
                    open={isImageOpen}
                    onClose={handleCloseImage}
                    className="relative z-50"
                >
                    <div className="fixed inset-0 bg-black/90" aria-hidden="true" />

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="relative w-full h-full flex items-center justify-center">
                            {/* Close button */}
                            <button
                                onClick={handleCloseImage}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                aria-label="Close image"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>

                            {/* Image container */}
                            {post.image_url && (
                                <div
                                    className="relative w-full h-full flex items-center justify-center transition-transform duration-200"
                                    style={{ transform: `scale(${zoomLevel})` }}
                                >
                                    <Image
                                        src={post.image_url}
                                        alt={post.title}
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                        priority
                                        quality={100}
                                    />
                                </div>
                            )}

                            {/* Zoom controls */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-full">
                                <button
                                    onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                                    className="p-2 text-white hover:bg-white/20 rounded-full"
                                    aria-label="Zoom out"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setZoomLevel(1)}
                                    className="p-2 text-white hover:bg-white/20 rounded-full"
                                    aria-label="Reset zoom"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
                                    className="p-2 text-white hover:bg-white/20 rounded-full"
                                    aria-label="Zoom in"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>

                {/* Comments Section */}
                <div className="mt-12">
                    <Index postId={post.id} />
                </div>
            </main>
        </div>
    );
}