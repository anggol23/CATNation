"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Star, Shield } from "lucide-react";
import Script from "next/script";

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [snapReady, setSnapReady] = useState(false);

  const handleBuyPremium = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!snapReady) {
      alert("Payment gateway sedang dimuat, coba lagi sebentar.");
      return;
    }

    setLoading(true);

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
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            console.log("Success", result);
            alert("✅ Pembayaran berhasil! Status premium Anda akan diperbarui.");
            router.push("/dashboard");
          },
          onPending: function (result: any) {
            console.log("Pending", result);
            alert("⏳ Menunggu konfirmasi pembayaran...");
            router.push("/dashboard");
          },
          onError: function (result: any) {
            console.log("Error", result);
            alert("❌ Pembayaran gagal. Silakan coba lagi.");
          },
          onClose: function () {
            setLoading(false);
          },
        });
      } else {
        alert(data.error || "Gagal memproses pembayaran. Hubungi admin.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan. Periksa koneksi internet Anda.");
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

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      {/* Load Midtrans Snap Script via next/script (fix: raw script tag invalid in Next.js) */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""}
        strategy="afterInteractive"
        onLoad={() => setSnapReady(true)}
      />

      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Investasi Terbaik untuk Masa Depanmu
        </h1>
        <p className="text-lg text-foreground/60">
          Tingkatkan peluang lolos seleksi dengan akses ke seluruh fitur dan ribuan bank soal terupdate.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-surface border-2 border-primary rounded-3xl p-8 relative shadow-2xl shadow-primary/20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
          <Star className="w-4 h-4 fill-white" /> Paling Populer
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">Paket Premium</h2>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-4xl font-extrabold text-foreground">Rp 99.000</span>
          <span className="text-foreground/60 line-through">Rp 199.000</span>
          <span className="bg-green-500/10 text-green-600 text-xs font-bold px-2 py-1 rounded-full">Hemat 50%</span>
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-foreground/80">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleBuyPremium}
          disabled={loading || !!user?.premium}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : user?.premium ? (
            "✅ Sudah Premium"
          ) : (
            "Beli Sekarang"
          )}
        </button>

        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-foreground/50">
          <Shield className="w-4 h-4" />
          <span>Pembayaran aman didukung oleh Midtrans</span>
        </div>
      </div>
    </div>
  );
}
