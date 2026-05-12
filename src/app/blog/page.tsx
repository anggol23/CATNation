"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { ref, get, child } from "firebase/database";
import { BlogPost } from "@/types";
import Link from "next/link";
import { Loader2, Calendar, User, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "blogs"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const blogsArray = Object.keys(data).map(key => ({
            ...data[key],
            id: key
          })) as BlogPost[];
          
          blogsArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setBlogs(blogsArray);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = (text || "").split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-secondary/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-4 inline-block">
              Update & Tips
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight px-2">
              Artikel & Tips <span className="text-primary">Lolos Seleksi</span>
            </h1>
            <p className="text-foreground/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
              Kumpulan strategi, rahasia passing grade, dan informasi terbaru seputar seleksi CPNS dan BUMN untuk membantu perjuanganmu.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-foreground/40 font-medium">Memuat artikel terbaik...</p>
          </div>
        ) : blogs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-surface/50 backdrop-blur-sm rounded-[2.5rem] border border-border border-dashed"
          >
            <h3 className="text-2xl font-bold text-foreground mb-2">Belum Ada Artikel</h3>
            <p className="text-foreground/60">Admin sedang menyiapkan konten berkualitas untuk Anda. Cek kembali nanti!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {blogs.map((blog, idx) => (
              <motion.div 
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/blog/${blog.id}`} className="block group h-full">
                  <div className="bg-surface border border-border rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col group-hover:border-primary/20">
                    <div className="aspect-[16/10] w-full overflow-hidden relative">
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/30 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-white/10">
                          Informasi
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-[10px] font-bold text-foreground/40 mb-4 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-primary" />
                          {new Date(blog.createdAt).toLocaleDateString("id-ID", { month: "short", day: "numeric"})}
                        </span>
                        <span className="w-1 h-1 bg-border rounded-full" />
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-primary" />
                          {calculateReadingTime(blog.content)} Menit
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                        {blog.title}
                      </h2>
                      <p className="text-foreground/60 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-xs font-bold text-foreground/70">{blog.author}</span>
                        </div>
                        <div className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

