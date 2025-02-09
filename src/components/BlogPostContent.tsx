'use client';
import React from 'react';
import { Calendar, Clock, User, Share2, BookmarkPlus, ThumbsUp, MessageCircle } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

interface BlogPostContentProps {
  post: Post;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <article className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readTime}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        {/* Author and Date */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{post.author}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {post.date}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <div className="w-full h-[400px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"></div>
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 leading-relaxed">
          {post.content}
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Section Heading
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
          incididunt ut labore et dolore magna aliqua.
        </p>
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6">
          "This is an important quote or key takeaway from the blog post that deserves emphasis."
        </blockquote>
      </div>

      {/* Engagement Section */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ThumbsUp className="h-5 w-5" />
              <span>Like</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span>Comment</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <BookmarkPlus className="h-5 w-5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Related Posts */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Another Interesting Post</h4>
            <p className="text-gray-600 mb-4 line-clamp-2">Brief description of another related post...</p>
            <a href="#" className="text-blue-600 hover:text-blue-800">Read more →</a>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">More Related Content</h4>
            <p className="text-gray-600 mb-4 line-clamp-2">Another interesting related post description...</p>
            <a href="#" className="text-blue-600 hover:text-blue-800">Read more →</a>
          </div>
        </div>
      </div>
    </article>
  );
}