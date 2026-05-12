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
              className="text-foreground/80 hover:text-primary transition-colors p-2 z-[60]"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[51] md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-background border-l border-border z-[55] md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full pt-20 px-6 pb-8 overflow-y-auto">
                <div className="space-y-1">
                  {[
                    { label: "Fitur", href: "/#fitur" },
                    { label: "Harga", href: "/#harga" },
                    { label: "Blog", href: "/blog" },
                  ].map((item) => (
                    <Link 
                      key={item.label}
                      href={item.href} 
                      onClick={() => setIsOpen(false)} 
                      className="block py-4 text-xl font-bold text-foreground hover:text-primary transition-colors border-b border-border/50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                
                <div className="mt-auto pt-8 space-y-4">
                  {!loading && (
                    user ? (
                      <div className="space-y-6">
                        <div className="bg-surface p-4 rounded-2xl border border-border">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                              <UserIcon className="w-6 h-6" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-bold text-foreground truncate">{user.name}</p>
                              <p className="text-sm text-foreground/60 truncate">{user.email}</p>
                            </div>
                          </div>
                          <Link 
                            href={user.email === "admin@catnation.com" ? "/admin" : "/dashboard"} 
                            onClick={() => setIsOpen(false)} 
                            className="flex items-center justify-center gap-2 w-full py-3 bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary/20 transition-colors"
                          >
                            <LayoutDashboard className="w-5 h-5" /> 
                            {user.email === "admin@catnation.com" ? "Admin Panel" : "Dashboard"}
                          </Link>
                        </div>
                        <button 
                          onClick={handleLogout} 
                          className="flex items-center justify-center gap-2 w-full py-4 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut className="w-5 h-5" /> Logout
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                          <button className="w-full py-4 text-foreground/80 hover:text-primary font-bold transition-colors">
                            Login
                          </button>
                        </Link>
                        <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
                          <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform">
                            Daftar Premium
                          </button>
                        </Link>
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
