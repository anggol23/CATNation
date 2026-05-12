"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/auth";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    setDropdownOpen(false);
    router.push("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-lg shadow-primary/5 py-0" 
          : "bg-transparent py-1"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-bold text-xl md:text-2xl text-primary flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="text-lg md:text-xl font-bold">C</span>
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
          <div className="md:hidden flex items-center h-14">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-all ${isOpen ? "text-primary bg-primary/10" : "text-foreground/80 hover:text-primary hover:bg-primary/5"}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] md:hidden"
          >
            {/* Backdrop with strong blur */}
            <div className="absolute inset-0 bg-background/98 backdrop-blur-2xl" />
            
            <div className="relative h-full flex flex-col p-5">
              {/* Menu Header */}
              <div className="flex justify-between items-center h-14 mb-8">
                <Link href="/" onClick={() => setIsOpen(false)} className="font-bold text-xl text-primary flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white">
                    <span className="text-lg font-bold">C</span>
                  </div>
                  CATNation
                </Link>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-primary bg-primary/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Centered Navigation Links */}
              <div className="flex-1 flex flex-col justify-center items-center gap-6">
                {[
                  { label: "Fitur Utama", href: "/#fitur" },
                  { label: "Paket Harga", href: "/#harga" },
                  { label: "Blog & Tips", href: "/blog" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link 
                      href={item.href} 
                      onClick={() => setIsOpen(false)} 
                      className="text-2xl font-black text-foreground hover:text-primary transition-all active:scale-95 tracking-tight"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Bottom Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-auto space-y-4 pb-8"
              >
                {!loading && (
                  user ? (
                    <div className="space-y-4 w-full max-w-xs mx-auto">
                      <div className="glass p-4 rounded-2xl border-primary/10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-black text-sm text-foreground truncate">{user.name}</p>
                          <p className="text-[10px] text-foreground/50 truncate font-bold uppercase tracking-wider">{user.email}</p>
                        </div>
                      </div>
                      <Link 
                        href={user.email === "admin@catnation.com" ? "/admin" : "/dashboard"} 
                        onClick={() => setIsOpen(false)} 
                        className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-xl font-black text-base shadow-xl shadow-primary/20"
                      >
                        <LayoutDashboard className="w-5 h-5" /> 
                        {user.email === "admin@catnation.com" ? "ADMIN PANEL" : "DASHBOARD"}
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="w-full py-3 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-50 rounded-xl transition-all"
                      >
                        Keluar Akun
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                      <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                        <button className="w-full py-4 text-foreground/60 hover:text-primary font-black text-base transition-colors">
                          LOGIN
                        </button>
                      </Link>
                      <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-primary text-white py-4 rounded-xl font-black text-base shadow-xl shadow-primary/30"
                        >
                          DAFTAR SEKARANG
                        </motion.button>
                      </Link>
                    </div>
                  )
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
