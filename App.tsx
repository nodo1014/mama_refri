import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity, Text } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import AddScreen from "./src/screens/AddScreen";
import RecipeScreen from "./src/screens/RecipeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { setDeepSeekApiKey } from "./src/utils/recipeUtils";
import { setupNotificationHandler } from "./src/utils/notifications";

const Stack = createNativeStackNavigator();
const API_KEY_STORAGE_KEY = "@mama_refri:deepseek_api_key";

export default function App() {
  // 앱 시작 시 설정 로드
  useEffect(() => {
    // API 키 로드
    const loadApiKey = async () => {
      try {
        const apiKey = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
        if (apiKey) {
          setDeepSeekApiKey(apiKey);
        }
      } catch (error) {
        console.error("API 키 로드 오류:", error);
      }
    };

    // 알림 핸들러 설정
    setupNotificationHandler();

    // 설정 로드 실행
    loadApiKey();
  }, []);

  // 홈으로 이동하는 헤더 타이틀 컴포넌트
  const HeaderTitle = ({
    navigation,
    title,
  }: {
    navigation: any;
    title: string;
  }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: "#a880ff",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          // 커스텀 헤더 타이틀 적용 (클릭 시 홈으로 이동)
          headerTitle: (props) => (
            <HeaderTitle navigation={navigation} title="마마냉장고" />
          ),
        })}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Add"
          component={AddScreen}
          options={{
            title: "식재료 추가",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="Recipe"
          component={RecipeScreen}
          options={{
            title: "추천 레시피",
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: "설정",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
