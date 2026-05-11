"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Users, LayoutDashboard, Database, LogOut, Loader2, FileText } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.email !== "admin@catnation.com") {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.email !== "admin@catnation.com") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Bank Soal", href: "/admin/questions", icon: Database },
    { name: "Blog", href: "/admin/blogs", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <aside className="w-64 bg-surface border-r border-border h-full flex-col hidden md:flex">
        <div className="p-6">
          <Link href="/" className="font-bold text-2xl text-primary">Admin Panel</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {links.map(l => (
            <Link key={l.name} href={l.href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors">
              <l.icon className="w-5 h-5 text-primary" />
              {l.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 w-full text-left text-foreground/70 hover:bg-surface-hover rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            Kembali ke App
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
