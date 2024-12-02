'use client';
import { useEffect, useState } from 'react';

export default function BlogPage() {
  const [posts, setPosts] = useState<{ id: number; title: string; body: string }[]>([]);

  useEffect(() => {
    async function getPosts() {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const posts = await response.json() as { id: number; title: string; body: string }[];
      const topPosts = posts.slice(0, 5);
      setPosts(topPosts);
    }
    getPosts();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <h1 className="text-4xl font-bold text-gray-600">Blog</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/blog/${post.id}`}>
              <div className="bg-white rounded-lg p-4 hover:shadow-lg transition duration-300 ease-in-out border border-gray-200">
                <h2 className="text-2xl text-gray-600">{post.title}</h2>
                <p className="text-sm text-gray-500">{post.body.slice(0, 150)}...</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

