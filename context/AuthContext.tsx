// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ActivityIndicator, View } from "react-native";

type AuthContextType = {
  user: User | null;
  profileCompleted: boolean | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profileCompleted: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profileCompleted, setProfileCompleted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const docRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setProfileCompleted(snap.data().profileCompleted || false);
        } else {
          setProfileCompleted(false);
        }
      } else {
        setUser(null);
        setProfileCompleted(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

   if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profileCompleted, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
