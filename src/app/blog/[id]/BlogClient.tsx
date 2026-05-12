"use client";

import { useState } from "react";
import { BlogPost } from "@/types";
import { Calendar, User, ArrowLeft, Share2, Link as LinkIcon, MessageCircle, Check, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogClient({ blog }: { blog: BlogPost }) {
  const [copied, setCopied] = useState(false);

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
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
    const text = encodeURIComponent(`Baca artikel menarik ini: ${blog.title}\n\n`);
    window.open(`https://wa.me/?text=${text}${url}`, "_blank");
  };

  const readingTime = calculateReadingTime(blog.content);

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <div className="w-full h-[50vh] md:h-[65vh] relative overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-black/40 z-10" />
        
        <div className="absolute inset-0 z-20 flex items-end pb-24 md:pb-32">
          <div className="max-w-4xl mx-auto px-4 w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/blog" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 group transition-all bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                <span className="text-sm font-medium">Kembali ke Blog</span>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider mb-4 inline-block shadow-lg shadow-primary/30">
                Informasi Tryout
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.2] sm:leading-[1.1] tracking-tight drop-shadow-lg">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-white/90 text-[10px] sm:text-sm font-medium">
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/10">
                  <Calendar className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                  {new Date(blog.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long' })}
                </div>
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/10">
                  <User className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                  <span className="truncate max-w-[100px]">{blog.author}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/10">
                  <Clock className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                  {readingTime} menit
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 md:-mt-24 relative z-30">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-border p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-2xl"
        >
          <div className="mb-10 md:mb-12">
            <p className="text-lg md:text-2xl font-medium text-foreground/90 italic leading-relaxed border-l-4 border-primary pl-4 md:pl-6">
              {blog.excerpt}
            </p>
          </div>

          <div className="prose prose-lg md:prose-xl max-w-none prose-slate dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary-dark prose-img:rounded-3xl prose-pre:bg-surface prose-pre:border prose-pre:border-border mb-12 md:mb-16">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </div>

          {/* Call to Action Section */}
          <div className="my-16 p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Siap Menjadi Abdi Negara?</h3>
                <p className="text-white/80 text-lg max-w-md">
                  Jangan tunda lagi. Mulai asah kemampuanmu dengan ribuan soal tryout standar nasional di CATNation.
                </p>
              </div>
              <Link href="/register">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-hover transition-all shadow-xl shadow-black/10 whitespace-nowrap flex items-center gap-2"
                >
                  Daftar Sekarang <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </div>

          <div className="border-t border-border pt-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-sm font-bold text-foreground/40 mb-1 uppercase tracking-[0.2em]">Bagikan</p>
                <h4 className="text-xl font-bold text-foreground">Suka dengan artikel ini?</h4>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={handleWhatsAppShare}
                  className="flex items-center gap-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white px-5 py-3 rounded-2xl transition-all font-bold text-sm border border-[#25D366]/20"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </button>
                <button 
                  onClick={handleNativeShare}
                  className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white px-5 py-3 rounded-2xl transition-all font-bold text-sm border border-primary/20 shadow-sm"
                >
                  <Share2 className="w-5 h-5" /> Bagikan
                </button>
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 bg-foreground/5 text-foreground/80 hover:bg-foreground hover:text-white px-5 py-3 rounded-2xl transition-all font-bold text-sm border border-foreground/10"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <LinkIcon className="w-5 h-5" />}
                  {copied ? "Tersalin!" : "Salin Link"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <Link href="/blog" className="text-primary font-bold hover:underline inline-flex items-center gap-2">
            Lihat Artikel Lainnya <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
