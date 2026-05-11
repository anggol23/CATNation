"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { ref, get } from "firebase/database";
import { motion } from "framer-motion";
import { Trophy, Target, Clock, Star, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";

interface ResultEntry {
  score: number;
  correct: number;
  wrong: number;
  tryoutId: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user || !db) { setLoadingStats(false); return; }
    const fetchStats = async () => {
      try {
        const snap = await get(ref(db, `results/${user.uid}`));
        if (snap.exists()) {
          const data = snap.val();
          const arr: ResultEntry[] = Object.values(data);
          setResults(arr);
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [user]);

  const avgScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
    : 0;

  const totalDone = results.length;

  // Approximate study time: assume ~90 min per tryout
  const studyMinutes = totalDone * 90;
  const studyHours = Math.floor(studyMinutes / 60);
  const studyLabel = studyHours > 0 ? `${studyHours}j` : `${studyMinutes}m`;

  // Week count
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = results.filter(r => new Date(r.createdAt).getTime() > oneWeekAgo).length;

  const avgPercent = Math.min(Math.round((avgScore / 550) * 100), 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-surface p-8 rounded-3xl border border-border gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Halo, {user?.name?.split(" ")[0]}! 👋</h1>
          <p className="text-foreground/60 mt-2">
            {user?.premium
              ? "Selamat belajar! Akses premium aktif."
              : "Upgrade ke premium untuk akses seluruh fitur tryout."}
          </p>
        </div>
        {!user?.premium && (
          <Link href="/pricing">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center gap-2 whitespace-nowrap">
              <Star className="w-5 h-5 fill-white" />
              Upgrade Premium
            </button>
          </Link>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avg Score */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="bg-surface p-6 rounded-2xl border border-border shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-foreground/60 font-medium">Rata-rata Skor</p>
              {loadingStats ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin mt-1" />
              ) : (
                <h3 className="text-2xl font-bold text-foreground">{avgScore || "–"}</h3>
              )}
            </div>
          </div>
          {!loadingStats && totalDone > 0 && (
            <>
              <div className="w-full bg-background rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-700"
                  style={{ width: `${avgPercent}%` }}
                />
              </div>
              <p className="text-xs text-foreground/50 mt-2">Target aman: 450 (TWK+TIU+TKP)</p>
            </>
          )}
          {!loadingStats && totalDone === 0 && (
            <p className="text-xs text-foreground/40 italic">Belum ada data tryout.</p>
          )}
        </motion.div>

        {/* Tryout Done */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ y: -4 }}
          className="bg-surface p-6 rounded-2xl border border-border shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-foreground/60 font-medium">Tryout Selesai</p>
              {loadingStats ? (
                <Loader2 className="w-5 h-5 text-green-500 animate-spin mt-1" />
              ) : (
                <h3 className="text-2xl font-bold text-foreground">{totalDone}</h3>
              )}
            </div>
          </div>
          {!loadingStats && (
            <p className="text-sm text-green-500 font-medium">
              {thisWeek > 0 ? `+${thisWeek} minggu ini 🔥` : "Belum ada tryout minggu ini"}
            </p>
          )}
        </motion.div>

        {/* Study Time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="bg-surface p-6 rounded-2xl border border-border shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-foreground/60 font-medium">Estimasi Belajar</p>
              {loadingStats ? (
                <Loader2 className="w-5 h-5 text-purple-500 animate-spin mt-1" />
              ) : (
                <h3 className="text-2xl font-bold text-foreground">{totalDone > 0 ? studyLabel : "–"}</h3>
              )}
            </div>
          </div>
          {!loadingStats && (
            <p className="text-sm text-foreground/60 font-medium">
              {totalDone > 0 ? "Konsisten setiap hari 🎯" : "Mulai tryout untuk mencatat waktu belajar"}
            </p>
          )}
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-primary/5 border border-primary/20 p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Simulasi SKD CPNS Terbaru</h2>
            <p className="text-foreground/70 text-sm">
              Ikuti simulasi akbar. 110 soal · 100 menit · Passing grade sesuai standar BKN terbaru.
            </p>
          </div>
        </div>
        <Link href="/dashboard/tryout">
          <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-all whitespace-nowrap">
            Mulai Sekarang
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
