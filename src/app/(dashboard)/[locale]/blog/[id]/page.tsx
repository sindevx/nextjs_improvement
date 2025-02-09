import { notFound } from 'next/navigation';
import BlogPostContent from '@/components/BlogPostContent';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
  ];
}

async function getData(id: string) {
  const post = {
    id: parseInt(id),
    title: `Blog Post ${id}`,
    content: `Detailed content for blog post ${id}. This is a more comprehensive view of the post with in-depth discussion of the topic.`,
    author: "John Doe",
    date: "May 15, 2024",
    readTime: "5 min read",
    category: "Technology"
  };

  return post;
}

interface PageProps {
  params: {
    id: string;
  }
}

export default async function Page({ params }: PageProps) {
  const post = await getData(params.id);

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}