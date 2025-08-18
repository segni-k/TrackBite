// app/(auth)/register.tsx
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center p-8">
      <Text className="text-3xl font-bold text-center mb-8 text-blue-600">
        Create Account
      </Text>

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6"
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        className="bg-blue-600 p-4 rounded-2xl shadow-md mb-4"
        onPress={handleRegister}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? "Signing up..." : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text className="text-blue-600 text-center">
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
