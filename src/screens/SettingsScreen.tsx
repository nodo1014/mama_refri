import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
  SafeAreaView,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hasApiKey, setDeepSeekApiKey } from "../utils/recipeUtils";
import { requestNotificationPermission } from "../utils/notifications";

// AsyncStorage 키
const API_KEY_STORAGE_KEY = "@mama_refri:deepseek_api_key";
const NOTIFICATIONS_ENABLED_KEY = "@mama_refri:notifications_enabled";

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [apiKey, setApiKey] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hasSetApiKey, setHasSetApiKey] = useState(false);
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  // 설정 로드
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // API 키 로드
      const savedApiKey = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
      if (savedApiKey) {
        setApiKey(savedApiKey);
        setDeepSeekApiKey(savedApiKey);
        setHasSetApiKey(true);
      }

      // 알림 설정 로드
      const notificationsEnabledStr = await AsyncStorage.getItem(
        NOTIFICATIONS_ENABLED_KEY
      );
      setNotificationsEnabled(notificationsEnabledStr === "true");
    } catch (error) {
      console.error("설정 로드 오류:", error);
    }
  };

  // API 키 저장
  const saveApiKey = async () => {
    try {
      if (apiKey.trim()) {
        await AsyncStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
        setDeepSeekApiKey(apiKey);
        setHasSetApiKey(true);
        Alert.alert("성공", "DeepSeek API 키가 저장되었습니다.");
      } else {
        Alert.alert("오류", "API 키를 입력해주세요.");
      }
    } catch (error) {
      console.error("API 키 저장 오류:", error);
      Alert.alert("오류", "API 키 저장 중 문제가 발생했습니다.");
    }
  };

  // API 키 제거
  const removeApiKey = async () => {
    try {
      await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
      setApiKey("");
      setDeepSeekApiKey("");
      setHasSetApiKey(false);
      Alert.alert("성공", "DeepSeek API 키가 제거되었습니다.");
    } catch (error) {
      console.error("API 키 제거 오류:", error);
      Alert.alert("오류", "API 키 제거 중 문제가 발생했습니다.");
    }
  };

  // 알림 설정 토글
  const toggleNotifications = async (value: boolean) => {
    try {
      if (value) {
        const isGranted = await requestNotificationPermission();
        if (!isGranted) {
          Alert.alert(
            "알림 권한 필요",
            "알림을 받으려면 설정에서 알림 권한을 허용해주세요.",
            [
              { text: "취소", style: "cancel" },
              { text: "설정으로 이동", onPress: () => Linking.openSettings() },
            ]
          );
          return;
        }
      }

      setNotificationsEnabled(value);
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(value));
    } catch (error) {
      console.error("알림 설정 오류:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>설정</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DeepSeek API 설정</Text>
          <Text style={styles.description}>
            AI 레시피 추천을 위한 DeepSeek API 키를 설정하세요. 키가 없으면 기본
            레시피만 제공됩니다.
          </Text>

          <View style={styles.apiKeyContainer}>
            <TextInput
              style={styles.input}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="DeepSeek API 키 입력"
              secureTextEntry={!isApiKeyVisible}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.visibilityButton}
              onPress={() => setIsApiKeyVisible(!isApiKeyVisible)}
            >
              <Text>{isApiKeyVisible ? "숨기기" : "보기"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={saveApiKey}
            >
              <Text style={styles.buttonText}>저장</Text>
            </TouchableOpacity>

            {hasSetApiKey && (
              <TouchableOpacity
                style={[styles.button, styles.removeButton]}
                onPress={removeApiKey}
              >
                <Text style={styles.buttonText}>제거</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.statusText}>
            상태: {hasApiKey() ? "API 키 설정됨" : "API 키 없음"}
          </Text>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL("https://platform.deepseek.com")}
          >
            <Text style={styles.linkButtonText}>DeepSeek API 키 발급받기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>유통기한 임박 알림</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: "#767577", true: "#a880ff" }}
              thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>
          <Text style={styles.description}>
            {notificationsEnabled
              ? "유통기한이 임박한 식재료에 대한 알림을 받습니다."
              : "알림이 비활성화되어 있습니다."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 정보</Text>
          <Text style={styles.description}>
            마마냉장고 버전 1.0.0{"\n"}© 2023 마마냉장고 팀{"\n"}
            문의: mama.refri@example.com
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  apiKeyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  visibilityButton: {
    padding: 8,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#a880ff",
    marginRight: 8,
  },
  removeButton: {
    backgroundColor: "#ff6b6b",
    marginLeft: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  statusText: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 16,
  },
  linkButton: {
    padding: 8,
  },
  linkButtonText: {
    color: "#4f9cf9",
    textDecorationLine: "underline",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  footer: {
    marginTop: 24,
    marginBottom: 24,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#333",
  },
});

export default SettingsScreen;
