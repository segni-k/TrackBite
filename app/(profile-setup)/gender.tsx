import { View, Text, Button, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "@/context/ProfileContext";

export default function GenderScreen() {
  const router = useRouter();
  const { setProfile } = useProfile();

  const handleSelect = (gender: string) => {
    setProfile({ gender });
    router.push("/(profile-setup)/height");
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl text-gray-700 font-bold mb-6">Select your gender</Text>
       <View className="flex-row px-4 justify-between items-center gap-2 w-full">
                    <Pressable
                      onPress={() => handleSelect("male")}
                      className=" p-3 bg-gray-200 rounded-lg w-1/3 items-center bg-gray-200"
                    >
                      <Text className={`text-semibold text-blue-500 text-lg `}>
                        Male
                      </Text>
                    </Pressable>
                     <Pressable
                      onPress={() => handleSelect("female")}
                      className=" p-3 bg-gray-200 rounded-lg w-1/3 items-center bg-gray-200"
                    >
                      <Text className={`text-semibold text-blue-500 text-lg `}>
                        Female
                      </Text>
                    </Pressable>
                     <Pressable
                      onPress={() => handleSelect("other")}
                      className=" p-3 bg-gray-200 rounded-lg w-1/3 items-center bg-gray-200"
                    >
                      <Text className={`text-semibold text-blue-500 text-lg `}>
                        Other
                      </Text>
                    </Pressable>
              
                    </View>
    </View>
  );
}
