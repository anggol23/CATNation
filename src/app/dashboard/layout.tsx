"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null; // Will redirect

  // If we're strictly inside the active tryout engine, we might want to hide the Sidebar completely.
  // But for now, we'll just keep it or hide it via responsive CSS.
  // Actually, the tryout engine should probably hide the sidebar/bottom nav to focus on the exam.
  const isTryoutEngine = pathname.match(/^\/dashboard\/tryout\/[a-zA-Z0-9_-]+$/) !== null;

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {!isTryoutEngine && <Sidebar />}
      
      {/* Main content area. On mobile, add padding bottom for the nav bar */}
      <main className={`flex-1 overflow-y-auto p-4 sm:p-8 ${!isTryoutEngine ? 'pb-24 md:pb-8' : ''}`}>
        {children}
      </main>
    </div>
  );
}
