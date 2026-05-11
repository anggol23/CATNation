"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/auth";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    setDropdownOpen(false);
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-bold text-2xl text-primary flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="text-xl font-bold">C</span>
              </div>
              CATNation
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/#fitur" className="text-foreground/80 hover:text-primary transition-colors font-medium">Fitur</Link>
            <Link href="/#harga" className="text-foreground/80 hover:text-primary transition-colors font-medium">Harga</Link>
            <Link href="/blog" className="text-foreground/80 hover:text-primary transition-colors font-medium">Blog</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 relative">
            {!loading && (
              user ? (
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors p-1"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">{user.name.split(" ")[0]}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl py-2"
                      >
                        <div className="px-4 py-2 border-b border-border mb-2">
                          <p className="text-sm font-bold text-foreground line-clamp-1">{user.name}</p>
                          <p className="text-xs text-foreground/60 line-clamp-1">{user.email}</p>
                        </div>
                        <Link 
                          href={user.email === "admin@catnation.com" ? "/admin" : "/dashboard"} 
                          onClick={() => setDropdownOpen(false)} 
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-surface-hover transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary" /> {user.email === "admin@catnation.com" ? "Admin Panel" : "Dashboard"}
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-surface-hover transition-colors">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-foreground/80 hover:text-primary font-medium transition-colors">
                    Login
                  </Link>
                  <Link href="/register">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
                    >
                      Daftar Premium
                    </motion.button>
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground/80 hover:text-primary transition-colors p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4 flex flex-col">
              <Link href="/#fitur" onClick={() => setIsOpen(false)} className="text-foreground/80 hover:text-primary font-medium">Fitur</Link>
              <Link href="/#harga" onClick={() => setIsOpen(false)} className="text-foreground/80 hover:text-primary font-medium">Harga</Link>
              <Link href="/blog" onClick={() => setIsOpen(false)} className="text-foreground/80 hover:text-primary font-medium">Blog</Link>
              <hr className="border-border" />
              
              {!loading && (
                user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-border">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{user.name}</p>
                        <p className="text-xs text-foreground/60">{user.email}</p>
                      </div>
                    </div>
                    <Link 
                      href={user.email === "admin@catnation.com" ? "/admin" : "/dashboard"} 
                      onClick={() => setIsOpen(false)} 
                      className="flex items-center gap-2 text-foreground/80 hover:text-primary font-medium"
                    >
                      <LayoutDashboard className="w-5 h-5 text-primary" /> {user.email === "admin@catnation.com" ? "Ke Admin Panel" : "Ke Dashboard"}
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-500 font-medium">
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="text-foreground/80 hover:text-primary font-medium">
                      Login
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <button className="w-full bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
                        Daftar Premium
                      </button>
                    </Link>
                  </>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
