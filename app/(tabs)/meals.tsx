// components/FoodModal.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import {
  GestureHandlerRootView,
  Pressable,
  Swipeable,
} from "react-native-gesture-handler";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import FoodComponent from "@/components/Food";

export type Food = {
  id: string;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type Props = {
  visible: boolean;
  mealLabel: string;
  foods: Food[];
  onClose: () => void;
  onAdd: (f: Omit<Food, "id">) => void;
  onDelete: (foodId: string) => void;
};

const foods = [
  {
    title: "Omelette",
    key: "item1",
    emoji: "🍳",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    calories: 240,
    content: ["15g egg", "10g cheese", "5g spinach"],
  },
  {
    title: "Avocado Toast",
    key: "item4",
    emoji: "🥑",
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
    calories: 210,
    content: ["50g bread", "30g avocado", "5g olive oil"],
  },
  {
    title: "Steak",
    key: "item6",
    emoji: "🥩",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80",
    calories: 400,
    content: ["80g beef", "10g butter", "5g pepper", "5g garlic"],
  },
  {
    title: "Milkshake",
    key: "item9",
    emoji: "🥤",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    calories: 220,
    content: ["100g milk", "20g ice cream", "10g chocolate", "5g sugar"],
  },
  {
    title: "Egg Fried Rice",
    key: "item10",
    emoji: "🍚",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    calories: 280,
    content: ["50g rice", "15g egg", "10g peas", "5g carrot"],
  },
  {
    title: "Shrimp Sushi",
    key: "item11",
    emoji: "🍣",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    calories: 190,
    content: ["30g rice", "20g shrimp", "5g seaweed", "5g cucumber"],
  },
  {
    title: "Cheeseburger",
    key: "item12",
    emoji: "🍔",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80",
    calories: 303,
    content: ["60g beef", "20g cheese", "40g bun", "10g lettuce"],
  },
  {
    title: "Fried Shrimp",
    key: "item15",
    emoji: "🍤",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    calories: 240,
    content: ["50g shrimp", "20g flour", "10g oil", "5g spices"],
  },
  {
    title: "Veggie Pizza",
    key: "item16",
    emoji: "🍕",
    image:
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=400&q=80",
    calories: 330,
    content: ["60g dough", "30g tomato sauce", "20g cheese", "20g veggies"],
  },
];
export default function FoodModal({ onClose }: Props) {
  const [searchText, setSearchText] = useState("");

  // Filter foods based on searchText
  const filteredFoods = useMemo(() => {
    if (!searchText.trim()) return foods;
    return foods.filter((food) =>
      food.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white "
      >
      
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 pt-10 border-b border-gray-100 shadow-sm">
          <Text className="text-2xl pt-6 font-bold text-gray-600">
            Add Your First Meal of the Day
          </Text>
          <TouchableOpacity onPress={onClose} className="pt-6">
            <FontAwesome5 name="bullseye" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="px-5 pt-4">
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2">
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-700"
              placeholder="Search meals..."
              placeholderTextColor="#9ca3af"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>
        {/* Food List */}
        <FlatList
          data={filteredFoods}
          keyExtractor={(item) => item.key}
          contentContainerClassName="px-5 pt-3 pb-28"
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
          ListEmptyComponent={
            <Pressable onPress={() => {}}>
              <View className="px-5 my-8 shadow-lg ">
                <View className="bg-neutral-100 rounded-2xl p-5 shadow-md">
                  <View className="items-center px-4">
                    <View className="items-center gap-3">
                      <Ionicons name="add-circle" size={58} color="#9ca3af" />
                      <Text className="text-sm text-gray-400">
                        Tap + to add your first meal of the day
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          }
        />

        {/* Add Bar */}
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}
