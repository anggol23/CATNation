"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { ref, get, child } from "firebase/database";
import { User } from "@/types";
import { Loader2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "users"));
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersArray = Object.values(usersData) as User[];
          // Sort by newest first
          usersArray.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setUsers(usersArray);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen User</h1>
        <div className="bg-surface border border-border px-4 py-2 rounded-lg text-sm text-foreground/60">
          Total: {users.length} User
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="p-4 font-medium text-foreground/60">Nama</th>
                <th className="p-4 font-medium text-foreground/60">Email</th>
                <th className="p-4 font-medium text-foreground/60">Bergabung</th>
                <th className="p-4 font-medium text-foreground/60">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-foreground/60 italic">
                    Belum ada data user.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.uid} className="border-b border-border hover:bg-background/50 transition-colors">
                    <td className="p-4 text-sm font-medium">{u.name}</td>
                    <td className="p-4 text-sm text-foreground/80">{u.email}</td>
                    <td className="p-4 text-sm text-foreground/60">
                      {new Date(u.createdAt || "").toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </td>
                    <td className="p-4">
                      {u.premium ? (
                        <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                          Premium
                        </span>
                      ) : (
                        <span className="bg-foreground/5 text-foreground/60 px-3 py-1 rounded-full text-xs font-bold border border-border">
                          Free
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
