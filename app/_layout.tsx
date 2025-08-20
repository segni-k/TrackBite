// Import the global.css file in the index.js file:
import '../global.css';


// app/_layout.tsx
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const checkFlow = async () => {
      const seen = await AsyncStorage.getItem("seenOnboarding");
      onAuthStateChanged(auth, (user) => {
        if (!seen) {
          router.replace("/onboarding");
        } else if (user) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/(auth)/login");
        }
        setLoading(false);
      });
    };
    checkFlow();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white mt-100">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return <Slot />; // Render the correct route
}
