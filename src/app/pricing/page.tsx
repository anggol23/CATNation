"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Star, Shield, Zap, Lock, Info, ChevronDown } from "lucide-react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [snapReady, setSnapReady] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  useEffect(() => {
    // Check if snap is already available (e.g. from previous navigation)
    // @ts-ignore
    if (window.snap) {
      setSnapReady(true);
    }
  }, []);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleBuyPremium = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!snapReady) {
      setStatus({ type: "info", message: "Menyiapkan sistem pembayaran... Mohon tunggu sebentar." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          name: user.name,
          email: user.email,
          amount: 99000,
        }),
      });

      const data = await res.json();

      if (data.token) {
        // @ts-ignore
        if (window.snap) {
          // @ts-ignore
          window.snap.pay(data.token, {
            onSuccess: function (result: any) {
              setStatus({ type: "success", message: "Pembayaran Berhasil! Mengalihkan ke dashboard..." });
              setTimeout(() => router.push("/dashboard"), 2000);
            },
            onPending: function (result: any) {
              setStatus({ type: "info", message: "Menunggu pembayaran. Silakan selesaikan transaksi Anda." });
              setTimeout(() => router.push("/dashboard"), 3000);
            },
            onError: function (result: any) {
              setStatus({ type: "error", message: "Terjadi kesalahan saat pembayaran. Silakan coba lagi." });
              setLoading(false);
            },
            onClose: function () {
              setLoading(false);
            },
          });
        } else {
          setStatus({ type: "error", message: "Skrip pembayaran (Snap) gagal dimuat. Refresh halaman dan coba lagi." });
          setLoading(false);
        }
      } else {
        setStatus({ type: "error", message: `Gagal: ${data.error || "Gagal membuat transaksi."}` });
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Koneksi terputus. Mohon periksa internet Anda." });
      setLoading(false);
    }
  };

  const features = [
    "Akses 100+ Paket Tryout Full SKD",
    "Sistem CAT 100% Mirip Asli BKN",
    "Pembahasan Super Detail & Trik Cepat",
    "Ranking Nasional Real-time",
    "Analisa Kelemahan per Materi (TWK, TIU, TKP)",
    "Grup Diskusi Telegram VIP",
  ];

  const isProd = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.startsWith("Mid-");
  const snapSrc = isProd 
    ? "https://app.midtrans.com/snap/snap.js" 
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-4 overflow-x-hidden">
      <Script
        src={snapSrc}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Midtrans Snap Loaded");
          setSnapReady(true);
        }}
        onError={(e) => {
          console.error("Midtrans Snap Error:", e);
          setStatus({ type: "error", message: "Gagal memuat skrip pembayaran. Periksa koneksi atau AdBlock Anda." });
        }}
      />

      {/* Notification Toast */}
      <AnimatePresence>
        {status && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-24 left-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border min-w-[320px] ${
              status.type === "success" ? "bg-green-500 text-white border-green-600" :
              status.type === "error" ? "bg-red-500 text-white border-red-600" :
              "bg-blue-600 text-white border-blue-700"
            }`}
          >
            {status.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : 
             status.type === "error" ? <Info className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
            <p className="font-bold text-sm">{status.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto text-center mb-16 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/20 blur-[100px] rounded-full" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            Satu Investasi, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Selamanya Mengabdi.</span>
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Hanya dengan sekali bayar, dapatkan akses penuh ke seluruh bank soal CPNS & BUMN terupdate 2024.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8 items-center">
        {/* Benefits Column */}
        <div className="lg:col-span-3 space-y-8 pr-0 lg:pr-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Zap, title: "Update Real-time", desc: "Soal selalu diperbarui mengikuti kisi-kisi terbaru BKN." },
              { icon: Shield, title: "Garansi Lulus", desc: "Metode belajar yang sudah terbukti meluluskan ribuan user." },
              { icon: Lock, title: "Pembayaran Aman", desc: "Transaksi terenkripsi via Midtrans Payment Gateway." },
              { icon: Star, title: "Materi Eksklusif", desc: "Trik cepat menjawab dari para ahli dan mantan peserta." },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface/50 p-6 rounded-3xl border border-border/50"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-surface border-4 border-primary rounded-[2.5rem] p-10 relative shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]"
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-1.5 rounded-full text-sm font-black flex items-center gap-2 shadow-xl uppercase tracking-widest">
            <Star className="w-4 h-4 fill-white" /> Best Deal
          </div>

          <h2 className="text-2xl font-black text-foreground mb-4">Akses Premium</h2>
          <div className="mb-8">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-foreground tracking-tighter">Rp 99rb</span>
              <span className="text-foreground/40 line-through text-lg">199rb</span>
            </div>
            <p className="text-sm font-bold text-green-500 mt-1">Diskon 50% Berakhir Hari Ini!</p>
          </div>

          <div className="space-y-4 mb-10">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm font-medium text-foreground/80">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleBuyPremium}
            disabled={loading || !!user?.premium}
            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : user?.premium ? (
              "✅ Sudah Premium"
            ) : (
              "Ambil Akses Sekarang"
            )}
          </button>

          <p className="text-center text-[10px] text-foreground/40 mt-6 uppercase tracking-widest font-bold">
            🔒 Pembayaran Terenkripsi & Aman
          </p>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-32">
        <h2 className="text-3xl font-black text-center mb-12">Paling Sering Ditanyakan</h2>
        <div className="space-y-4">
          {[
            { q: "Apakah akses ini selamanya?", a: "Ya! Cukup sekali bayar dan Anda mendapatkan akses selamanya untuk paket yang dibeli." },
            { q: "Metode pembayaran apa saja yang tersedia?", a: "Kami mendukung QRIS (Gopay, OVO, Dana), Transfer Bank (Virtual Account), dan Kartu Kredit." },
            { q: "Bagaimana jika pembayaran saya tidak terdeteksi?", a: "Sistem Midtrans kami otomatis. Namun jika ada kendala, hubungi CS kami dengan mengirimkan bukti bayar." }
          ].map((faq, i) => (
            <div key={i} className="bg-surface/50 border border-border/50 rounded-2xl p-6">
              <h4 className="font-bold text-foreground mb-2 flex items-center justify-between">
                {faq.q}
                <ChevronDown className="w-4 h-4 text-foreground/30" />
              </h4>
              <p className="text-sm text-foreground/60 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
