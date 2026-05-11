"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { ref, push, get, child, remove, update } from "firebase/database";
import { BlogPost } from "@/types";
import { Loader2, Plus, Edit, Trash2, X } from "lucide-react";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
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
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const blogData = {
        title,
        excerpt,
        content,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
        author,
        createdAt: isEditing ? blogs.find(b => b.id === currentId)?.createdAt || new Date().toISOString() : new Date().toISOString()
      };

      if (isEditing && currentId) {
        await update(ref(db, `blogs/${currentId}`), blogData);
      } else {
        await push(ref(db, "blogs"), blogData);
      }
      
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Gagal menyimpan artikel.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      try {
        await remove(ref(db, `blogs/${id}`));
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setIsEditing(true);
    setCurrentId(blog.id!);
    setTitle(blog.title);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setImageUrl(blog.imageUrl);
    setAuthor(blog.author);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setImageUrl("");
    setAuthor("Admin");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Blog</h1>
      </div>

      {/* Form Section */}
      <div className="bg-surface border border-border p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
          {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"}
          {isEditing && (
            <button onClick={resetForm} className="text-sm text-foreground/50 hover:text-red-500 flex items-center gap-1">
              <X className="w-4 h-4" /> Batal Edit
            </button>
          )}
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul Artikel</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" placeholder="Masukkan judul..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL Gambar Cover</label>
              <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ringkasan (Excerpt)</label>
            <input type="text" required value={excerpt} onChange={e => setExcerpt(e.target.value)} className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" placeholder="Ringkasan singkat artikel..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Konten Utama (Bisa gunakan HTML dasar)</label>
            <textarea required value={content} onChange={e => setContent(e.target.value)} rows={6} className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" placeholder="Tulis konten artikel di sini..."></textarea>
          </div>
          <button type="submit" disabled={submitting} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition flex items-center gap-2">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : isEditing ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isEditing ? "Simpan Perubahan" : "Publish Artikel"}
          </button>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="p-4 font-medium text-foreground/60">Artikel</th>
              <th className="p-4 font-medium text-foreground/60">Tanggal</th>
              <th className="p-4 font-medium text-foreground/60">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
            ) : blogs.length === 0 ? (
              <tr><td colSpan={3} className="p-8 text-center text-foreground/50">Belum ada artikel.</td></tr>
            ) : (
              blogs.map(blog => (
                <tr key={blog.id} className="border-b border-border hover:bg-background/50">
                  <td className="p-4">
                    <p className="font-bold text-foreground">{blog.title}</p>
                    <p className="text-sm text-foreground/60 line-clamp-1">{blog.excerpt}</p>
                  </td>
                  <td className="p-4 text-sm text-foreground/60">
                    {new Date(blog.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4 flex gap-3">
                    <button onClick={() => handleEdit(blog)} className="text-blue-500 hover:text-blue-600 p-2"><Edit className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(blog.id!)} className="text-red-500 hover:text-red-600 p-2"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
