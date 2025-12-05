// app/(tabs)/AddMeal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  FlatList,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { auth, db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import * as Progress from "react-native-progress";
import Animated, { SlideInUp } from "react-native-reanimated";

// Ethiopian food DB
const ethiopianFoodDB: Record<string, { name: string; calories: number; protein: number; carbs: number; fat: number }> = {
  injera: { name: "Injera", calories: 166, protein: 5, carbs: 33, fat: 0.5 },
  doro_wot: { name: "Doro Wot", calories: 350, protein: 25, carbs: 10, fat: 20 },
  kitfo: { name: "Kitfo", calories: 400, protein: 30, carbs: 5, fat: 25 },
  sambusa: { name: "Sambusa", calories: 150, protein: 4, carbs: 20, fat: 7 },
};

type Meal = {
  id: string;
  name: string;
  type: string;
  portion: string;
  pieces: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  photoURL?: string;
  createdAt?: any;
  _pending?: boolean;
  _progress?: number;
};

export default function AddMeal() {
  const [name, setName] = useState("");
  const [type, setType] = useState("breakfast");
  const [portion, setPortion] = useState("medium");
  const [pieces, setPieces] = useState("1");
  const [photo, setPhoto] = useState<string | null>(null);
  const [recentMeals, setRecentMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);

  

  // suggestions
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // preview modal
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewMeal, setPreviewMeal] = useState<any>(null);

  const user = auth.currentUser;

  // Load recent meals
  useEffect(() => {
    if (!user) return;
    const mealsRef = collection(db, "users", user.uid, "meals");
    const q = query(mealsRef, orderBy("createdAt", "desc"), limit(3));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Meal[];
      setRecentMeals((prev) => {
        const pending = prev.filter((m) => m._pending);
        return [...pending, ...data];
      });
    });

    return unsubscribe;
  }, [user]);

  // Search foods
  const handleSearch = async (text: string) => {
    setName(text);
    if (text.length < 2) {
      setShowSuggestions(false);
      return;
    }

    const lower = text.toLowerCase();
    const localMatches = Object.values(ethiopianFoodDB).filter((food) =>
      food.name.toLowerCase().includes(lower)
    );

    try {
      const res = await fetch(
        `https://trackapi.nutritionix.com/v2/search/instant?query=${text}`,
        {
          headers: {
            "x-app-id": "YOUR_APP_ID",
            "x-app-key": "YOUR_APP_KEY",
          },
        }
      );
      const data = await res.json();
      const remoteMatches =
        data.common?.map((f: any) => ({ name: f.food_name })) || [];

      setSuggestions([...localMatches, ...remoteMatches]);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Nutritionix search failed", err);
      setSuggestions(localMatches);
      setShowSuggestions(true);
    }
  };

  // Pick suggestion → open preview modal
  const selectFood = async (food: any) => {
    setShowSuggestions(false);

    const count = Number(pieces) || 1;

    let details = { ...food };

    if (food.calories) {
      details = {
        ...food,
        calories: food.calories * count,
        protein: food.protein * count,
        carbs: food.carbs * count,
        fat: food.fat * count,
      };
    } else {
      try {
        const res = await fetch(
          `https://trackapi.nutritionix.com/v2/natural/nutrients`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-app-id": "YOUR_APP_ID",
              "x-app-key": "YOUR_APP_KEY",
            },
            body: JSON.stringify({ query: `${pieces} ${food.name}` }),
          }
        );
        const data = await res.json();
        if (data.foods && data.foods.length > 0) {
          const f = data.foods[0];
          details = {
            name: f.food_name,
            calories: f.nf_calories,
            protein: f.nf_protein,
            carbs: f.nf_total_carbohydrate,
            fat: f.nf_total_fat,
          };
        }
      } catch (err) {
        console.error("Nutrition fetch failed", err);
      }
    }

    setPreviewMeal(details);
    setPreviewVisible(true);
  };

  // Upload photo from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  // Take photo
  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera access is required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  // Confirm save from preview

  const confirmMeal = async () => {
  if (!user || !previewMeal) return;

  try {
    setLoading(true);
    const localId = Date.now().toString();

    const pendingMeal: Meal = {
      id: localId,
      name: previewMeal.name,
      type,
      portion,
      pieces: Number(pieces),
      calories: Number(previewMeal.calories),
      protein: Number(previewMeal.protein),
      carbs: Number(previewMeal.carbs),
      fat: Number(previewMeal.fat),
      photoURL: photo || undefined,
      _pending: true,
      _progress: 0,
    };

    setRecentMeals((prev) => [pendingMeal, ...prev]);
    setPreviewVisible(false);

    // 🔥 keep your existing photo upload + Firestore logic here
    // (reuse the same code from handleAddMeal)
  } catch (e) {
    console.error("Add meal error", e);
    setLoading(false);
  }
};


  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Add Meal</Text>

      {/* Meal Name */}
      <TextInput
        placeholder="Meal Name"
        value={name}
        onChangeText={handleSearch}
        className="border p-3 rounded-lg mb-3"
      />

      {/* Suggestions */}
      {showSuggestions && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => selectFood(item)}
              className="p-3 border-b bg-gray-100"
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={{ maxHeight: 150, marginBottom: 10 }}
        />
      )}

      {/* Quantity */}
      <TextInput
        placeholder="Pieces (e.g., 2)"
        keyboardType="numeric"
        value={pieces}
        onChangeText={(t) => setPieces(t)}
        className="border p-3 rounded-lg mb-3"
      />

      {/* Portion */}
      <Text className="mb-1">Portion</Text>
      <View className="flex-row mb-3">
        {["small", "medium", "large"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setPortion(item)}
            className={`px-4 py-2 mr-2 rounded-lg ${
              portion === item ? "bg-green-500" : "bg-gray-200"
            }`}
          >
            <Text className={portion === item ? "text-white" : "text-black"}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Photo Options */}
      <View className="flex-row mb-4">
        <TouchableOpacity
          onPress={takePhoto}
          className="bg-blue-500 p-3 rounded-lg mr-2 flex-1"
        >
          <Text className="text-white text-center">Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pickImage}
          className="bg-purple-600 p-3 rounded-lg flex-1"
        >
          <Text className="text-white text-center">Pick from Gallery</Text>
        </TouchableOpacity>
      </View>

      {photo && (
        <Image source={{ uri: photo }} className="w-full h-40 rounded-lg mb-4" />
      )}

      {/* Recent Meals */}
      <Text className="text-lg font-bold mt-6 mb-3">Recently Logged Meals</Text>
      {recentMeals.map((meal) => (
        <Animated.View
          key={meal.id}
          entering={SlideInUp.duration(400)}
          className={`border rounded-lg p-3 mb-3 flex-row items-center ${
            meal._pending ? "bg-gray-100" : "bg-white"
          }`}
        >
          {meal.photoURL ? (
            <Image
              source={{ uri: meal.photoURL }}
              className={`w-16 h-16 rounded-lg mr-3 ${
                meal._pending ? "opacity-50" : ""
              }`}
            />
          ) : (
            <View className="w-16 h-16 bg-gray-300 rounded-lg mr-3 items-center justify-center">
              <Text className="text-gray-600">🍽️</Text>
            </View>
          )}

          <View className="flex-1">
            <Text className={meal._pending ? "text-gray-400" : "font-bold"}>
              {meal.name} {meal._pending && "(Pending...)"}
            </Text>
            <Text className={meal._pending ? "text-gray-400" : "text-gray-500"}>
              {meal.type} • {meal.portion} • {meal.pieces} pcs
            </Text>
          </View>

          {meal._pending && (
            <Progress.Circle
              progress={meal._progress ?? 0}
              size={40}
              showsText
              color="#2563eb"
              thickness={5}
            />
          )}
        </Animated.View>
      ))}

      {/* Preview Modal */}
    <Modal visible={previewVisible} transparent animationType="slide">
  <View className="flex-1 bg-black/40 justify-center items-center">
    <View className="bg-white p-6 rounded-2xl w-11/12">

      {/* Show food photo if exists, otherwise a placeholder */}
      {photo ? (
        <Image
          source={{ uri: photo }}
          className="w-full h-40 rounded-lg mb-4"
        />
      ) : (
        <View className="w-full h-40 bg-gray-200 rounded-lg mb-4 items-center justify-center">
          <Text className="text-gray-500 text-lg">📷 No Photo</Text>
        </View>
      )}

      <Text className="text-lg font-bold mb-3">{previewMeal?.name}</Text>
      <Text>Calories: {previewMeal?.calories}</Text>
      <Text>Protein: {previewMeal?.protein}g</Text>
      <Text>Carbs: {previewMeal?.carbs}g</Text>
      <Text>Fat: {previewMeal?.fat}g</Text>

      <View className="flex-row mt-6">
        <TouchableOpacity
          onPress={() => setPreviewVisible(false)}
          className="flex-1 bg-gray-300 p-3 rounded-lg mr-2"
        >
          <Text className="text-center">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={confirmMeal}
          className="flex-1 bg-blue-600 p-3 rounded-lg"
        >
          <Text className="text-center text-white font-bold">Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


    </ScrollView>
  );
}
