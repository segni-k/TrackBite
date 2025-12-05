import { useState } from "react";
import { View, Text, TextInput, Button, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "@/context/ProfileContext";

export default function WeightScreen() {
  const router = useRouter();
  const { setProfile } = useProfile();
  const [weight, setWeight] = useState("");

  const handleNext = () => {
    if (weight) {
      setProfile({ weight: parseFloat(weight) });
      router.push("/(profile-setup)/birthDate");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-xl font-bold mb-4">What's your weight?</Text>
        <Text className="text-gray-600 mb-4">
          Please enter your weight in kilograms.
        </Text>
      <TextInput
        className="border rounded-xl p-3 w-full mb-4"
        value={weight}
        onChangeText={setWeight}
        placeholder="Enter in kg"
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
                disabled={!weight}
                className={` p-3 bg-gray-200 rounded-lg w-1/3 items-center ${!weight ? "bg-gray-200" : "bg-green-500"} `}
              >
                <Text
                  className={`text-semibold text-lg ${!weight ? "text-gray-400" : "text-white"}`}
                >
                  Next
                </Text>
              </Pressable>
            </View>
    </View>
    </KeyboardAvoidingView>
  );
}
