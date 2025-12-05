import { View, Text, Button, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "@/context/ProfileContext";

export default function GoalScreen() {
  const router = useRouter();
  const { setProfile } = useProfile();

  const handleSelect = (goal: string) => {
    setProfile({ goal });
    router.push("/(profile-setup)/summaryScreen");
  };

  return (
    <View className="flex-1 items-center justify-center p-4 gap-4">
      <Text className="text-2xl text-gray-700 font-bold mb-6">What's your goal?</Text>
      <Text className="text-gray-600 mb-4">Please select your goal:</Text>

      <View className=" items-center gap-4 mb-4 mt-4 w-full">
              <Pressable
                onPress={() => handleSelect("lose")}
                className=" p-3 bg-gray-200 rounded-lg w-1/3 items-center bg-gray-200"
              >
                <Text className={`text-semibold text-blue-500 text-lg `}>
                  Loose Weight
                </Text>
              </Pressable>
               <Pressable
                onPress={() => handleSelect("maintain")}
                className=" p-3 bg-gray-200 rounded-lg w-1/3 items-center bg-gray-200"
              >
                <Text className={`text-semibold text-blue-500 text-lg `}>
                  Maintain
                </Text>
              </Pressable>
               <Pressable
                onPress={() => handleSelect("gain")}
                className=" p-3 bg-gray-200 rounded-lg w-1/3 items-center bg-gray-200"
              >
                <Text className={`text-semibold text-blue-500 text-lg `}>
                  Gain Weight
                </Text>
              </Pressable>
        
              </View>
    </View>
  );
}
