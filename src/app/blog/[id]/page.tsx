"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/firebase/firebase";
import { ref, get, child } from "firebase/database";
import { BlogPost } from "@/types";
import { Loader2, Calendar, User, ArrowLeft, Share2, Link as LinkIcon, MessageCircle, Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BlogPostDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchBlog = async () => {
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `blogs/${id}`));
        if (snapshot.exists()) {
          setBlog({ ...snapshot.val(), id: id as string });
        } else {
          router.push("/blog");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, router]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Baca artikel menarik ini: ${blog?.title}\n\n`);
    window.open(`https://wa.me/?text=${text}${url}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* Hero Section */}
      <div className="w-full h-[40vh] md:h-[50vh] relative">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img 
          src={blog.imageUrl} 
          alt={blog.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-4xl mx-auto px-4 w-full">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Artikel
            </Link>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
            >
              {blog.title}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-6 text-white/80 text-sm"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(blog.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {blog.author}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-30">
        <div className="bg-surface border border-border p-8 md:p-12 rounded-3xl shadow-xl">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary mb-12">
            {/* Split content by newline to create basic paragraphs, simulating rich text */}
            {blog.content.split("\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4">{paragraph}</p>
            ))}
          </div>

          {/* Share Section */}
          <div className="border-t border-border pt-8">
            <p className="text-sm font-bold text-foreground/60 mb-4 uppercase tracking-wider">Bagikan Artikel</p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleNativeShare}
                className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
              >
                <Share2 className="w-4 h-4" /> Bagikan
              </button>
              <button 
                onClick={handleWhatsAppShare}
                className="flex items-center gap-2 bg-green-500/10 text-green-600 hover:bg-green-500/20 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>
              <button 
                onClick={handleCopyLink}
                className="flex items-center gap-2 bg-foreground/5 text-foreground/80 hover:bg-foreground/10 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4" />}
                {copied ? "Tersalin!" : "Salin Tautan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
