// components/FoodModal.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  Modal, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView,
  Platform
} from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

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

export default function FoodModal({
  visible,
  mealLabel,
  foods,
  onClose,
  onAdd,
  onDelete,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Omit<Food, "id">>({
    name: "",
    grams: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const reset = () =>
    setForm({ name: "", grams: 0, calories: 0, protein: 0, carbs: 0, fat: 0 });

  const canSave = useMemo(
    () => form.name.trim().length > 0 && form.grams > 0 && form.calories >= 0,
    [form]
  );

  const RightAction = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      className="bg-red-500 items-center justify-center px-5"
      style={{ width: 88, height: "100%" }}
    >
      <Ionicons name="trash-outline" size={22} color="#fff" />
      <Text className="text-white text-xs mt-1">Delete</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 bg-white"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
            <Text className="text-lg font-semibold">Add {mealLabel}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* List */}
          <FlatList
            data={foods}
            keyExtractor={(f) => f.id}
            contentContainerClassName="px-5 pt-3 pb-28"
            renderItem={({ item }) => (
              <Swipeable
                overshootRight={false}
                renderRightActions={() => (
                  <RightAction onPress={() => onDelete(item.id)} />
                )}
              >
                <View className="bg-gray-50 rounded-xl px-4 py-3 mb-3 border border-gray-200">
                  <View className="flex-row justify-between">
                    <Text className="text-[15px] font-medium text-gray-800">{item.name}</Text>
                    <Text className="text-gray-500 text-xs">{item.calories} kcal · {item.grams} g</Text>
                  </View>
                  <View className="flex-row justify-between mt-1">
                    <Text className="text-xs text-blue-600">Protein {item.protein}g</Text>
                    <Text className="text-xs text-amber-600">Carbs {item.carbs}g</Text>
                    <Text className="text-xs text-red-600">Fat {item.fat}g</Text>
                  </View>
                </View>
              </Swipeable>
            )}
            ListEmptyComponent={
              <View className="items-center mt-8">
                <Text className="text-gray-400">No foods yet.</Text>
              </View>
            }
          />

          {/* Add Bar */}
          {adding ? (
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <View className="flex-row gap-2 mb-2">
                <TextInput
                  className="flex-1 bg-gray-50 rounded-xl px-3 py-3 border border-gray-200"
                  placeholder="Food name"
                  value={form.name}
                  onChangeText={(t) => setForm({ ...form, name: t })}
                />
                <TextInput
                  className="w-24 bg-gray-50 rounded-xl px-3 py-3 border border-gray-200"
                  placeholder="Grams"
                  keyboardType="numeric"
                  value={String(form.grams || "")}
                  onChangeText={(t) => setForm({ ...form, grams: Number(t) || 0 })}
                />
              </View>
              <View className="flex-row gap-2">
                <TextInput
                  className="flex-1 bg-gray-50 rounded-xl px-3 py-3 border border-gray-200"
                  placeholder="Calories"
                  keyboardType="numeric"
                  value={String(form.calories || "")}
                  onChangeText={(t) => setForm({ ...form, calories: Number(t) || 0 })}
                />
                <TextInput
                  className="w-24 bg-gray-50 rounded-xl px-3 py-3 border border-gray-200"
                  placeholder="P"
                  keyboardType="numeric"
                  value={String(form.protein || "")}
                  onChangeText={(t) => setForm({ ...form, protein: Number(t) || 0 })}
                />
                <TextInput
                  className="w-24 bg-gray-50 rounded-xl px-3 py-3 border border-gray-200"
                  placeholder="C"
                  keyboardType="numeric"
                  value={String(form.carbs || "")}
                  onChangeText={(t) => setForm({ ...form, carbs: Number(t) || 0 })}
                />
                <TextInput
                  className="w-24 bg-gray-50 rounded-xl px-3 py-3 border border-gray-200"
                  placeholder="F"
                  keyboardType="numeric"
                  value={String(form.fat || "")}
                  onChangeText={(t) => setForm({ ...form, fat: Number(t) || 0 })}
                />
              </View>

              <View className="flex-row justify-end gap-3 mt-3">
                <TouchableOpacity
                  onPress={() => { setAdding(false); reset(); }}
                  className="px-4 py-3 rounded-xl border border-gray-300"
                >
                  <Text className="text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!canSave}
                  onPress={() => { onAdd(form); setAdding(false); reset(); }}
                  className={`px-4 py-3 rounded-xl ${canSave ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <Text className="text-white font-semibold">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <TouchableOpacity
                onPress={() => setAdding(true)}
                className="bg-green-500 rounded-2xl py-4 items-center"
              >
                <Text className="text-white font-semibold">+ Add food</Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
}
