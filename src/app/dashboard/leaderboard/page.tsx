"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { ref, get } from "firebase/database";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Medal, Crown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  uid: string;
  name: string;
  email: string;
  avgScore: number;
  totalTryouts: number;
  bestScore: number;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!db) { setLoading(false); return; }
      try {
        const [resultsSnap, usersSnap] = await Promise.all([
          get(ref(db, "results")),
          get(ref(db, "users")),
        ]);

        if (!resultsSnap.exists() || !usersSnap.exists()) {
          setLoading(false);
          return;
        }

        const resultsData = resultsSnap.val() as Record<string, Record<string, { score: number; correct: number; wrong: number; createdAt: string }>>;
        const usersData = usersSnap.val() as Record<string, { name: string; email: string }>;

        const board: LeaderboardEntry[] = Object.entries(resultsData).map(([uid, userResults]) => {
          const scores = Object.values(userResults).map(r => r.score);
          const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
          const bestScore = Math.max(...scores);
          return {
            uid,
            name: usersData[uid]?.name || "Pengguna",
            email: usersData[uid]?.email || "",
            avgScore,
            bestScore,
            totalTryouts: scores.length,
          };
        });

        board.sort((a, b) => b.avgScore - a.avgScore);

        const rank = user ? board.findIndex(e => e.uid === user.uid) + 1 : null;
        setMyRank(rank && rank > 0 ? rank : null);
        setEntries(board.slice(0, 100));
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 text-center font-bold text-foreground/60">{rank}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leaderboard Nasional</h1>
        <p className="text-foreground/60 mt-2">Peringkat peserta berdasarkan rata-rata skor tryout.</p>
      </div>

      {/* My Rank Banner */}
      {myRank && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/30 rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-primary" />
            <div>
              <p className="font-bold text-foreground">Peringkat Anda</p>
              <p className="text-sm text-foreground/60">Terus berlatih untuk naik peringkat!</p>
            </div>
          </div>
          <span className="text-4xl font-extrabold text-primary">#{myRank}</span>
        </motion.div>
      )}

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="p-16 text-center">
            <Trophy className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <p className="text-foreground/60 font-medium">Belum ada data. Jadilah yang pertama!</p>
            <p className="text-sm text-foreground/40 mt-2">Selesaikan tryout untuk muncul di leaderboard.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="p-4 font-medium text-foreground/60 w-16">Rank</th>
                  <th className="p-4 font-medium text-foreground/60">Peserta</th>
                  <th className="p-4 font-medium text-foreground/60 text-right">Rata-rata</th>
                  <th className="p-4 font-medium text-foreground/60 text-right hidden sm:table-cell">Terbaik</th>
                  <th className="p-4 font-medium text-foreground/60 text-right hidden sm:table-cell">Tryout</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => {
                  const rank = idx + 1;
                  const isMe = user?.uid === entry.uid;
                  return (
                    <motion.tr
                      key={entry.uid}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`border-b border-border transition-colors ${
                        isMe ? "bg-primary/5" : "hover:bg-background/50"
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center justify-center">{getRankIcon(rank)}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                            isMe ? "bg-primary text-white" : "bg-foreground/10 text-foreground/60"
                          }`}>
                            {entry.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${isMe ? "text-primary" : "text-foreground"}`}>
                              {entry.name} {isMe && <span className="text-xs">(Anda)</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-bold text-foreground">{entry.avgScore}</span>
                      </td>
                      <td className="p-4 text-right text-foreground/70 hidden sm:table-cell">{entry.bestScore}</td>
                      <td className="p-4 text-right text-foreground/70 hidden sm:table-cell">{entry.totalTryouts}x</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
