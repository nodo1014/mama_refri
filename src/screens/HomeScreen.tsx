import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { Food } from "../types";
import MamaSpeechBubble from "../components/MamaSpeechBubble";
import UrgentFoodList from "../components/UrgentFoodList";
import RecipeRecommendation from "../components/RecipeRecommendation";
import AllFoodList from "../components/AllFoodList";
import AddFoodButton from "../components/AddFoodButton";
import * as Storage from "../utils/storage";
import { loadSampleData } from "../utils/sampleData";

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  // 설정 화면으로 이동
  const goToSettings = () => {
    navigation.navigate("Settings");
  };

  // React.useLayoutEffect를 사용하여 네비게이션 헤더에 설정 버튼 추가
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={goToSettings} style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Load foods from storage on mount
  useEffect(() => {
    loadFoods();

    // Also reload when the screen is focused (coming back from Add screen)
    const unsubscribe = navigation.addListener("focus", () => {
      loadFoods();
    });

    return unsubscribe;
  }, [navigation]);

  const loadFoods = async () => {
    setLoading(true);
    const loadedFoods = await Storage.loadFoods();
    setFoods(loadedFoods);
    setLoading(false);
  };

  // Load sample data (for testing purposes)
  const handleLoadSampleData = async () => {
    await loadSampleData();
    await loadFoods();
  };

  // Get a smart message based on the current food situation
  const getSmartMessage = (): string => {
    if (foods.length === 0) {
      return "안녕하세요! 냉장고에 재료를 추가해볼까요?";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiringToday = foods.filter((food) => {
      const expirationDate = new Date(food.expirationDate);
      expirationDate.setHours(0, 0, 0, 0);
      return expirationDate.getTime() === today.getTime();
    });

    if (expiringToday.length > 0) {
      const names = expiringToday.map((food) => food.name).join(", ");
      return `오늘까지 ${names}을(를) 사용해야 해요!`;
    }

    const expiringThreeDays = foods.filter((food) => {
      const expirationDate = new Date(food.expirationDate);
      expirationDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays > 0 && diffDays <= 3;
    });

    if (expiringThreeDays.length > 0) {
      return "유통기한이 임박한 식재료가 있어요! 확인해볼까요?";
    }

    return "오늘은 냉장고가 잘 정리되어 있네요! 새로운 요리를 시도해볼까요?";
  };

  const handleAddFood = () => {
    navigation.navigate("Add");
  };

  const handleFoodPress = (food: Food) => {
    // We'll implement this later - it would open a detail/edit screen
    // For now, just log the food
    console.log("Selected food:", food);
  };

  const handleRequestRecipe = (ingredientFoods: Food[]) => {
    // Navigate to recipe screen with foods as parameter
    navigation.navigate("Recipe", { foods: ingredientFoods });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <MamaSpeechBubble message={getSmartMessage()} />

        {foods.length === 0 && (
          <TouchableOpacity
            style={styles.sampleDataButton}
            onPress={handleLoadSampleData}
          >
            <Text style={styles.sampleDataButtonText}>
              샘플 데이터 불러오기 (테스트용)
            </Text>
          </TouchableOpacity>
        )}

        <UrgentFoodList foods={foods} onFoodPress={handleFoodPress} />
        <RecipeRecommendation
          foods={foods}
          onRequestRecipe={handleRequestRecipe}
        />
        <AllFoodList foods={foods} onFoodPress={handleFoodPress} />
        <View style={styles.spacer} />
      </ScrollView>
      <AddFoodButton onPress={handleAddFood} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  spacer: {
    height: 80, // Space for the floating button
  },
  sampleDataButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
  },
  sampleDataButtonText: {
    color: "#666",
  },
  settingsButton: {
    padding: 8,
    marginRight: 8,
  },
  settingsButtonText: {
    fontSize: 22,
  },
});

export default HomeScreen;
