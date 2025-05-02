import AsyncStorage from "@react-native-async-storage/async-storage";
import { Food } from "../types";

// Key for storing the food items
const FOOD_STORAGE_KEY = "@mama_refri:foods";

// Save foods to AsyncStorage
export const saveFoods = async (foods: Food[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(foods);
    await AsyncStorage.setItem(FOOD_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error("Error saving foods", e);
  }
};

// Load foods from AsyncStorage
export const loadFoods = async (): Promise<Food[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FOOD_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error loading foods", e);
    return [];
  }
};

// Add a new food item to storage
export const addFood = async (food: Food): Promise<void> => {
  try {
    const foods = await loadFoods();
    foods.push(food);
    await saveFoods(foods);
  } catch (e) {
    console.error("Error adding food", e);
  }
};

// Update an existing food item
export const updateFood = async (updatedFood: Food): Promise<void> => {
  try {
    const foods = await loadFoods();
    const index = foods.findIndex((food) => food.id === updatedFood.id);

    if (index !== -1) {
      foods[index] = updatedFood;
      await saveFoods(foods);
    }
  } catch (e) {
    console.error("Error updating food", e);
  }
};

// Delete a food item
export const deleteFood = async (foodId: string): Promise<void> => {
  try {
    const foods = await loadFoods();
    const filteredFoods = foods.filter((food) => food.id !== foodId);
    await saveFoods(filteredFoods);
  } catch (e) {
    console.error("Error deleting food", e);
  }
};
