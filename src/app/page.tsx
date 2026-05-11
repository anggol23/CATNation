"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Users, Star, BookOpen, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 inline-block">
            Platform Tryout CPNS & BUMN #1
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
            Lulus Tes Lebih Mudah dengan <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Simulasi CAT Asli
            </span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-10">
            Rasakan pengalaman ujian sesungguhnya. Soal update, sistem anti-curang, dan analisa kelemahan akurat untuk bantu kamu raih NIP tahun ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center gap-2"
              >
                Mulai Tryout Gratis <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="#harga">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-surface text-foreground border border-border px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-hover transition-all"
              >
                Lihat Paket Premium
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl border-y border-border py-8"
        >
          <div className="flex flex-col items-center">
            <h3 className="text-3xl font-bold text-primary mb-1">50K+</h3>
            <p className="text-foreground/60">User Aktif</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-3xl font-bold text-primary mb-1">100+</h3>
            <p className="text-foreground/60">Paket Tryout</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-3xl font-bold text-primary mb-1">98%</h3>
            <p className="text-foreground/60">Lulus Passing Grade</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-3xl font-bold text-primary mb-1">4.9/5</h3>
            <p className="text-foreground/60">Rating Pengguna</p>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">Kenapa Memilih CATNation?</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">Fitur lengkap yang didesain khusus untuk memaksimalkan potensi kelulusanmu.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Sistem CAT Asli", desc: "Tampilan, durasi, dan sistem penilaian (termasuk passing grade) 100% mirip dengan tes aslinya." },
              { icon: BookOpen, title: "Pembahasan Lengkap", desc: "Tiap soal dilengkapi pembahasan detail dan trik cepat menjawab ala tentor." },
              { icon: Users, title: "Ranking Nasional", desc: "Ukur kemampuanmu dibanding puluhan ribu peserta lain dari seluruh Indonesia." },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-foreground/70">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
