import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";
import { Modal, View, Text, Pressable } from "react-native";



type Props = {
  visible: boolean;
  streakData: { label: string; active: boolean }[];
  onClose: () => void;
};

export default function StreakModal({ visible, onClose, streakData }: Props) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white p-6 rounded-3xl w-[94%] justify-between">
          <Text className="text-2xl font-bold mb-4">🔥 Your Streak</Text>
          <Text className="text-gray-500">Keep it up!</Text>
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-500">Current Streak:</Text>
            <Text className="text-lg font-bold">4 days</Text>

          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-500">Longest Streak:</Text>
            <Text className="text-lg font-bold">5 days</Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-500">Total Streak:</Text>
            <Text className="text-lg font-bold">9 days</Text>
          </View>
          <View className="items-center justify-center mb-4">
            <Text className="text-9xl ">🔥</Text>
            <Text className="text-2xl font-bold text-orange-500">Day streak</Text>
          </View>

          {/* Example streak data */}
          <View className="flex-row justify-between mb-6">
            {streakData.map((day: { label: string; active: boolean }, i: number) => (
              <View key={i} className="items-center">
                <Text className="text-gray-500">{day.label}</Text>
                <Text className={`text-lg font-bold ${day.active ? "text-red-500" : "text-gray-300"}`}>
                  {day.active ? "🔥" : "•"}
                </Text>
              </View>
            ))}
          </View>

          <Pressable onPress={onClose} className="bg-gray-900 p-5 rounded-3xl">
            <Text className="text-white text-center text-xl font-semibold">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
