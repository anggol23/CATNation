"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db, auth } from "@/firebase/firebase";
import { ref, get, update } from "firebase/database";
import { updateProfile } from "firebase/auth";
import { Loader2, User, Mail, Star, Trophy, CheckCircle2, Clock, Edit2, X, Save } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface TryoutResult {
  id: string;
  tryoutId: string;
  score: number;
  correct: number;
  wrong: number;
  createdAt: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [results, setResults] = useState<TryoutResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!user || !db) { setLoadingResults(false); return; }

    const fetchResults = async () => {
      try {
        const snap = await get(ref(db, `results/${user.uid}`));
        if (snap.exists()) {
          const data = snap.val();
          const arr: TryoutResult[] = Object.entries(data).map(([id, val]: [string, any]) => ({
            id,
            ...val,
          }));
          arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setResults(arr);
        }
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoadingResults(false);
      }
    };
    fetchResults();
  }, [user]);

  const handleEditName = () => {
    setNewName(user?.name || "");
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleSaveName = async () => {
    if (!newName.trim() || !user || !db) return;
    setSaving(true);
    try {
      // Update Firebase Auth displayName
      if (auth?.currentUser) {
        await updateProfile(auth.currentUser, { displayName: newName.trim() });
      }
      // Update RTDB
      await update(ref(db, `users/${user.uid}`), { name: newName.trim() });
      setSaveSuccess(true);
      setIsEditing(false);
      // Brief reload hint
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating name:", err);
      alert("Gagal menyimpan nama. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const avgScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
    : 0;

  const bestScore = results.length > 0
    ? Math.max(...results.map(r => r.score))
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Profil Saya</h1>

      {/* Profile Card */}
      <div className="bg-surface border border-border rounded-3xl p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-3xl font-extrabold text-primary">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </span>
          </div>

          <div className="flex-1 space-y-3">
            {/* Name Row */}
            <div>
              <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Nama</label>
              {isEditing ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSaveName()}
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-foreground font-semibold"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    className="p-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 bg-foreground/10 text-foreground/70 rounded-xl hover:bg-foreground/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xl font-bold text-foreground">{user?.name}</p>
                  <button
                    onClick={handleEditName}
                    className="p-1.5 text-foreground/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Edit nama"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {saveSuccess && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1 text-green-500 text-sm font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Tersimpan!
                    </motion.span>
                  )}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 text-foreground/70">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="text-sm">{user?.email}</span>
            </div>

            {/* Status */}
            <div>
              {user?.premium ? (
                <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 px-3 py-1 rounded-full text-sm font-bold">
                  <Star className="w-4 h-4 fill-yellow-500" /> Premium Aktif
                </span>
              ) : (
                <Link href="/pricing">
                  <span className="inline-flex items-center gap-1.5 bg-foreground/5 text-foreground/60 border border-border px-3 py-1 rounded-full text-sm font-medium hover:border-primary hover:text-primary cursor-pointer transition-colors">
                    <Star className="w-4 h-4" /> Upgrade Premium
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Tryout Selesai", value: results.length.toString(), icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Rata-rata Skor", value: results.length > 0 ? avgScore.toString() : "-", icon: Trophy, color: "text-primary", bg: "bg-primary/10" },
          { label: "Skor Terbaik", value: results.length > 0 ? bestScore.toString() : "-", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        ].map(stat => (
          <div key={stat.label} className="bg-surface border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tryout History */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Riwayat Tryout</h2>
        </div>
        {loadingResults ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/60">Anda belum menyelesaikan tryout apapun.</p>
            <Link href="/dashboard/tryout">
              <button className="mt-4 px-5 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
                Mulai Tryout
              </button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {results.map((result, idx) => {
              const isPassed = result.score >= 400;
              return (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 flex items-center justify-between hover:bg-background/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isPassed ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-500"
                    }`}>
                      {result.score}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm capitalize">
                        {result.tryoutId?.replace(/-/g, " ") || "Tryout"}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-foreground/60 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(result.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </span>
                        <span className="text-green-600">✓ {result.correct} benar</span>
                        <span className="text-red-500">✗ {result.wrong} salah</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isPassed
                      ? "bg-green-500/10 text-green-600 border border-green-500/20"
                      : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}>
                    {isPassed ? "Lulus" : "Belum"}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
