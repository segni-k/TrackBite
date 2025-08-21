import { View, Text, Image } from "react-native";

export default function OnboardingSlide({ slide }: { slide: any }) {
  return (
    <View className="items-center flex-1">
      <Image
        source={{ uri: slide.image }}
        className="w-64 h-64 rounded-3xl mb-6"
      />
      <Text className="text-2xl font-bold text-blue-600 text-center mb-2">
        {slide.title}
      </Text>
      <Text className="text-gray-600 text-center text-base px-4">
        {slide.desc}
      </Text>
    </View>
  );
}
