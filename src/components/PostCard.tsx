// components/PostCard.tsx
'use client';

import { useRouter } from 'next/navigation';

interface PostCardProps {
    post: {
        id: number;
        title: string;
        content: string;
        created_at: string;
        image_url: string | null;
    };
    onDelete: (id: number) => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
    const router = useRouter();

    const handleCardClick = (e: React.MouseEvent) => {
        // Prevent navigation if clicking on action buttons
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;
        router.push(`/posts/${post.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        >
            {/* Image Section */}
            <div className="relative h-48">
                {post.image_url ? (
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-600 line-clamp-3 mb-4">{post.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    <div className="flex space-x-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/posts/edit/${post.id}`);
                            }}
                            className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50"
                        >
                            Edit
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(post.id);
                            }}
                            className="text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}