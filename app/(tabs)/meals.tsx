// app/(tabs)/meals.tsx
import { View, Text } from "react-native";

export default function Meals() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-semibold text-gray-800">Meals</Text>
      <Text className="text-gray-500 mt-2">Here you’ll log & manage your meals 🍲</Text>
    </View>
  );
}
