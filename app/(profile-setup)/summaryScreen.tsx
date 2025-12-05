import { View, Text, Pressable, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "@/context/ProfileContext";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import Ring from "@/components/Ring";

function calculateAge(birthDate: Date) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function calculateTargets(profile: any) {
  const { gender, weight, height, birthDate, activityLevel, goal } = profile;
  if (!gender || !weight || !height || !birthDate) return null;

  const age = calculateAge(birthDate);

  // BMR
  let BMR =
    10 * weight + 6.25 * height - 5 * age + (gender === "male" ? 5 : -161);

  // Activity multiplier
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    active: 1.55,
    "very-active": 1.725,
  };

  const multiplier = activityMultipliers[activityLevel] || 1.2;
  let TDEE = BMR * multiplier;

  // Goal adjustment
  if (goal === "lose") TDEE -= 500;
  if (goal === "gain") TDEE += 300;

  // Macros
  const protein = Math.round(weight * 2); // g
  const fat = Math.round((TDEE * 0.25) / 9); // g
  const remainingCalories = TDEE - (protein * 4 + fat * 9);
  const carbs = Math.round(remainingCalories / 4); // g

  return {
    calories: Math.round(TDEE),
    protein,
    fat,
    carbs,
  };
}

export default function SummaryScreen() {
  const router = useRouter();
  const { profile } = useProfile();

  const targets = calculateTargets(profile);

  const handleContinue = async () => {
    const user = auth.currentUser;
    if (!user || !targets) return;

    await setDoc(doc(db, "users", user.uid), {
      ...profile,
      ...targets,
      uid: user.uid,
      email: user.email,
      profileCompleted: true,
      createdAt: new Date(),
    });

    router.replace("/(tabs)/home");
  };

  if (!targets) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Missing profile info ❌</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4">
      <View className="flex-1 items-center justify-center gap-8 p-2 w-full">
        <View className="items-center">
          <Text className="text-3xl font-bold text-blue-500">
            Welcome, {profile.name || "User"}!
          </Text>
          <Text className="text-lg text-gray-600 mt-2">
            Your personalized Nutrition Plan
          </Text>
        </View>
        <View className="items-center">
          <View className="gap-2 bg-gray-100 shadow-md p-6 rounded-2xl ">
            <Text className="text-2xl font-bold mb-4 text-gray-700 text-center">
            Your Daily Targets
          </Text>
            <Ring
              value={targets.calories}
              label="Calories"
              color="#ef4444"
            />
            <View className="flex-row items-center justify-center gap-4">
              <Ring
                value={targets.protein}
                label="Protein"
                color="#ef4444"
              />
               <Ring
                value={targets.carbs}
  
                label="Carbs"
                color="#ef4444"
              />
               <Ring
                value={targets.fat}
                label="Fat"
                color="#ef4444"
              />
            </View>
            <Text className="text-xl font-semibold text-gray-700">
              Calories: {targets.calories} kcal
            </Text>
            <Text className="text-xl font-semibold text-gray-700">
              Protein: {targets.protein} g
            </Text>
            <Text className="text-xl font-semibold text-gray-700">
              Carbs: {targets.carbs} g
            </Text>
            <Text className="text-xl font-semibold text-gray-700">
              Fat: {targets.fat} g
            </Text>
          </View>
        </View>

        <View className="bg-neutral-100 shadow-md border border-gray-200 mt-6 rounded-xl border-t-none p-4 items-center">
          <Text className="mt-6 text-center italic text-gray-700">
            “You're on the right path 🚀 Every step counts.” “You're on the
            right path 🚀 Every step counts.” “You're on the right path 🚀 Every
            step counts.” “You're on the right path 🚀 Every step counts.”
          </Text>
        </View>

        <Pressable
          className="bg-green-500 rounded-3xl py-4 px-5 w-full items-center mt-8"
          onPress={handleContinue}
        >
          <Text className="text-white text-2xl">Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
