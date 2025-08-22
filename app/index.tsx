import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [firstTime, setFirstTime] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstTime = async () => {
      const seen = await AsyncStorage.getItem("seenOnboarding");
      setFirstTime(!seen);
    };
    checkFirstTime();
  }, []);

  if (firstTime === null) return null; // splash loading

  return firstTime ? <Redirect href="/onboarding" /> : <Redirect href="/(tabs)/home" />;
}
