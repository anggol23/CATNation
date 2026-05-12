"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Users, Star, BookOpen, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen selection:bg-primary/30 selection:text-primary">
      {/* Hero Section */}
      <section className="pt-16 md:pt-32 pb-20 md:pb-32 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col items-center text-center relative">
        {/* Subtle Decorative Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <motion.span 
            variants={itemVariants}
            className="px-4 py-2 rounded-full glass text-primary text-xs sm:text-sm font-bold mb-8 inline-block shadow-lg shadow-primary/5 border-primary/20 tracking-wider uppercase"
          >
            🚀 Platform Tryout No. 1 di Indonesia
          </motion.span>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 text-foreground leading-[1.05]"
          >
            Lulus Tes Lebih Mudah <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-gradient-x">
              Bersama CATNation
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-12 px-4 leading-relaxed font-medium"
          >
            Rasakan simulasi CAT 100% mirip aslinya. Dilengkapi sistem ranking nasional dan analisa mendalam untuk membantu kamu meraih NIP tahun ini.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-lg mx-auto sm:max-w-none"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-primary text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group"
              >
                Mulai Sekarang <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="#fitur" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto glass text-foreground px-10 py-5 rounded-2xl font-black text-xl hover:bg-surface-hover transition-all flex items-center justify-center"
              >
                Lihat Fitur Utama
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Stats Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 md:mt-32 glass p-8 md:p-12 rounded-[3rem] w-full max-w-5xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
            {[
              { label: "User Aktif", value: "50K+" },
              { label: "Paket Tryout", value: "100+" },
              { label: "Lulus Passing Grade", value: "98%" },
              { label: "Rating Pengguna", value: "4.9/5" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <h3 className="text-3xl sm:text-4xl font-black text-primary mb-2 tracking-tight">{stat.value}</h3>
                <p className="text-xs sm:text-sm font-bold text-foreground/60 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 md:mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl md:text-6xl font-black mb-6 text-foreground tracking-tight"
            >
              Kenapa Memilih <span className="text-primary">CATNation?</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-foreground/70 max-w-2xl mx-auto text-lg sm:text-xl font-medium leading-relaxed"
            >
              Kami memberikan lebih dari sekadar latihan. Kami memberikan strategi kemenangan.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              { icon: Shield, title: "Sistem CAT Asli", desc: "Tampilan, durasi, dan sistem penilaian 100% mirip dengan tes aslinya.", color: "bg-blue-500" },
              { icon: BookOpen, title: "Pembahasan Detail", desc: "Tiap soal dilengkapi pembahasan mendalam dan trik cepat ala tentor senior.", color: "bg-emerald-500" },
              { icon: Users, title: "Ranking Nasional", desc: "Ukur kemampuanmu dibanding puluhan ribu peserta lain secara realtime.", color: "bg-purple-500" },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -10 }}
                className="glass p-10 rounded-[2.5rem] relative group cursor-default shadow-xl border-white/5 hover:border-primary/30 transition-all duration-500"
              >
                <div className={`w-14 h-14 ${feature.color}/20 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-foreground/70 text-lg leading-relaxed">{feature.desc}</p>
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                  <feature.icon className="w-24 h-24" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="harga" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 md:mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl md:text-6xl font-black mb-6 text-foreground tracking-tight"
            >
              Investasi Masa Depan <span className="text-primary">Terjangkau</span>
            </motion.h2>
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg font-medium">
              Pilih paket yang sesuai dengan kebutuhan belajarmu dan raih impian menjadi Abdi Negara.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {[
              { name: "Starter", price: "Gratis", desc: "Cocok untuk perkenalan sistem", features: ["3 Paket Tryout Mini", "Pembahasan Singkat", "Ranking Terbatas"], cta: "Coba Sekarang", popular: false },
              { name: "Premium", price: "Rp 149rb", desc: "Paling populer untuk pejuang CPNS", features: ["Full 50+ Paket Tryout", "Pembahasan Video & PDF", "Analisa Kelemahan AI", "Ranking Nasional Realtime"], cta: "Beli Sekarang", popular: true },
              { name: "Ultimate", price: "Rp 299rb", desc: "Persiapan total tanpa batas", features: ["Semua Fitur Premium", "Bimbingan Belajar Online", "Update Soal Selamanya", "Grup Eksklusif Telegram"], cta: "Pilih Ultimate", popular: false },
            ].map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass p-10 rounded-[3rem] relative overflow-hidden flex flex-col h-full ${plan.popular ? "border-primary/40 shadow-2xl shadow-primary/20 scale-105 z-20" : "border-white/5 opacity-90 scale-95"}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-6 py-2 rounded-bl-2xl uppercase tracking-widest">
                    Paling Laris
                  </div>
                )}
                <h3 className="text-2xl font-black mb-2 text-foreground">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-primary">{plan.price}</span>
                  {plan.price !== "Gratis" && <span className="text-foreground/40 font-bold">/sekali</span>}
                </div>
                <p className="text-foreground/60 text-sm mb-8 font-medium">{plan.desc}</p>
                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <Check className="w-3 h-3" />
                      </div>
                      {feat}
                    </div>
                  ))}
                </div>
                <Link href="/register" className="w-full">
                  <button className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${plan.popular ? "bg-primary text-white shadow-xl shadow-primary/30 hover:bg-primary-dark" : "glass text-foreground hover:bg-surface-hover"}`}>
                    {plan.cta}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

