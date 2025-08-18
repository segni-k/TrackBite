// app/(auth)/login.tsx
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center p-8">
      <Text className="text-4xl font-extrabold text-center mb-10 text-blue-600">
        TrackBite
      </Text>

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="bg-blue-600 p-4 rounded-2xl shadow-md mb-4"
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? "Signing in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text className="text-blue-600 text-center">
          Don’t have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}
