"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useRouter } from "next/navigation";

export type UserRole = "Admin" | "Senior Underwriter" | "Junior Underwriter";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: UserRole | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists() && userDoc.data().role) {
            setRole(userDoc.data().role as UserRole);
          } else {
            // Fallback to email-based role mapping
            if (currentUser.email === "admin@solvency.ai") {
              setRole("Admin");
            } else if (currentUser.email === "senior@solvency.ai") {
              setRole("Senior Underwriter");
            } else {
              setRole("Junior Underwriter");
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole("Junior Underwriter");
        }
      } else {
        setRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setRole(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
