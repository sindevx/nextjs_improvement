'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {fetchWithAuth} from "@/utils/api";
  import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from 'react-i18next';
interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string | null;
}

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      // เอา .json() ออก เพราะ fetchWithAuth จะ return json ให้แล้ว
      const data = await fetchWithAuth('/api/posts');
      console.log('Fetched Posts:', data); // ล็อกข้อมูลที่ได้
      setPosts(data);
    } catch (err) {
      console.error('Fetch Error:', err); // ล็อก error ให้ละเอียด
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(id: number) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await fetchWithAuth(`/api/posts/${id}`, { method: 'DELETE' });
      await fetchPosts();
    } catch (err) {
      console.error('Delete Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  }

  const handleCardClick = (e: React.MouseEvent, postId: number) => {
    // Check if the click was on a button
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    // Navigate to post details
    router.push(`/posts/${postId}`);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-gray-800">{t('post.blogPosts')}</h1>
              <button
                  onClick={() => router.push('/posts/new')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('post.newPost')}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                  type="text"
                  placeholder={t('post.searchPosts')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
                <div
                    key={post.id}
                    onClick={(e) => handleCardClick(e, post.id)}
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
                    <div className='text-gray-600 line-clamp-2 mb-4' dangerouslySetInnerHTML={{ __html: post.content }} />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      <div className="flex space-x-2">
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/posts/edit/${post.id}`);
                            }}
                            className="px-3 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                        >
                          {t('post.update')}
                        </button>
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePost(post.id);
                            }}
                            className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                        >
                          {t('post.delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('post.noPostsFound')}</p>
              </div>
          )}
        </main>
      </div>
  );
}