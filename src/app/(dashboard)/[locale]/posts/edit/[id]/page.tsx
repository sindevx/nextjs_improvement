'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchWithAuth } from "@/utils/api";
import RichTextEditor from '@/components/RichTextEditor';
const supabase = createClientComponentClient();
import { useLanguage } from '@/hooks/useLanguage';
interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPostPage(props: PageProps) {
  // แปลง params เป็น Promise แล้ว unwrap ด้วย use()
  const params = use(props.params);
  const postId = params.id;
  const router = useRouter();
  const { t } = useLanguage();

  const [setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
    return () => {
      if (imagePreview && imagePreview !== existingImage) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [postId]);

  async function fetchPost(id: string) {
    try {
      const data = await fetchWithAuth(`/api/posts/${id}`);
      // setPost(data);
      setTitle(data?.title);
      setContent(data?.content || ''); // Make sure to handle null/undefined
      setExistingImage(data?.image_url);
      setImagePreview(data?.image_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreview && imagePreview !== existingImage) {
        URL.revokeObjectURL(imagePreview);
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let image_url = existingImage;

      // If there's a new image, upload it
      if (image) {
        // Delete old image if exists
        if (existingImage) {
          const oldImagePath = existingImage.split('/').pop();
          if (oldImagePath) {
            await supabase.storage
                .from('post-images')
                .remove([oldImagePath]);
          }
        }

        // Upload new image
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('post-images')
            .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('post-images')
            .getPublicUrl(fileName);

        image_url = publicUrl;
      }

      // Update post
      await fetchWithAuth(`/api/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          image_url,
        }),
      });

      router.push('/posts');
    } catch (err) {
      console.error('Update Error:', err);
      setError(err instanceof Error ? err.message : t('post.failedToUpdatePost'));
      setSaving(false);
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-3xl mx-auto bg-red-50 p-4 rounded-lg text-red-600">
            <p>{error}</p>
            <button
                onClick={() => router.push('/posts')}
                className="mt-4 text-sm text-red-600 hover:text-red-500"
            >
              Return to posts
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                    onClick={() => router.push('/posts')}
                    className="text-gray-500 hover:text-gray-700 mr-4"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="text-xl font-semibold text-gray-800">{t('post.editPost')}</h1>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-sm rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('post.coverImage')}
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                        <div className="relative w-full h-48">
                          <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-md"
                          />
                          <button
                              type="button"
                              onClick={() => {
                                setImage(null);
                                setImagePreview(null);
                                setExistingImage(null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                    ) : (
                        <>
                          <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                          >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                              <span>Upload a file</span>
                              <input
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleImageChange}
                              />
                            </label>
                            <p className="pl-1">{t('post.orDragAndDrop')}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {t('post.imageFormat')}
                          </p>
                        </>
                    )}
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                />
              </div>

              {/* Content Input */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <RichTextEditor
                                initialValue={content}
                                onEditorChange={(newContent) => {
                                  setContent(newContent);
                                }}                               
                                 // disabled={loading}
                            />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('post.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {t('post.saving')}
                      </div>
                  ) : (
                      t('post.saveChanges')
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
  );
}