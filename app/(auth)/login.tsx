// app/(auth)/login.tsx
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack, useRouter } from "expo-router";
import { useState } from "react";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";


 const CustomHeader = () => (
      <View style={{ height: 120, backgroundColor: '#1ef454ff', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 35, fontWeight:800 , marginTop:70 }}>Login</Text>
      </View>
    );

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <LinearGradient
        colors={["#1ef454ff", "#1e8a4bff"]}
        className="flex-1 justify-center px-8"
      >
        <Stack.Screen
        options={{
          title: 'Login',
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#1ef454ff' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          header: () => <CustomHeader />,
        }}
      />
      <Text className="text-white text-4xl font-bold mb-8 flex items-center justify-center align-center">Welcome Back 👋</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#cbd5e1"
        value={email}
        onChangeText={setEmail}
        className="bg-white/20 text-white px-4 py-4 rounded-xl mb-6"
      />
      <View className="flex mb-4 " >
            <TextInput
              placeholder="Password"
              placeholderTextColor="#cbd5e1"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="bg-white/20 text-white px-4 py-4 rounded-xl mb-2"
            />
            <Link href="/forgot-password" className="text-white text-sm mb-6 flex w-full">
            <Text className="flex-1 text-right">Forgot Password</Text>
            </Link>
      </View>
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-white py-4 rounded-xl"
      >
        <Text className="text-blue-600 font-bold text-lg text-center">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text className="text-white mt-6 text-center">
          Don’t have an account?{" "}
          <Text className="font-bold underline">Sign up</Text>
        </Text>
      </TouchableOpacity>
    </LinearGradient>
    </KeyboardAvoidingView>
  );
}
