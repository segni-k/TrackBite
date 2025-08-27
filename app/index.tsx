// app/index.tsx
import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const [firstTime, setFirstTime] = useState<boolean | null>(null);
  const { user, profileCompleted, loading } = useAuth();

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("seenOnboarding");
      setFirstTime(!seen);
    };
    checkOnboarding();
  }, []);

  // 🔹 Splash while waiting
  if (firstTime === null || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (firstTime) return <Redirect href="/onboarding" />;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (profileCompleted === false) return <Redirect href="/(profile-setup)/nameScreen" />;
  return <Redirect href="/(tabs)/home" />;
}


