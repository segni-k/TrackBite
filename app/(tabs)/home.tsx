// app/(tabs)/home.tsx
import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Ring from "../../components/Ring";
import FoodModal, { Food } from "../../components/FoodModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// ------- Mock data per meal (replace via Firebase later) -------
type MealKey = "Breakfast" | "Lunch" | "Dinner";

type MealState = Record<MealKey, Food[]>;
const initialMeals: MealState = {
  Breakfast: [
    { id: "b1", name: "Omelette", grams: 150, calories: 240, protein: 18, carbs: 2, fat: 18 },
    { id: "b2", name: "Toast", grams: 60, calories: 120, protein: 4, carbs: 22, fat: 2 },
  ],
  Lunch: [
    { id: "l1", name: "Sushi Roll", grams: 180, calories: 250, protein: 12, carbs: 38, fat: 6 },
    { id: "l2", name: "Fried Shrimp", grams: 150, calories: 240, protein: 20, carbs: 16, fat: 12 },
  ],
  Dinner: [
    { id: "d1", name: "Cheeseburger", grams: 150, calories: 303, protein: 17, carbs: 31, fat: 14 },
    { id: "d2", name: "Stuffed Flatbread", grams: 120, calories: 215, protein: 7, carbs: 30, fat: 7 },
  ],
};

// Daily macro goals (editable / from user profile later)
const GOALS = { carbs: 220, protein: 180, fat: 75 };

export default function HomeScreen() {
  const [meals, setMeals] = useState<MealState>(initialMeals);
  const [activeMeal, setActiveMeal] = useState<MealKey | null>(null);

  // ---- Derived totals (used by rings and summary) ----
  const totals = useMemo(() => {
    const all = Object.values(meals).flat();
    const calories = all.reduce((s, f) => s + f.calories, 0);
    const carbs = all.reduce((s, f) => s + f.carbs, 0);
    const protein = all.reduce((s, f) => s + f.protein, 0);
    const fat = all.reduce((s, f) => s + f.fat, 0);
    return { calories, carbs, protein, fat };
  }, [meals]);

  // ---- Modal handlers (Add/Delete) ----
  const handleAdd = (meal: MealKey) => (food: Omit<Food, "id">) => {
    const id = `${meal}_${Date.now()}`;
    setMeals((prev) => ({ ...prev, [meal]: [...prev[meal], { id, ...food }] }));
    // TODO: Firebase -> addDoc(mealsRef(userId, date, meal), food)
  };

  const handleDelete = (meal: MealKey) => (foodId: string) => {
    setMeals((prev) => ({ ...prev, [meal]: prev[meal].filter((f) => f.id !== foodId) }));
    // TODO: Firebase -> deleteDoc(mealItemDoc(userId, date, meal, foodId))
  };

  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Header (logo left, bell right) */}
          <View className="px-5 pt-3 pb-4 bg-green-500 rounded-b-3xl shadow">
            <View className="flex-row justify-between items-center">
              <Text className="text-white text-xl font-extrabold">TrackBite</Text>
              <TouchableOpacity>
                <Ionicons name="notifications-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text className="text-green-100 text-sm mt-2">Today, {todayStr}</Text>

            {/* Summary row (like pic) */}
            <View className="flex-row justify-between mt-4">
              <View className="items-center">
                <Text className="text-white text-lg font-bold">{totals.calories}</Text>
                <Text className="text-green-100 text-xs">kcal eaten</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-lg font-bold">
                  {Math.max(0, 2000 - totals.calories)}
                </Text>
                <Text className="text-green-100 text-xs">kcal left</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-lg font-bold">0</Text>
                <Text className="text-green-100 text-xs">burned</Text>
              </View>
            </View>
          </View>

          {/* Macro rings card */}
          <View className="px-5 -mt-8">
            <View className="bg-white rounded-2xl p-5 shadow-sm">
              <Text className="text-gray-800 font-semibold mb-4">Macros</Text>
              <View className="flex-row justify-between">
                <Ring value={totals.carbs} goal={GOALS.carbs} label="Carbs" color="#ef4444" />
                <Ring value={totals.protein} goal={GOALS.protein} label="Protein" color="#3b82f6" />
                <Ring value={totals.fat} goal={GOALS.fat} label="Fat" color="#f59e0b" />
              </View>
            </View>
          </View>

          {/* Meals list (cards open modal) */}
          <View className="px-5 mt-6">
            <Text className="text-gray-900 text-lg font-semibold mb-2">Meals</Text>

            {/** Meal Card Component */}
            {(Object.keys(meals) as MealKey[]).map((key) => {
              const kcal = meals[key].reduce((s, f) => s + f.calories, 0);
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setActiveMeal(key)}
                  className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="text-base font-semibold text-gray-900">{key}</Text>
                    <Text className="text-green-600 font-bold">{kcal} kcal</Text>
                  </View>
                  <Text className="text-gray-500 text-xs mt-1">Tap to view & add foods</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Food modal per meal */}
        {activeMeal && (
          <FoodModal
            visible={!!activeMeal}
            mealLabel={activeMeal}
            foods={meals[activeMeal]}
            onClose={() => setActiveMeal(null)}
            onAdd={handleAdd(activeMeal)}
            onDelete={handleDelete(activeMeal)}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
