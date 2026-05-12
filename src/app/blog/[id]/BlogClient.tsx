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
    <div className="min-h-screen pb-20 relative">
      {/* Dynamic Background Aura */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section with Depth */}
      <div className="w-full h-[55vh] md:h-[70vh] relative overflow-hidden">
        <motion.div 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/60 z-10" />
        
        <div className="absolute inset-0 z-20 flex items-end pb-24 md:pb-40">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/blog" className="inline-flex items-center gap-3 text-white/90 hover:text-white mb-8 group transition-all glass px-6 py-2.5 rounded-full border-white/20">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                <span className="text-sm font-bold tracking-wide">Kembali ke Blog</span>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-4xl"
            >
              <span className="px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block shadow-2xl shadow-primary/40">
                💎 Premium Insight
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight drop-shadow-2xl">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-white/90 text-[10px] sm:text-xs font-black uppercase tracking-widest">
                <div className="flex items-center gap-3 glass px-4 py-2.5 rounded-xl border-white/10">
                  <Calendar className="w-4 h-4 text-primary" />
                  {new Date(blog.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-3 glass px-4 py-2.5 rounded-xl border-white/10">
                  <User className="w-4 h-4 text-primary" />
                  {blog.author}
                </div>
                <div className="flex items-center gap-3 glass px-4 py-2.5 rounded-xl border-white/10">
                  <Clock className="w-4 h-4 text-primary" />
                  {readingTime} Menit Baca
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 -mt-16 md:-mt-32 relative z-30">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1 glass border-white/10 p-8 md:p-16 lg:p-20 rounded-[3rem] shadow-2xl overflow-hidden"
          >
          <div className="mb-12 md:mb-16">
            <p className="text-xl md:text-3xl font-bold text-foreground/90 italic leading-relaxed border-l-8 border-primary pl-8 py-2">
              {blog.excerpt}
            </p>
          </div>

          <div className="prose prose-lg md:prose-xl max-w-4xl prose-slate dark:prose-invert prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary-dark prose-img:rounded-[2rem] prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-p:leading-[1.9] mb-16 md:mb-24">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </div>

          {/* Premium Call to Action */}
          <motion.div 
            whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
            viewport={{ once: true }}
            className="my-20 p-10 md:p-16 rounded-[3.5rem] bg-gradient-to-br from-primary via-accent to-primary-dark text-white relative overflow-hidden shadow-[0_32px_64px_-12px_rgba(59,130,246,0.5)]"
          >
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[80px]" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="text-center lg:text-left max-w-xl">
                <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Siap Menjadi <br/> Abdi Negara?</h3>
                <p className="text-white/80 text-lg md:text-xl font-medium">
                  Jangan tunda lagi. Mulai asah kemampuanmu dengan ribuan soal tryout standar nasional di CATNation.
                </p>
              </div>
              <Link href="/register" className="shrink-0">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary px-12 py-6 rounded-2xl font-black text-xl hover:bg-surface-hover transition-all flex items-center gap-3"
                >
                  Daftar Sekarang <ArrowRight className="w-6 h-6" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <div className="border-t border-border/30 pt-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
              <div className="text-center md:text-left">
                <p className="text-xs font-black text-foreground/40 mb-2 uppercase tracking-[0.3em]">Share This Insight</p>
                <h4 className="text-2xl font-black text-foreground">Suka dengan artikel ini?</h4>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button 
                  whileHover={{ y: -5 }}
                  onClick={handleWhatsAppShare}
                  className="flex items-center gap-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white px-8 py-4 rounded-2xl transition-all font-black text-sm border border-[#25D366]/20 shadow-lg shadow-[#25D366]/5"
                >
                  <MessageCircle className="w-5 h-5" /> WHATSAPP
                </motion.button>
                <motion.button 
                  whileHover={{ y: -5 }}
                  onClick={handleNativeShare}
                  className="flex items-center gap-3 bg-primary/10 text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-2xl transition-all font-black text-sm border border-primary/20 shadow-lg shadow-primary/5"
                >
                  <Share2 className="w-5 h-5" /> BAGIKAN
                </motion.button>
                <motion.button 
                  whileHover={{ y: -5 }}
                  onClick={handleCopyLink}
                  className="flex items-center gap-3 bg-foreground/5 text-foreground/80 hover:bg-foreground hover:text-white px-8 py-4 rounded-2xl transition-all font-black text-sm border border-foreground/10"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <LinkIcon className="w-5 h-5" />}
                  {copied ? "TERSALIN!" : "SALIN LINK"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

          {/* Sticky Sidebar for Desktop */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24 space-y-8">
              <div className="glass p-8 rounded-[2.5rem] border-primary/10">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-primary rounded-full" />
                  Insight Lainnya
                </h3>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group cursor-pointer">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Update Seleksi</p>
                      <h4 className="font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        Strategi Jitu Menghadapi Ambang Batas SKD 2026
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-8 rounded-[2.5rem] border-accent/10 bg-gradient-to-br from-accent/5 to-transparent">
                <h3 className="text-xl font-black mb-4">Butuh Simulasi?</h3>
                <p className="text-foreground/60 text-sm mb-6 leading-relaxed">
                  Dapatkan paket tryout premium dengan sistem CAT paling akurat.
                </p>
                <Link href="/pricing">
                  <button className="w-full py-4 bg-accent text-white rounded-2xl font-black text-sm shadow-xl shadow-accent/20 hover:scale-[1.02] transition-transform">
                    LIHAT PAKET
                  </button>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-20 text-center">
          <Link href="/blog" className="group inline-flex items-center gap-3 text-primary font-black text-xl hover:text-primary-dark transition-colors">
            <span className="border-b-2 border-transparent group-hover:border-primary transition-all">Lihat Artikel Lainnya</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
