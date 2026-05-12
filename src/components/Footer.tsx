"use client";

import Link from "next/link";
import { Mail, Phone, Globe, MessageCircle, Share2 } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Satu Wadah
              </span>
            </Link>
            <p className="text-foreground/60 text-base max-w-sm mb-6 leading-relaxed">
              Platform Tryout Terpercaya untuk persiapan CPNS, BUMN, dan Kedinasan. Kami hadir untuk membantu Anda meraih impian menjadi Abdi Negara.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" title="Instagram">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" title="Twitter">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" title="Website">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6">Layanan</h4>
            <ul className="space-y-4">
              <li><Link href="/#fitur" className="text-foreground/60 hover:text-primary transition-colors">Fitur Utama</Link></li>
              <li><Link href="/#harga" className="text-foreground/60 hover:text-primary transition-colors">Paket Premium</Link></li>
              <li><Link href="/blog" className="text-foreground/60 hover:text-primary transition-colors">Artikel & Tips</Link></li>
              <li><Link href="/register" className="text-foreground/60 hover:text-primary transition-colors">Daftar Sekarang</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-foreground/60">support@satuwadah.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-foreground/60">+62 812 3456 7890</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/50 text-sm">
            © {currentYear} CATNation x Satu Wadah. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-sm text-foreground/50">
            <Link href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
