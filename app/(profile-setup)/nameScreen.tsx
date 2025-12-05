import { useState } from "react";
import { View, Text, TextInput, Button, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "@/context/ProfileContext";
import { auth } from "@/lib/firebase";

export default function NameScreen() {
  const router = useRouter();
  const { setProfile } = useProfile();
  const defaultName = auth.currentUser?.displayName || "";
  const [name, setName] = useState(defaultName);

  const handleNext = () => {
    if (name) {
      setProfile({ name });
      router.push("/(profile-setup)/gender");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center p-4 gap-4 ">
        <Text className="text-xl font-bold mb-4">What's your name?</Text>
        <TextInput
          className="border rounded-xl p-3 w-full mb-3 text-lg"
          value={name}
        onChangeText={setName}
        placeholder={name ? name : "Type your name here"}
      />
      <View className="flex-row items-center gap-9">
        <Pressable onPress={handleNext} disabled={!name} className={` p-3 bg-gray-200 rounded-lg w-1/3 items-center ${!name ? "bg-gray-200" : "bg-green-500"} `}>
          <Text className={`text-semibold text-lg ${!name ? "text-gray-400" : "text-white"}`}>Next</Text>
        </Pressable>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
}
