"use client";

import Link from "next/link";
import { Mail, Phone, Globe, MessageCircle, Share2 } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Satu Wadah
              </span>
            </Link>
            <p className="text-foreground/60 text-sm sm:text-base max-w-sm mb-8 leading-relaxed">
              Platform Tryout Terpercaya untuk persiapan CPNS, BUMN, dan Kedinasan. Kami hadir untuk membantu Anda meraih impian menjadi Abdi Negara.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" title="Instagram">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" title="Twitter">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" title="Website">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-foreground font-bold mb-6">Navigasi</h4>
            <ul className="space-y-4">
              <li><Link href="/#fitur" className="text-foreground/60 hover:text-primary transition-colors text-sm font-medium">Fitur Utama</Link></li>
              <li><Link href="/#harga" className="text-foreground/60 hover:text-primary transition-colors text-sm font-medium">Paket Premium</Link></li>
              <li><Link href="/blog" className="text-foreground/60 hover:text-primary transition-colors text-sm font-medium">Blog & Update</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h4 className="text-foreground font-bold mb-6">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-foreground/60 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span>halo@satuwadah.id</span>
              </li>
              <li className="flex items-center gap-3 text-foreground/60 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+62 812-3456-7890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-foreground/40 text-xs sm:text-sm text-center md:text-left">
            &copy; {currentYear} CATNation by Satu Wadah. Seluruh Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-foreground/40 hover:text-primary text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-foreground/40 hover:text-primary text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
