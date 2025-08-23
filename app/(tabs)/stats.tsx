// app/(tabs)/stats.tsx

import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// BMI Condition Line (Scrollable, colored by condition)
function BMIConditionLine({ bmi }: { bmi: number }) {
  const bmiCategory = getBMICategory(bmi);
  const color = bmiCategory in healthColors
    ? healthColors[bmiCategory as keyof typeof healthColors]
    : "#888";
  const label = getBMICategoryLabel(bmi);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
      <View
        style={{
          height: 32,
          minWidth: 180,
          backgroundColor: color,
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          {label} ({isNaN(bmi) ? "NaN" : bmi.toFixed(1)})
        </Text>
      </View>
    </ScrollView>
  );
}

export default function Stats() {
  // For demo, use the same BMI calculation as WeightGoalOverview
  const [currentWeight, setCurrentWeight] = useState("69.5");
  const [height, setHeight] = useState("1.75");
  const bmi =
    parseFloat(currentWeight) && parseFloat(height)
      ? parseFloat(currentWeight) / (parseFloat(height) * parseFloat(height))
      : NaN;

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="w-full flex-1 px-2 py-2">
      <SafeAreaView>
        <WeightGoalOverview />
        <BMIConditionLine bmi={bmi} />
        <AnalyticsOverview />
        <View className="flex-1 justify-center items-center bg-white mb-6 mt-2 py-6 rounded-2xl">
          <Text className="text-xl font-semibold text-gray-800">Stats</Text>
          <Text className="text-gray-500 mt-2">See calories, protein, and progress you made📊</Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const screenWidth = Dimensions.get("window").width;

const healthColors = {
  underweight: "#4F8EF7",
  healthy: "#43A047",
  overweight: "#FFA726",
  obese: "#E53935",
};

function getBMICategory(bmi: number) {
  if (isNaN(bmi)) return "unknown";
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "healthy";
  if (bmi < 30) return "overweight";
  return "obese";
}

function getBMICategoryLabel(bmi: number) {
  if (isNaN(bmi)) return "Unknown";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

// Dummy data for demonstration
const weightData = [70, 71, 70.5, 69.8, 70.2, 69.5, 69.0];
const nutritionData = [1800, 2000, 1900, 2100, 1950, 2050, 2000];

const analyticsRanges = [
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "6 Months", value: "6m" },
  { label: "1 Year", value: "1y" },
  { label: "All Time", value: "all" },
];



export function WeightGoalOverview() {
  const [goal, setGoal] = useState("70");
  const [currentWeight, setCurrentWeight] = useState("69.5");
  const [height, setHeight] = useState("1.75"); // meters
  const bmi =
    parseFloat(currentWeight) && parseFloat(height)
      ? parseFloat(currentWeight) / (parseFloat(height) * parseFloat(height))
      : NaN;
  const bmiCategory = getBMICategory(bmi);

   const updateCurrentWeight = () => {
    return(
       <TextInput
          value={currentWeight}
          onChangeText={setCurrentWeight}
          keyboardType="numeric"
          style={{ width: 60 }}
          className="text-xl font-extrabold"
        />

    );
 }

  return (
    <SafeAreaView>
    <View className="w-full px-4 py-4 bg-gray-50 rounded-lg mb-4">
      <Text className="text-3xl text-center p-4 text-gray-700 font-bold mb-2">Weight Goal Overview</Text>
      <View className="flex justify-between  mb-2">
        <View className="mb-4">
        <Text className="mr-2 mb-2 text-2xl font-semibold text-gray-700">Weight Goal</Text>
        <View className="flex-row gap-2 items-center">
        <Text className="text-3xl font-extrabold">{goal} Kg</Text>
        <TextInput
          onChangeText={setGoal}
          placeholder="update here"
          keyboardType="numeric"
          style={{ width: 120, marginRight: 16 }}
          className="text-sm text-gray-100 border border-gray-100 rounded-lg"
        />
        </View>
        </View>
        <View>
        <Text className="mr-2 text-2xl text-gray-700">Current Weight</Text>
        <View className="flex-1 py-2">
          <View className="border border-gray-200 rounded-2xl">
            <View className="p-3">
          <Text className="text-3xl mb-3 font-extrabold text-gray-700">{currentWeight} Kg</Text>
          <Text className="text-gray-500 ">Try to update once a week so we can adjust your plan to ensure you hit your goal</Text>
          </View>
            <Pressable onPress={updateCurrentWeight} className="mt-1 items-center w-full px-5 pt-2 pb-4 bg-black rounded-b-2xl shadow">
            <Text className="text-white font-semibold text-lg">Log weight</Text>
            </Pressable>
            </View>

        </View>
        </View>
      </View>
      <View className="flex-row items-center mb-2">
        <Text className="mr-2 text-2xl font-semibold text-gray-700">Height (m)</Text>
        <TextInput
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          style={{ width: 60 }}
          className="text-3xl font-extrabold"
        />
      </View>
      <Text className="mr-2 text-md font-semibold text-gray-700">
        Your BMI   {isNaN(bmi) ? "NaN" : bmi.toFixed(1)} ({getBMICategoryLabel(bmi)})
      </Text>
      <BarChart
          data={{
            labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
            datasets: [
              {
                data: weightData,
                color: () => bmiCategory in healthColors
                  ? healthColors[bmiCategory as keyof typeof healthColors]
                  : "#888",
              },
            ],
          }}
          width={screenWidth - 32}
          height={180}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 1,
            strokeWidth: 1,
            color: () => bmiCategory in healthColors
              ? healthColors[bmiCategory as keyof typeof healthColors]
              : "#888",
            labelColor: () => "#888",
          }}

          withInnerLines={false}
          style={{ borderRadius: 12, marginVertical: 8 }} yAxisLabel={""} yAxisSuffix={""}      />
      <Text className="text-xs text-gray-500">
         Color indicates health status: 
      </Text>
        <View className="flex-row justify-between w-full mt-2">
          <View className="flex-row items-center gap-1">
            <View className="bg-blue-600 w-2 h-2 rounded-[50%]" />
            <Text> Underweight </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <View className="bg-green-600 w-2 h-2 rounded-[50%]" />
            <Text>Healthy</Text>
          </View>

          <View className="flex-row items-center gap-1">
            <View className="bg-orange-400 w-2 h-2 rounded-[50%]" />
            <Text>Overweight</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="bg-red-600 w-2 h-2 rounded-[50%]" />
            <Text>Obese</Text>
          </View>
        </View>
       
    </View>
    </SafeAreaView>
  );
}

export function AnalyticsOverview() {
  const [range, setRange] = useState("30d");

  // Replace with Firebase data fetching logic
  const getAnalyticsData = (type: "weight" | "nutrition", range: string) => {
    // For demo, return dummy data
    if (type === "weight") return weightData;
    return nutritionData;
  };

  return (
    <View className="w-full px-4 py-4 bg-gray-50 rounded-lg mb-4">
      <Text className="text-xl text-gray-700 py-4 font-bold mb-2">Analytics Overview</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {analyticsRanges.map((r) => (
          <TouchableOpacity
            key={r.value}
            onPress={() => setRange(r.value)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              backgroundColor: range === r.value ? "#43A047" : "#eee",
              borderRadius: 16,
              marginRight: 8,
            }}
          >
            <Text style={{ color: range === r.value ? "#fff" : "#333" }}>{r.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text className="font-semibold text-gray-700 mb-1">Weight Progress</Text>
      <LineChart
        data={{
          labels: ["1", "2", "3", "4", "5", "6", "7"],
          datasets: [
            {
              data: getAnalyticsData("weight", range),
              color: () => "#43A047",
            },
          ],
          legend: ["Weight Goal"],
        }}
        width={screenWidth - 32}
        height={160}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 1,
          strokeWidth: 1,
          color: () => "#43A047",
          labelColor: () => "#888888ff",
          
        }}
        bezier
        withInnerLines={false}

        style={{ borderRadius: 12, marginVertical: 8 }}
      />
      <Text className="font-semibold my-5 mb-4">Nutrition Progress</Text>
      <BarChart
        data={{
          labels: ["1", "2", "3", "4", "5", "6", "7"],
          datasets: [
            {
              data: getAnalyticsData("nutrition", range),
              color: () => "#FFA726",
            },
          ],
        }}
        width={screenWidth - 32}
        height={160}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          strokeWidth: 1,
          color: () => "#FFA726",
          labelColor: () => "#888",
        }}

        withInnerLines={false}
        style={{ borderRadius: 12, marginVertical: 8 }} yAxisLabel={""} yAxisSuffix={""}      />
    </View>
  );
}

// Usage in main component
export function StatsScreenContent() {
  return (
    <ScrollView className="w-full flex-1 px-2 py-2">
      <WeightGoalOverview />
      <AnalyticsOverview />
    </ScrollView>
  );
}