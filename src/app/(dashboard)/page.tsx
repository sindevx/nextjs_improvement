import React from 'react';
import { BookOpen, Terminal, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to Sinkerd's Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Exploring the world of programming, sharing knowledge, and documenting my journey in software development.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                Latest Posts <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                About Me
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-2 mb-8">
          <Star className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">Featured Posts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured Post Card 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="text-sm text-blue-600 mb-2">Programming</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Getting Started with Next.js</h3>
              <p className="text-gray-600 mb-4">Learn how to build modern web applications with Next.js and React...</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>5 min read</span>
                <span className="mx-2">•</span>
                <span>May 15, 2024</span>
              </div>
            </div>
          </div>

          {/* Featured Post Card 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="text-sm text-green-600 mb-2">Tutorial</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mastering TypeScript</h3>
              <p className="text-gray-600 mb-4">A comprehensive guide to using TypeScript in your projects...</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>8 min read</span>
                <span className="mx-2">•</span>
                <span>May 12, 2024</span>
              </div>
            </div>
          </div>

          {/* Featured Post Card 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="text-sm text-purple-600 mb-2">DevOps</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Docker for Beginners</h3>
              <p className="text-gray-600 mb-4">Understanding containers and how to use Docker effectively...</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>6 min read</span>
                <span className="mx-2">•</span>
                <span>May 10, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <Terminal className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-medium">Programming</h3>
            <p className="text-sm text-gray-600 mt-1">12 posts</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <Terminal className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-medium">Tutorials</h3>
            <p className="text-sm text-gray-600 mt-1">8 posts</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <Terminal className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-medium">DevOps</h3>
            <p className="text-sm text-gray-600 mt-1">5 posts</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <Terminal className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-medium">Best Practices</h3>
            <p className="text-sm text-gray-600 mt-1">7 posts</p>
          </div>
        </div>
      </div>
    </div>
  );
}