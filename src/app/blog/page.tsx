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

      <div className="max-w-7xl mx-auto relative px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="px-4 py-2 rounded-full glass text-primary text-xs sm:text-sm font-bold uppercase tracking-widest mb-6 inline-block shadow-lg shadow-primary/5 border-primary/20">
              💎 Insight & Strategi
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground mb-8 tracking-tight">
              Artikel & Tips <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-gradient-x">
                Lolos Seleksi
              </span>
            </h1>
            <p className="text-foreground/70 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
              Kumpulan strategi eksklusif, rahasia passing grade, dan informasi terbaru seputar seleksi CPNS dan BUMN untuk membantu perjuanganmu.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            </div>
            <p className="text-foreground/40 font-bold tracking-widest uppercase text-xs">Menyusun strategi terbaik...</p>
          </div>
        ) : blogs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 glass rounded-[3rem] border-dashed border-2 border-border/50"
          >
            <h3 className="text-3xl font-black text-foreground mb-4">Belum Ada Artikel</h3>
            <p className="text-foreground/60 text-lg">Admin sedang menyiapkan konten berkualitas tinggi untuk Anda. Cek kembali segera!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {blogs.map((blog, idx) => (
              <motion.div 
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 3) * 0.1 }}
              >
                <Link href={`/blog/${blog.id}`} className="block group h-full">
                  <div className="glass rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 h-full flex flex-col border-white/5 hover:border-primary/30 group-hover:-translate-y-2">
                    <div className="aspect-[16/10] w-full overflow-hidden relative">
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                      <div className="absolute top-6 left-6">
                        <span className="glass backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/20">
                          Premium Insight
                        </span>
                      </div>
                    </div>
                    <div className="p-8 md:p-10 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-[10px] font-black text-foreground/40 mb-6 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {new Date(blog.createdAt).toLocaleDateString("id-ID", { month: "short", day: "numeric"})}
                        </span>
                        <div className="w-1 h-1 bg-primary/40 rounded-full" />
                        <span className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          {calculateReadingTime(blog.content)} Menit
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-foreground mb-4 group-hover:text-primary transition-colors leading-[1.25] line-clamp-2">
                        {blog.title}
                      </h2>
                      <p className="text-foreground/60 text-base mb-8 line-clamp-3 leading-relaxed flex-1 font-medium">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-8 border-t border-border/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                            <User className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold text-foreground/80">{blog.author}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500">
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

