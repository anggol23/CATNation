import { Metadata, ResolvingMetadata } from "next";
import { db } from "@/firebase/firebase";
import { ref, get, child } from "firebase/database";
import { BlogPost } from "@/types";
import BlogClient from "./BlogClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

async function getBlog(id: string): Promise<BlogPost | null> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `blogs/${id}`));
    if (snapshot.exists()) {
      return { ...snapshot.val(), id };
    }
    return null;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return {
      title: "Blog Not Found | CATNation",
    };
  }

  return {
    title: `${blog.title} | CATNation Blog`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [
        {
          url: blog.imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
      authors: [blog.author],
      publishedTime: blog.createdAt,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [blog.imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  return <BlogClient blog={blog} />;
}

