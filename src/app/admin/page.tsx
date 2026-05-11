"use client";

import { useEffect, useState } from "react";
import { Users, DollarSign, Database, Loader2, TrendingUp, FileText } from "lucide-react";
import { db } from "@/firebase/firebase";
import { ref, get } from "firebase/database";
import { User } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";

interface Payment {
  orderId: string;
  userId: string;
  amount: number;
  status: "pending" | "success" | "failed";
  createdAt: string;
}

interface UserMap {
  [uid: string]: string; // uid -> name
}

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [premiumUsers, setPremiumUsers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [userMap, setUserMap] = useState<UserMap>({});
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      if (!db) { setLoading(false); return; }
      try {
        const [usersSnap, qSnap, blogsSnap, paymentsSnap] = await Promise.all([
          get(ref(db, "users")),
          get(ref(db, "questions")),
          get(ref(db, "blogs")),
          get(ref(db, "payments")),
        ]);

        // Users
        if (usersSnap.exists()) {
          const usersData = usersSnap.val() as Record<string, User>;
          const arr = Object.values(usersData);
          setTotalUsers(arr.length);
          setPremiumUsers(arr.filter(u => u.premium).length);
          const map: UserMap = {};
          Object.entries(usersData).forEach(([uid, u]) => { map[uid] = u.name; });
          setUserMap(map);
        }

        // Questions
        if (qSnap.exists()) setTotalQuestions(Object.keys(qSnap.val()).length);

        // Blogs
        if (blogsSnap.exists()) setTotalBlogs(Object.keys(blogsSnap.val()).length);

        // Payments
        if (paymentsSnap.exists()) {
          const data = paymentsSnap.val() as Record<string, Omit<Payment, "orderId">>;
          const arr: Payment[] = Object.entries(data)
            .map(([orderId, val]) => ({ orderId, ...val }))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setPayments(arr);
          setRevenue(arr.filter(p => p.status === "success").reduce((acc, p) => acc + p.amount, 0));
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = [
    { name: "Total Users", value: loading ? "..." : totalUsers.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", href: "/admin/users" },
    { name: "Premium Users", value: loading ? "..." : premiumUsers.toString(), icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10", href: "/admin/users" },
    { name: "Total Soal", value: loading ? "..." : totalQuestions.toString(), icon: Database, color: "text-purple-500", bg: "bg-purple-500/10", href: "/admin/questions" },
    { name: "Artikel Blog", value: loading ? "..." : totalBlogs.toString(), icon: FileText, color: "text-orange-500", bg: "bg-orange-500/10", href: "/admin/blogs" },
    { name: "Total Revenue", value: loading ? "..." : `Rp ${revenue.toLocaleString("id-ID")}`, icon: DollarSign, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  const statusStyle: Record<string, string> = {
    success: "bg-green-500/10 text-green-600 border border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20",
    failed: "bg-red-500/10 text-red-500 border border-red-500/20",
  };
  const statusLabel: Record<string, string> = {
    success: "Berhasil",
    pending: "Menunggu",
    failed: "Gagal",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <p className="text-foreground/60 mt-1">Ringkasan platform CATNation secara real-time.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
          >
            {stat.href ? (
              <Link href={stat.href} className="block group">
                <div className="bg-surface border border-border p-5 rounded-2xl flex items-center gap-4 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <stat.icon className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-foreground/60 text-xs font-medium">{stat.name}</p>
                    <h2 className="text-2xl font-bold">{stat.value}</h2>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-surface border border-border p-5 rounded-2xl flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <stat.icon className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-foreground/60 text-xs font-medium">{stat.name}</p>
                  <h2 className="text-xl font-bold">{stat.value}</h2>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">Transaksi Terakhir</h2>
          <span className="text-sm text-foreground/50">{payments.length} total transaksi</span>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-foreground/50">
            <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Belum ada transaksi pembayaran.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="p-4 text-sm font-medium text-foreground/60">Order ID</th>
                  <th className="p-4 text-sm font-medium text-foreground/60">User</th>
                  <th className="p-4 text-sm font-medium text-foreground/60">Jumlah</th>
                  <th className="p-4 text-sm font-medium text-foreground/60">Tanggal</th>
                  <th className="p-4 text-sm font-medium text-foreground/60">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 10).map((p, idx) => (
                  <motion.tr
                    key={p.orderId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-border hover:bg-background/50 transition-colors"
                  >
                    <td className="p-4 text-sm font-mono text-foreground/70">{p.orderId}</td>
                    <td className="p-4 text-sm font-medium">
                      {userMap[p.userId] || (
                        <span className="text-foreground/40 italic">{p.userId?.substring(0, 8)}...</span>
                      )}
                    </td>
                    <td className="p-4 text-sm font-bold text-foreground">
                      Rp {p.amount?.toLocaleString("id-ID")}
                    </td>
                    <td className="p-4 text-sm text-foreground/60">
                      {new Date(p.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyle[p.status] || statusStyle.pending}`}>
                        {statusLabel[p.status] || p.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
