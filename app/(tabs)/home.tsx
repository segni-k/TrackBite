// app/(tabs)/home.tsx
import { View, Text } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-blue-600">Welcome to TrackBite 🎯</Text>
      <Text className="text-gray-500 mt-2">Start tracking your meals today!</Text>
    </View>
  );
}
