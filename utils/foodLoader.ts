// app/utils/foodLoader.ts
import foodDB from "../data/foodDB.json";

export type Portion = "small" | "medium" | "large";

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Food {
  id: string;
  name: string;
  category: string;
  nutrition: Record<Portion, Nutrition>;
}

// 🔹 Search function
export const searchFood = (query: string): Food[] => {
  if (!query) return [];
  return foodDB.filter((food: Food) =>
    food.name.toLowerCase().includes(query.toLowerCase())
  );
};

// 🔹 Get nutrition for portion
export const getNutrition = (food: Food, portion: Portion): Nutrition => {
  return food.nutrition[portion];
};
