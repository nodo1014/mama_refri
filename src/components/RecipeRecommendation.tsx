import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Food } from "../types";

interface RecipeRecommendationProps {
  foods: Food[];
  onRequestRecipe: (ingredientFoods: Food[]) => void;
}

const RecipeRecommendation: React.FC<RecipeRecommendationProps> = ({
  foods,
  onRequestRecipe,
}) => {
  // 식재료가 없는 경우 표시하지 않음
  if (foods.length === 0) {
    return null;
  }

  // 최대 3개의 무작위 식재료 표시
  const foodSample = foods
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((food) => food.name);

  // 추천 재료 선택 (최대 5개)
  const getRecommendedIngredients = (): Food[] => {
    // 유통기한이 가까운 순서로 정렬
    const sortedFoods = [...foods].sort((a, b) => {
      const dateA = new Date(a.expirationDate).getTime();
      const dateB = new Date(b.expirationDate).getTime();
      return dateA - dateB;
    });

    // 최대 5개까지 선택
    return sortedFoods.slice(0, 5);
  };

  // 레시피 요청 핸들러
  const handleRequestRecipe = () => {
    const recommendedIngredients = getRecommendedIngredients();
    onRequestRecipe(recommendedIngredients);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 추천 레시피</Text>
      <View style={styles.card}>
        <Text style={styles.suggestion}>
          {foodSample.join(", ")}이(가) 있네요! {"\n"}
          어떤 요리를 해볼까요?
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleRequestRecipe}>
          <Text style={styles.buttonText}>추천 레시피 보기</Text>
        </TouchableOpacity>
      </View>
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
  card: {
    backgroundColor: "#e6f2ff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
  },
  suggestion: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#4f9cf9",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default RecipeRecommendation;
