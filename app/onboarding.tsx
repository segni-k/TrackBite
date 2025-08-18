// app/onboarding.tsx
import { View, Text, Image, TouchableOpacity, Dimensions, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Track Your Meals",
    subtitle: "Log meals easily with photos or manual entry.",
    image: require("../assets/images/react-logo.png"),
  },
  {
    id: "2",
    title: "Ethiopian Foods",
    subtitle: "We include injera, shiro, kitfo and more.",
    image: require("../assets/images/favicon.png"),
  },
  {
    id: "3",
    title: "AI Powered",
    subtitle: "Snap a photo, we estimate nutrition instantly.",
    image: require("../assets/images/icon.png"),
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("seenOnboarding", "true");
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Slides */}
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View className="w-full items-center justify-center px-8" style={{ width }}>
            <Image source={item.image} className="w-72 h-72 mb-8" resizeMode="contain" />
            <Text className="text-3xl font-extrabold text-gray-900 mb-3 text-center">
              {item.title}
            </Text>
            <Text className="text-lg text-gray-500 text-center">{item.subtitle}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Pagination Dots */}
      <View className="flex-row justify-center mb-6">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 mx-1 rounded-full ${
              index === currentIndex ? "bg-blue-600 w-4" : "bg-gray-300"
            }`}
          />
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity
        className="mx-10 mb-10 bg-blue-600 p-4 rounded-2xl shadow-lg"
        onPress={finishOnboarding}
      >
        <Text className="text-white text-center font-bold text-lg">
          {currentIndex === slides.length - 1 ? "Get Started" : "Skip"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
