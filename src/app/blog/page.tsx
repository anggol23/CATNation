"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { ref, get, child } from "firebase/database";
import { BlogPost } from "@/types";
import Link from "next/link";
import { Loader2, Calendar, User } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Artikel & Tips Lolos</h1>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Kumpulan strategi, rahasia passing grade, dan informasi terbaru seputar seleksi CPNS dan BUMN.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-3xl border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-2">Belum Ada Artikel</h3>
            <p className="text-foreground/60">Admin sedang menyiapkan konten terbaik untuk Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => (
              <motion.div 
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/blog/${blog.id}`} className="block group">
                  <div className="bg-surface border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col">
                    <div className="aspect-[16/9] w-full overflow-hidden">
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-xs font-medium text-primary mb-3">
                        <span className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
                          <Calendar className="w-3 h-3" />
                          {new Date(blog.createdAt).toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric"})}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                      <p className="text-foreground/60 text-sm mb-4 line-clamp-3 flex-1">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border">
                        <User className="w-4 h-4 text-foreground/40" />
                        <span className="text-xs text-foreground/60">{blog.author}</span>
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
