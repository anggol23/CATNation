import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { ref, set, get, child } from "firebase/database";
import { auth, db } from "@/firebase/firebase";
import { User } from "@/types";

const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export const registerWithEmail = async (email: string, password: string, name: string) => {
  if (!isFirebaseConfigured) {
    console.warn("Using Mock Auth for testing. Please configure Firebase.");
    const mockUser: User = { uid: "mock-uid", name, email, premium: false, createdAt: new Date().toISOString() };
    if (typeof window !== "undefined") localStorage.setItem("mock_user", JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    const userData: User = { uid: user.uid, name, email, premium: false, createdAt: new Date().toISOString() };
    
    // Write to RTDB
    await set(ref(db, 'users/' + user.uid), userData);
    
    return { success: true, user: userData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  if (!isFirebaseConfigured) {
    console.warn("Using Mock Auth for testing. Please configure Firebase.");
    const mockUser: User = { uid: "mock-uid", name: "User Demo", email, premium: true, createdAt: new Date().toISOString() };
    if (typeof window !== "undefined") localStorage.setItem("mock_user", JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch extra user data from RTDB
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${user.uid}`));
    const userData = snapshot.exists() ? snapshot.val() as User : null;
    
    return { success: true, user: userData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    console.warn("Using Mock Auth for testing. Please configure Firebase.");
    const mockUser: User = { uid: "mock-uid-google", name: "Google User", email: "google@demo.com", premium: false, createdAt: new Date().toISOString() };
    if (typeof window !== "undefined") localStorage.setItem("mock_user", JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  }

  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${user.uid}`));
    let userData: User;

    if (snapshot.exists()) {
      userData = snapshot.val() as User;
    } else {
      userData = {
        uid: user.uid,
        name: user.displayName || "Google User",
        email: user.email || "",
        premium: false,
        createdAt: new Date().toISOString()
      };
      await set(ref(db, 'users/' + user.uid), userData);
    }
    
    return { success: true, user: userData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  if (!isFirebaseConfigured) {
    if (typeof window !== "undefined") localStorage.removeItem("mock_user");
    return { success: true };
  }
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  if (!isFirebaseConfigured) return { success: true };
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
