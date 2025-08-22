// app/(auth)/register.tsx
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";


const CustomHeader = () => (
      <View style={{ height: 120, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 35, fontWeight:800 , marginTop:70 }}>Signup</Text>
      </View>
    );

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
    <LinearGradient
      colors={["#2563eb", "#1e3a8a"]}
      className="flex-1 justify-center px-8"
    >
      <Stack.Screen
        options={{
          title: 'Signup',
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#2563eb' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          header: () => <CustomHeader />,
        }}
      />
      <Text className="text-white text-3xl font-bold mb-8">
        Create Your Account 🚀
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#cbd5e1"
        value={email}
        onChangeText={setEmail}
        className="bg-white/20 text-white px-4 py-4 rounded-xl mb-6"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#cbd5e1"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="bg-white/20 text-white px-4 py-4 rounded-xl mb-8"
      />

      <TouchableOpacity
        onPress={handleRegister}
        className="bg-white py-4 rounded-xl mt-6"
      >
        <Text className="text-blue-600 font-bold text-lg text-center">
          Sign Up
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text className="text-white mt-6 text-center">
          Already have an account?{" "}
          <Text className="font-bold underline">Login</Text>
        </Text>
      </TouchableOpacity>
    </LinearGradient>
    </KeyboardAvoidingView>
  );
}
