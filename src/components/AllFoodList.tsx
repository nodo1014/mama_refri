import React from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
import FoodItem from "./FoodItem";
import { Food } from "../types";

interface AllFoodListProps {
  foods: Food[];
  onFoodPress?: (food: Food) => void;
}

const AllFoodList: React.FC<AllFoodListProps> = ({ foods, onFoodPress }) => {
  // Group foods by storage location
  const refrigeratorFoods = foods.filter(
    (food) => food.storageLocation === "refrigerator"
  );
  const freezerFoods = foods.filter(
    (food) => food.storageLocation === "freezer"
  );
  const otherFoods = foods.filter((food) => food.storageLocation === "other");

  const sections = [
    { title: "냉장", data: refrigeratorFoods },
    { title: "냉동", data: freezerFoods },
    { title: "기타", data: otherFoods },
  ].filter((section) => section.data.length > 0);

  if (foods.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>전체 냉장고 목록</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>등록된 식재료가 없습니다 🐰</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>전체 냉장고 목록</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FoodItem
            food={item}
            onPress={() => onFoodPress && onFoodPress(item)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        scrollEnabled={false}
        stickySectionHeadersEnabled={false}
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
  sectionHeader: {
    backgroundColor: "#f5f5f5",
    padding: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: "600",
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

export default AllFoodList;
