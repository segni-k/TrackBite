// app/(tabs)/home.tsx
import { Ionicons} from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  FlatList,
  GestureHandlerRootView,
  TouchableHighlight,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import FoodModal, { Food } from "../../components/FoodModal";
import Ring from "../../components/Ring";
import FoodComponent from "@/components/Food";

// ------- Mock data per meal (replace via Firebase later) -------
type MealKey = "Breakfast" | "Lunch" | "Dinner";

type MealState = Record<MealKey, Food[]>;
const initialMeals: MealState = {
  Breakfast: [
    {
      id: "b1",
      name: "Omelette",
      grams: 150,
      calories: 240,
      protein: 18,
      carbs: 2,
      fat: 18,
    },
    {
      id: "b2",
      name: "Toast",
      grams: 60,
      calories: 120,
      protein: 4,
      carbs: 22,
      fat: 2,
    },
  ],
  Lunch: [
    {
      id: "l1",
      name: "Sushi Roll",
      grams: 180,
      calories: 250,
      protein: 12,
      carbs: 38,
      fat: 6,
    },
    {
      id: "l2",
      name: "Fried Shrimp",
      grams: 150,
      calories: 240,
      protein: 20,
      carbs: 16,
      fat: 12,
    },
  ],
  Dinner: [
    {
      id: "d1",
      name: "Cheeseburger",
      grams: 150,
      calories: 303,
      protein: 17,
      carbs: 31,
      fat: 14,
    },
    {
      id: "d2",
      name: "Stuffed Flatbread",
      grams: 120,
      calories: 215,
      protein: 7,
      carbs: 30,
      fat: 7,
    },
  ],
};

// Daily macro goals (editable / from user profile later)
const GOALS = { carbs: 220, protein: 180, fat: 75, calories: 2000 };

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
    setMeals((prev) => ({
      ...prev,
      [meal]: prev[meal].filter((f) => f.id !== foodId),
    }));
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
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header (logo left, bell right) */}
          <View className="px-5 pt-4 pb-14 bg-stone-150 rounded-b-3xl shadow">
            <View className="flex-row justify-between items-center">
              <Text className="text-black text-4xl font-extrabold">
                TrackBite
              </Text>
              <TouchableOpacity>
                <Ionicons name="notifications-outline" size={22} color="#000" />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-500 text-sm mt-2">
              Today, {todayStr}
            </Text>

            {/* Summary row (like pic) */}
            <View className="flex-row justify-between mt-4">
              <View className="items-center">
                <Text className="text-black text-lg font-bold">
                  {totals.calories}
                </Text>
                <Text className="text-gray-700 text-xs">kcal eaten</Text>
              </View>
              <View className="items-center">
                <Text className="text-black text-lg font-bold">
                  {Math.max(0, 2000 - totals.calories)}
                </Text>
                <Text className="text-green-100 text-xs">kcal left</Text>
              </View>
              <View className="items-center">
                <Text className="text-black text-lg font-bold">0</Text>
                <Text className="text-gray-700 text-xs">burned</Text>
              </View>
            </View>
          </View>

          <View className="px-5 -mt-8 shadow-lg ">
            <View className="bg-white rounded-2xl p-5 shadow-md">
              <View className="flex-row justify-between items-center px-4">
                <View className="items-center">
                  <Text className="font-bold text-5xl">
                    {" "}
                    {Math.max(0, 2000 - totals.calories)}
                  </Text>
                  <Text className="text-sm">Calories left</Text>
                </View>
                <Ring
                  value={totals.calories}
                  stroke={8}
                  size={110}
                  goal={GOALS.calories}
                  label="calories eaten"
                  color="#232221ff"
                />
              </View>
            </View>
          </View>

          {/* Macro rings card */}
          <View className="px-5 mt-8 shadow-lg">
            <View className="bg-white rounded-2xl p-5 shadow-md">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-gray-900 text-lg font-semibold">
                  Daily Macros
                </Text>
                <Text className="text-gray-500 text-sm">
                  Goal: {GOALS.calories} kcal
                </Text>
              </View>
              <View className="flex-row justify-between">
                <View className="bg-white rounded-2xl p-2 shadow-md">
                  <Ring
                    value={totals.carbs}
                    goal={GOALS.carbs}
                    label="Carbs"
                    color="#ef4444"
                  />
                </View>
                <View className="bg-white rounded-2xl p-2 shadow-md">
                  <Ring
                    value={totals.protein}
                    goal={GOALS.protein}
                    label="Protein"
                    color="#3b82f6"
                  />
                </View>
                <View className="bg-white rounded-2xl p-2 shadow-md">
                  <Ring
                    value={totals.fat}
                    goal={GOALS.fat}
                    label="Fat"
                    color="#f59e0b"
                  />
                </View>
              </View>
            </View>
          </View>

            <View className="px-5 mt-8">
              <Text className="text-gray-700 text-3xl font-bold mb-2">
                Recently Uploaded
              </Text>
              <FlatList
                ItemSeparatorComponent={
                  Platform.OS !== "android"
                    ? ({ highlighted }: any) => (
                        <View
                          className={`h-[1px] bg-gray-200 ${highlighted ? "ml-0" : ""}`}
                        />
                      )
                    : undefined
                }
                data={[
                  {
                    title: "Omelette",
                    key: "item1",
                    emoji: "🍳",
                    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
                    calories: 240,
                    content: ["15g egg", "10g cheese", "5g spinach"],
                  },
                  {
                    title: "Avocado Toast",
                    key: "item4",
                    emoji: "🥑",
                    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
                    calories: 210,
                    content: ["50g bread", "30g avocado", "5g olive oil"],
                  },
                  {
                    title: "Steak",
                    key: "item6",
                    emoji: "🥩",
                    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80",
                    calories: 400,
                    content: ["80g beef", "10g butter", "5g pepper", "5g garlic"],
                  },
                  {
                    title: "Milkshake",
                    key: "item9",
                    emoji: "🥤",
                    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
                    calories: 220,
                    content: ["100g milk", "20g ice cream", "10g chocolate", "5g sugar"],
                  },
                  {
                    title: "Egg Fried Rice",
                    key: "item10",
                    emoji: "🍚",
                    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
                    calories: 280,
                    content: ["50g rice", "15g egg", "10g peas", "5g carrot"],
                  },
                  {
                    title: "Shrimp Sushi",
                    key: "item11",
                    emoji: "🍣",
                    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
                    calories: 190,
                    content: ["30g rice", "20g shrimp", "5g seaweed", "5g cucumber"],
                  },
                  {
                    title: "Cheeseburger",
                    key: "item12",
                    emoji: "🍔",
                    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80",
                    calories: 303,
                    content: ["60g beef", "20g cheese", "40g bun", "10g lettuce"],
                  },
                  {
                    title: "Fried Shrimp",
                    key: "item15",
                    emoji: "🍤",
                    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
                    calories: 240,
                    content: ["50g shrimp", "20g flour", "10g oil", "5g spices"],
                  },
                  {
                    title: "Veggie Pizza",
                    key: "item16",
                    emoji: "🍕",
                    image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=400&q=80",
                    calories: 330,
                    content: ["60g dough", "30g tomato sauce", "20g cheese", "20g veggies"],
                  },
                ]}
                renderItem={({ item }) => (
                  <FoodComponent
                    title={item.title}
                    key={item.key}
                    emoji={item.emoji}
                    image={item.image}
                    calories={item.calories}
                    content={item.content.join(",   ")}
                  />
                )}
                scrollEnabled={false}
                keyExtractor={(item) => item.key}
              />
            </View>

          {/* Meals list (cards open modal) */}
          <View className="px-5 mt-8">
            <Text className="text-gray-900 text-2xl font-bold mb-2">
              Uploaded Meals
            </Text>

            {Object.values(meals).every((arr) => arr.length === 0) && (
              <View className="px-5 my-8 shadow-lg ">
                <View className="bg-neutral-100 rounded-2xl p-5 shadow-md">
                  <View className=" items-center px-4">
                    <View className="items-center gap-3">
                      <Ionicons name="add-circle" size={58} color="#9ca3af" />
                      <Text className="text-sm text-gray-400">
                        Tap + to add your first meal of the day
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/** Meal Card Component */}
            {(Object.keys(meals) as MealKey[]).map((key) => {
              const kcal = meals[key].reduce((s, f) => s + f.calories, 0);
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setActiveMeal(key)}
                  className="bg-white rounded-2xl p-5 mb-3 shadow-sm flex-row justify-between gap-2"
                >
                  <View className="flex-1">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xl font-bold text-gray-700">
                        {key}
                      </Text>
                      <Text className="text-green-600 font-bold">
                        {kcal} kcal
                      </Text>
                    </View>
                    <Text className="text-gray-500 text-xs mt-1">
                      Tap to view & add foods
                    </Text>
                  </View>
                  <View>
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color="#9ca3af"
                    />
                  </View>
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
