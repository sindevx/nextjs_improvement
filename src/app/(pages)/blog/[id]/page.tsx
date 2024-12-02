import { notFound } from 'next/navigation';
import { NextPage } from 'next';
import React from 'react';

interface BlogPostProps {
  post: { id: number; title: string; content: string };
}

const BlogPost: NextPage<BlogPostProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <h1 className="text-4xl font-bold text-gray-600">{post.title}</h1>
      <p className="text-sm text-gray-500">{post.content}</p>
    </div>
  );
};

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
  ];
}

export async function getData(id: string) {
  const post = {
    id: parseInt(id),
    title: `Blog Post ${id}`,
    content: `Detailed content for blog post ${id}. This is a more comprehensive view of the post.`,
  };

  return post;
}

export default async function Page({ params }: { params: { id: string } }) {
  const post = await getData(params.id);

  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}

