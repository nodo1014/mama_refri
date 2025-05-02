import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { Food } from "../types";
import RecipeCard from "../components/RecipeCard";
import { requestRecipe } from "../utils/recipeUtils";
import { RecipeResponse } from "../utils/deepseekAPI";

// 추천 레시피 테마 정의
const RECIPE_THEMES = ["아이 반찬", "아침식사", "해장", "다이어트"];

interface RecipeScreenProps {
  route: {
    params: {
      foods: Food[];
    };
  };
  navigation: any;
}

// 레시피 유튜브 링크 목록 (음식명에 따라 다른 링크 반환)
const getYoutubeLinks = (foods: Food[], recipe: RecipeResponse | null) => {
  // 레시피 제목이나 식재료 이름에 따라 적절한 유튜브 링크 선택
  const foodNames = foods.map((f) => f.name).join(" ");
  const recipeName = recipe?.title || "";

  if (recipeName.includes("김치") || foodNames.includes("김치")) {
    return [
      {
        title: "백종원의 초간단 김치요리 레시피",
        url: "https://www.youtube.com/watch?v=t4Es8Yfgy5s",
      },
      {
        title: "간단하고 맛있는 김치볶음밥 만들기",
        url: "https://www.youtube.com/watch?v=eIo2BkFOjvQ",
      },
      {
        title: "김치로 만드는 찌개 레시피",
        url: "https://www.youtube.com/watch?v=tstKz1oXAMg",
      },
    ];
  } else if (recipeName.includes("두부") || foodNames.includes("두부")) {
    return [
      {
        title: "매콤한 두부조림 황금레시피",
        url: "https://www.youtube.com/watch?v=o1W3cz_M5Ho",
      },
      {
        title: "초간단 두부요리 모음",
        url: "https://www.youtube.com/watch?v=pdgKGjWsX30",
      },
      {
        title: "건강한 두부 샐러드 만들기",
        url: "https://www.youtube.com/watch?v=KqQNMlCDSvk",
      },
    ];
  } else if (
    recipeName.includes("달걀") ||
    foodNames.includes("달걀") ||
    foodNames.includes("계란")
  ) {
    return [
      {
        title: "대세 계란 요리 모음 레시피",
        url: "https://www.youtube.com/watch?v=5jW-g_bbr2Y",
      },
      {
        title: "10분 완성 계란말이 만들기",
        url: "https://www.youtube.com/watch?v=bLQOea-Fs4Q",
      },
      {
        title: "초간단 계란찜 레시피",
        url: "https://www.youtube.com/watch?v=DQacCB9tDaw",
      },
    ];
  } else {
    // 기본 레시피 동영상
    return [
      {
        title: "냉장고 재료로 만드는 간단 요리",
        url: "https://www.youtube.com/watch?v=k5QxHJUbLvE",
      },
      {
        title: "15분 완성 초간단 요리 모음",
        url: "https://www.youtube.com/watch?v=YWMygmDfUWE",
      },
      {
        title: "남은 재료 활용 레시피",
        url: "https://www.youtube.com/watch?v=tstKz1oXAMg",
      },
    ];
  }
};

const RecipeScreen: React.FC<RecipeScreenProps> = ({ route, navigation }) => {
  const { foods } = route.params;
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);

  // 화면이 처음 로드될 때 레시피 요청
  useEffect(() => {
    fetchRecipe();
  }, [selectedTheme]);

  // 레시피 요청 함수
  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setError(null);

      if (foods.length === 0) {
        setError("선택된 식재료가 없습니다.");
        setLoading(false);
        return;
      }

      const recipeData = await requestRecipe(foods, selectedTheme);
      setRecipe(recipeData);
    } catch (err) {
      console.error("레시피 불러오기 오류:", err);
      setError("레시피를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 테마 선택 처리
  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
  };

  // 다시 시도 처리
  const handleRetry = () => {
    fetchRecipe();
  };

  // 유튜브 링크 열기
  const openYoutubeLink = (url: string) => {
    // 유튜브 URL이 유효한지 확인
    const checkVideoAvailability = async (youtubeUrl: string) => {
      try {
        // 유튜브 oembed API를 사용하여 비디오가 존재하는지 확인
        const videoId = youtubeUrl.match(
          /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        )?.[1];

        if (!videoId) {
          console.error("유효하지 않은 YouTube URL 형식:", youtubeUrl);
          return false;
        }

        // 직접 썸네일 URL을 사용하여 비디오가 존재하는지 확인
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        return thumbnailUrl;
      } catch (err) {
        console.error("비디오 유효성 확인 중 오류:", err);
        return false;
      }
    };

    checkVideoAvailability(url).then((result) => {
      if (result) {
        Linking.openURL(url).catch((err) => {
          console.error("유튜브 링크를 열 수 없습니다:", err);
          Alert.alert(
            "링크 오류",
            "유튜브 링크를 열 수 없습니다. 네트워크 연결을 확인하거나 나중에 다시 시도해주세요."
          );
        });
      } else {
        Alert.alert(
          "동영상 사용 불가",
          "해당 YouTube 동영상을 재생할 수 없습니다. 다른 동영상을 선택해주세요."
        );
      }
    });
  };

  // 테마 선택 버튼 렌더링
  const renderThemeButtons = () => {
    return (
      <View style={styles.themeContainer}>
        <Text style={styles.themeTitle}>다양한 테마로 추천받기</Text>
        <View style={styles.themeButtonsRow}>
          {RECIPE_THEMES.map((theme) => (
            <TouchableOpacity
              key={theme}
              style={[
                styles.themeButton,
                selectedTheme === theme && styles.selectedThemeButton,
              ]}
              onPress={() => handleThemeSelect(theme)}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  selectedTheme === theme && styles.selectedThemeButtonText,
                ]}
              >
                {theme}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // 유튜브 링크 버튼 렌더링
  const renderYoutubeLinks = () => {
    if (loading || error || !recipe) return null;

    const youtubeLinks = getYoutubeLinks(foods, recipe);

    return (
      <View style={styles.youtubeContainer}>
        <Text style={styles.youtubeTitle}>관련 요리 동영상</Text>
        {youtubeLinks.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.youtubeButton}
            onPress={() => openYoutubeLink(link.url)}
          >
            <Text style={styles.youtubeButtonText}>🎦 {link.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {renderThemeButtons()}

        <View style={styles.container}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#a880ff" />
              <Text style={styles.loadingText}>
                레시피를 준비하고 있어요...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetry}
              >
                <Text style={styles.retryButtonText}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {recipe && <RecipeCard recipe={recipe} />}
              {renderYoutubeLinks()}
            </>
          )}
        </View>
      </ScrollView>
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
  loadingContainer: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#a880ff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  themeContainer: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  themeButtonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  themeButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  selectedThemeButton: {
    backgroundColor: "#a880ff",
  },
  themeButtonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedThemeButtonText: {
    color: "#fff",
  },
  youtubeContainer: {
    padding: 16,
    marginBottom: 24,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    margin: 16,
  },
  youtubeTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  youtubeButton: {
    backgroundColor: "#ff0000",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  youtubeButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default RecipeScreen;
