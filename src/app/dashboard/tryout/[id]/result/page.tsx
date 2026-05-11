"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Target, XCircle, ArrowLeft, BarChart3, CheckCircle2, Loader2 } from "lucide-react";

function ResultContent() {
  const searchParams = useSearchParams();
  const score = searchParams.get("score") || "0";
  const correct = searchParams.get("correct") || "0";
  const wrong = searchParams.get("wrong") || "0";

  const isPassed = parseInt(score) >= 400; // Mock passing grade

  return (
    <div className="max-w-4xl mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface border border-border rounded-3xl p-8 text-center shadow-xl"
      >
        <div
          className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
            isPassed ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
          }`}
        >
          <Trophy className="w-12 h-12" />
        </div>

        <h1 className="text-4xl font-extrabold text-foreground mb-2">Skor Akhir: {score}</h1>
        <p className={`text-lg font-bold mb-8 ${isPassed ? "text-green-500" : "text-red-500"}`}>
          {isPassed
            ? "🎉 Selamat! Anda memenuhi passing grade."
            : "⚠️ Sayang sekali, Anda belum memenuhi passing grade."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-background border border-border p-6 rounded-2xl">
            <Target className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-foreground/60 text-sm mb-1">Total Soal</p>
            <p className="text-2xl font-bold text-foreground">
              {parseInt(correct) + parseInt(wrong)}
            </p>
          </div>
          <div className="bg-background border border-border p-6 rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <p className="text-foreground/60 text-sm mb-1">Benar</p>
            <p className="text-2xl font-bold text-green-500">{correct}</p>
          </div>
          <div className="bg-background border border-border p-6 rounded-2xl">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-foreground/60 text-sm mb-1">Salah / Kosong</p>
            <p className="text-2xl font-bold text-red-500">{wrong}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard">
            <button className="w-full sm:w-auto px-8 py-3 bg-background border border-border text-foreground rounded-xl font-bold hover:bg-surface-hover transition-colors flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" /> Kembali ke Dashboard
            </button>
          </Link>
          <Link href="/dashboard/tryout">
            <button className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5" /> Tryout Lainnya
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
