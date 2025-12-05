import { View, Text, Button, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "@/context/ProfileContext";

export default function ActivityLevelScreen() {
  const router = useRouter();
  const { setProfile } = useProfile();

  const handleSelect = (level: string) => {
    setProfile({ activityLevel: level });
    router.push("/(profile-setup)/goal");
  };

  return (
    <View className="flex-1 items-center justify-center p-4 gap-4">
      <Text className="text-2xl text-gray-700 font-bold mb-6">
        Your activity level
      </Text>
      <Text className="text-gray-600 mb-4">
        Please select your current activity level:
      </Text>
      <View className=" items-center gap-4 mb-4 mt-4 w-full">

      <Pressable
        onPress={() => handleSelect("sedentary")}
        className=" p-3 bg-gray-200 rounded-lg w-1/3 items-center bg-gray-200"
      >
        <Text className={`text-semibold text-blue-500 text-lg `}>
          Sedentary
        </Text>
      </Pressable>
       <Pressable
        onPress={() => handleSelect("light")}
        className=" p-3 bg-gray-200 rounded-lg w-1/3 items-center bg-gray-200"
      >
        <Text className={`text-semibold text-blue-500 text-lg `}>
          Lightly Active
        </Text>
      </Pressable>
       <Pressable
        onPress={() => handleSelect("active")}
        className=" p-3 bg-gray-200 rounded-lg w-1/3 items-center bg-gray-200"
      >
        <Text className={`text-semibold text-blue-500 text-lg `}>
          Active
        </Text>
      </Pressable>
       <Pressable
        onPress={() => handleSelect("very-active")}
        className=" p-3 bg-gray-200 rounded-lg w-1/3 items-center bg-gray-200"
      >
        <Text className={`text-semibold text-blue-500 text-lg `}>
          Very Active
        </Text>
      </Pressable>
      </View>
    </View>
  );
}
