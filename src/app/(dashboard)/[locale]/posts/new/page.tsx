'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchWithAuth } from "@/utils/api";
import RichTextEditor from '@/components/RichTextEditor';
import { useLanguage } from '@/hooks/useLanguage';
import { Alert } from '@/components/ui/alert';

// types/category.ts
export interface Category {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'disabled';
  }
  
  export interface CategoryFormData {
    name: string;
    description: string;
    status: 'active' | 'disabled';
  }
  
  // types/tag.ts
  export interface Tag {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'disabled';
  }
  
  export interface TagFormData {
    name: string;
    description: string;
    status: 'active' | 'disabled';
  }

export default function CreatePostPage() {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const { t } = useLanguage();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // New state for categories and tags
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showTagsDropdown, setShowTagsDropdown] = useState(false);
    const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
    const [searchCategory, setSearchCategory] = useState('');
    const [searchTag, setSearchTag] = useState('');

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;
            
            // Close category dropdown if click is outside
            if (!target.closest('[data-category-container]')) {
                setShowCategoriesDropdown(false);
            }
            
            // Close tags dropdown if click is outside
            if (!target.closest('[data-tag-container]')) {
                setShowTagsDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchCategoriesAndTags();
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, []);

    const fetchCategoriesAndTags = async () => {
        try {
            const [categoriesResponse, tagsResponse] = await Promise.all([
                fetchWithAuth('/api/categories'),
                fetchWithAuth('/api/tags')
            ]);
            
            setCategories(categoriesResponse.filter((cat: Category) => cat.status === 'active'));
            setTags(tagsResponse.filter((tag: Tag) => tag.status === 'active'));
        } catch (err) {
            console.error('Error fetching categories and tags:', err);
            setError(t('post.failedToLoadData'));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError(t('post.imageTooLarge'));
                return;
            }

            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }

            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchCategory.toLowerCase())
    );

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchTag.toLowerCase())
    );

    const toggleCategory = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let image_url = null;

            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('post-images')
                    .upload(fileName, image);

                if (uploadError) {
                    throw new Error(t('post.failedToUploadImage'));
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('post-images')
                    .getPublicUrl(fileName);

                image_url = publicUrl;
            }

            await fetchWithAuth('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    image_url,
                    categories: selectedCategories,
                    tags: selectedTags
                })
            });

            router.push('/posts');
        } catch (err) {
            console.error('Submission error:', err);
            setError(err instanceof Error ? err.message : t('post.failedToCreatePost'));
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => router.push('/posts')}
                                className="text-gray-500 hover:text-gray-700 mr-4"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <h1 className="text-xl font-semibold text-gray-800">{t('post.newPost')}</h1>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow-sm rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                {error}
                            </Alert>
                        )}

                        {/* Title Input */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                {t('post.title')}
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                                placeholder={t('post.enterTitle')}
                            />
                        </div>

                        {/* Categories Selection */}
                        <div className="relative" data-category-container>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('post.categories')}
                            </label>
                            <div className="min-h-[42px] p-2 border border-gray-300 rounded-md">
                                <div className="flex flex-wrap gap-2">
                                    {selectedCategories.map(catId => {
                                        const category = categories.find(c => c.id === catId);
                                        return category ? (
                                            <span
                                                key={category.id}
                                                className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-700"
                                            >
                                                {category.name}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleCategory(category.id);
                                                    }}
                                                    className="ml-1 hover:text-blue-900"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ) : null;
                                    })}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowTagsDropdown(false); // Close tags dropdown
                                            setShowCategoriesDropdown(!showCategoriesDropdown);
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        + {t('post.addCategory')}
                                    </button>
                                </div>
                            </div>
                            
                            {showCategoriesDropdown && (
                                <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-md border">
                                    <div className="p-2">
                                        <input
                                            type="text"
                                            value={searchCategory}
                                            onChange={(e) => setSearchCategory(e.target.value)}
                                            placeholder={t('post.searchCategories')}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <ul className="max-h-48 overflow-auto py-1">
                                        {filteredCategories.map(category => (
                                            <li
                                                key={category.id}
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleCategory(category.id);
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category.id)}
                                                    onChange={() => {}}
                                                    className="mr-2"
                                                />
                                                {category.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Tags Selection */}
                        <div className="relative" data-tag-container>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('post.tags')}
                            </label>
                            <div className="min-h-[42px] p-2 border border-gray-300 rounded-md">
                                <div className="flex flex-wrap gap-2">
                                    {selectedTags.map(tagId => {
                                        const tag = tags.find(t => t.id === tagId);
                                        return tag ? (
                                            <span
                                                key={tag.id}
                                                className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-green-100 text-green-700"
                                            >
                                                {tag.name}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleTag(tag.id);
                                                    }}
                                                    className="ml-1 hover:text-green-900"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ) : null;
                                    })}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCategoriesDropdown(false); // Close categories dropdown
                                            setShowTagsDropdown(!showTagsDropdown);
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        + {t('post.addTag')}
                                    </button>
                                </div>
                            </div>
                            
                            {showTagsDropdown && (
                                <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-md border">
                                    <div className="p-2">
                                        <input
                                            type="text"
                                            value={searchTag}
                                            onChange={(e) => setSearchTag(e.target.value)}
                                            placeholder={t('post.searchTags')}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <ul className="max-h-48 overflow-auto py-1">
                                        {filteredTags.map(tag => (
                                            <li
                                                key={tag.id}
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleTag(tag.id);
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTags.includes(tag.id)}
                                                    onChange={() => {}}
                                                    className="mr-2"
                                                />
                                                {tag.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('post.coverImage')}
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
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
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
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
                                            <div className="flex text-sm text-gray-600 mt-2">
                                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                    <span>{t('post.uploadFile')}</span>
                                                    <input
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                                <p className="pl-1">{t('post.dragAndDrop')}</p>
                                            </div>
                                            <p className="text-xs text-gray-500">{t('post.imageFormat')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('post.content')}
                            </label>
                            <RichTextEditor
                                initialValue={content}
                                onEditorChange={(newContent) => setContent(newContent)}
                                disabled={loading}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {t('post.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        {t('post.creating')}
                                    </div>
                                ) : (
                                    t('post.create')
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}