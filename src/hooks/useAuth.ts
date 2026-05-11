
import { useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { ref, get, child } from "firebase/database";
import { auth, db } from "@/firebase/firebase";
import { User } from "@/types";

const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Mock Auth State
      const stored = localStorage.getItem("mock_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
      setLoading(false);
      
      const handleStorageChange = () => {
        const current = localStorage.getItem("mock_user");
        if (!current) setUser(null);
      };
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const dbRef = ref(db);
          const snapshot = await get(child(dbRef, `users/${firebaseUser.uid}`));
          
          if (snapshot.exists()) {
            setUser(snapshot.val() as User);
          } else {
            setUser({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "User",
              email: firebaseUser.email || "",
              premium: false,
              createdAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Error fetching user data from RTDB:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
