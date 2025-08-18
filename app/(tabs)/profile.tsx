// app/(tabs)/profile.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-semibold text-gray-800">Profile</Text>
      <TouchableOpacity
        className="mt-6 bg-red-500 px-6 py-3 rounded-xl"
        onPress={handleLogout}
      >
        <Text className="text-white font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
