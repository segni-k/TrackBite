import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "@/context/ProfileContext";

export default function HeightScreen() {
  const router = useRouter();
  const { setProfile } = useProfile();
  const [height, setHeight] = useState("");

  const handleNext = () => {
    if (height) {
      setProfile({ height: parseInt(height, 10) });
      router.push("/(profile-setup)/weight");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
  
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-2xl font-bold mb-6 text-gray-700">
            What's your height?
          </Text>
          <Text className="text-gray-600 mb-4">
        Please enter your height in centimeters.
      </Text>
      <TextInput
        className="border rounded-xl p-3 w-full mb-4"
        value={height}
        onChangeText={setHeight}
        placeholder="Enter in cm"
        keyboardType="numeric"
      />

      <View className="flex-row items-center gap-9 mt-4">
        <Pressable
          onPress={() => router.back()}
          className=" p-3 bg-gray-200 rounded-lg w-1/3 items-center bg-gray-200" 
        >
          <Text
            className={`text-semibold text-blue-500 text-lg `}
          >
            Back
          </Text>
        </Pressable>
        <Pressable
          onPress={handleNext}
          disabled={!height}
          className={` p-3 bg-gray-200 rounded-lg w-1/3 items-center ${!height ? "bg-gray-200" : "bg-green-500"} `}
        >
          <Text
            className={`text-semibold text-lg ${!height ? "text-gray-400" : "text-white"}`}
          >
            Next
          </Text>
        </Pressable>
      </View>
    </View>

    </KeyboardAvoidingView>
  );
}
