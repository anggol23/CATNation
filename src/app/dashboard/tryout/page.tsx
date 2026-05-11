"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, Users, ArrowRight } from "lucide-react";

export default function TryoutSelectionPage() {
  const tryouts = [
    {
      id: "cpns-2024-1",
      title: "Simulasi CPNS Nasional #1",
      category: "CPNS",
      duration: 100,
      questions: 110,
      participants: 12500,
      isPremium: false,
    },
    {
      id: "cpns-2024-2",
      title: "Prediksi Akurat SKD CPNS #2",
      category: "CPNS",
      duration: 100,
      questions: 110,
      participants: 8400,
      isPremium: true,
    },
    {
      id: "bumn-2024-1",
      title: "Simulasi BUMN Batch 1",
      category: "BUMN",
      duration: 90,
      questions: 100,
      participants: 5300,
      isPremium: true,
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Daftar Tryout</h1>
        <p className="text-foreground/60 mt-2">Pilih paket tryout dan mulai simulasi ujianmu.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tryouts.map((tryout) => (
          <motion.div
            key={tryout.id}
            whileHover={{ y: -5 }}
            className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                tryout.category === "CPNS" ? "bg-blue-500/10 text-blue-600" : "bg-orange-500/10 text-orange-600"
              }`}>
                {tryout.category}
              </span>
              {tryout.isPremium && (
                <span className="bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  Premium
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-4">{tryout.title}</h3>
            
            <div className="space-y-2 mb-6 flex-1 text-sm text-foreground/70">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Durasi: {tryout.duration} Menit</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{tryout.questions} Soal</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{tryout.participants.toLocaleString()} Peserta</span>
              </div>
            </div>

            <Link href={`/dashboard/tryout/${tryout.id}`}>
              <button className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                Kerjakan Sekarang <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
