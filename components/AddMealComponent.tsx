import React, { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { searchFood, getNutrition, Portion, Food } from "@/utils/foodLoader";
import { addDoc, collection, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { ScrollView } from "react-native";

export default function AddMealScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [portion, setPortion] = useState<Portion>("small");
  const [loggedFood, setLoggedFood] = useState<Food[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    setResults(searchFood(text));
  };

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setResults([]);
    setQuery(food.name);
  };

  const handleAddMeal = async () => {
    if (!selectedFood || !portion) return;

    const nutrition = getNutrition(selectedFood, portion);
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, "users", user.uid, "meals"), {
        food: selectedFood.name,
        portion,
        nutrition: selectedFood.nutrition[portion],
        createdAt: new Date(),
      });
    }



    alert(
      `Added ${selectedFood.name} (${portion}) - ${nutrition.calories} kcal`
    );
    setSelectedFood(null);

    setLoggedFood((prev) => [...prev, selectedFood]);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="flex-1 bg-white p-5">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Add Your Meal
        </Text>

      <TextInput
        placeholder="Type food name..."
        value={query}
        onChangeText={handleSearch}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-3"
      />

      <View className="mt-5">
        <Text className="text-xl font-semibold text-gray-800 mb-3">
          {selectedFood ? "Selected Food:" : "Search Results:"}
          {selectedFood && (
            <Text className="text-lg text-gray-700">
              {selectedFood.name} ({portion}) -{" "}
              {getNutrition(selectedFood, portion).calories} kcal
            </Text>
          )}
        </Text>

         {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 10, gap: 5 }}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectFood(item)}
              className="p-3 transition bg-white border rounded-lg border-gray-200"
            >
              <Text className="text-lg text-gray-700">{item.name}</Text>
            </TouchableOpacity>
          )}
          ListHeaderComponent={<Text className="text-lg font-bold text-gray-800 mt-4">Food Results</Text>}
        />
      )}
       




      {selectedFood && (
        <View className="mt-5">
          <Text className="text-xl font-semibold text-gray-800 mb-3">
            Choose Portion Size:
          </Text>
          {(["small", "medium", "large"] as Portion[]).map((size) => (
            <Pressable
              key={size}
              onPress={() => setPortion(size)}
              className={`p-4 rounded-xl mb-3 ${
                portion === size ? "bg-blue-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-lg ${portion === size ? "text-white" : "text-gray-800"}`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)} —{" "}
                {getNutrition(selectedFood, size).calories} kcal
              </Text>
            </Pressable>
          ))}

          {portion && (
            <View className="p-4 rounded-xl bg-gray-50 mt-3">
              <Text className="text-lg font-semibold text-gray-800">
                Nutrition Info ({portion})
              </Text>
              <Text className="text-gray-700">
                Calories: {getNutrition(selectedFood, portion).calories}
              </Text>
              <Text className="text-gray-700">
                Protein: {getNutrition(selectedFood, portion).protein} g
              </Text>
              <Text className="text-gray-700">
                Carbs: {getNutrition(selectedFood, portion).carbs} g
              </Text>
              <Text className="text-gray-700">
                Fat: {getNutrition(selectedFood, portion).fat} g
              </Text>
            </View>
          )}

          <Pressable
            onPress={handleAddMeal}
            disabled={!portion}
            className={`mt-5 p-4 rounded-xl ${portion ? "bg-green-500" : "bg-gray-300"}`}
          >
            <Text className="text-center text-white text-lg font-bold">
              Add Meal
            </Text>
          </Pressable>
        </View>
      )}
              <View className="text-lg gap-2 text-gray-700">
          {loggedFood.length > 0 && <Text className="py-2 text-gray-600 text-lg">Recently logged: </Text>}
          {loggedFood.length > 0 && loggedFood.map((food, i) => {
            return <View key={i} className="bg-gray-100 p-4 rounded-md">
              <Text className="text-gray-600 text-blue-500">
                {food.name}, {food.category}, {food.nutrition[portion].calories} kcal;{" "}
              </Text>
            </View>;
          })}
        </View>
      </View>
    </View>
    </ScrollView>
  );
}
