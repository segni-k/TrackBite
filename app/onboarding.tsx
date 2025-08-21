// app/onboarding.tsx
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#2563eb", "#9333ea"]}
      className="flex-1 justify-center items-center"
    >
      <Animatable.Text
        animation="fadeInDown"
        className="text-4xl font-bold text-white text-center px-6"
      >
        Welcome to TrackBite 🍴
      </Animatable.Text>

      <Animatable.Text
        animation="fadeInUp"
        delay={500}
        className="text-lg text-white/90 text-center mt-4 px-8"
      >
        Your AI-powered meal tracker. Log meals, count calories, and hit your goals.
      </Animatable.Text>

      <Animatable.View animation="bounceIn" delay={1000} className="mt-10">
        <TouchableOpacity
          className="bg-white rounded-2xl px-10 py-4"
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text className="text-lg font-bold text-primary">Get Started</Text>
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  );
}
