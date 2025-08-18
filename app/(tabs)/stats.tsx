// app/(tabs)/stats.tsx
import { View, Text } from "react-native";

export default function Stats() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-semibold text-gray-800">Stats</Text>
      <Text className="text-gray-500 mt-2">See calories, protein, and progress 📊</Text>
    </View>
  );
}
