import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import FoodItem from "./FoodItem";
import { Food } from "../types";

interface UrgentFoodListProps {
  foods: Food[];
  onFoodPress?: (food: Food) => void;
}

const UrgentFoodList: React.FC<UrgentFoodListProps> = ({
  foods,
  onFoodPress,
}) => {
  // Filter foods that are expiring soon (3 days or less)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const urgentFoods = foods
    .filter((food) => {
      const expirationDate = new Date(food.expirationDate);
      expirationDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays <= 3;
    })
    .sort((a, b) => {
      return (
        new Date(a.expirationDate).getTime() -
        new Date(b.expirationDate).getTime()
      );
    });

  if (urgentFoods.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>유통기한 임박 식재료</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            유통기한이 임박한 식재료가 없습니다 🐰
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>유통기한 임박 식재료</Text>
      <FlatList
        data={urgentFoods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FoodItem
            food={item}
            onPress={() => onFoodPress && onFoodPress(item)}
          />
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 16,
  },
  emptyText: {
    color: "#666",
  },
});

export default UrgentFoodList;
