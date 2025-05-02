import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Food, StorageLocation } from "../types";
import * as Storage from "../utils/storage";

interface AddScreenProps {
  navigation: any;
}

const AddScreen: React.FC<AddScreenProps> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [storageLocation, setStorageLocation] =
    useState<StorageLocation>("refrigerator");

  const isValidExpirationDate = (dateString: string): boolean => {
    // Simple format check (MM/DD or YYYY-MM-DD)
    const isValidFormat =
      /^\d{1,2}\/\d{1,2}$/.test(dateString) ||
      /^\d{4}-\d{1,2}-\d{1,2}$/.test(dateString);

    if (!isValidFormat) return false;

    // Parse date
    let date;
    if (dateString.includes("/")) {
      const [month, day] = dateString.split("/").map(Number);
      const year = new Date().getFullYear();
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateString);
    }

    return !isNaN(date.getTime());
  };

  const formatDate = (dateString: string): string => {
    if (dateString.includes("/")) {
      const [month, day] = dateString.split("/").map(Number);
      const year = new Date().getFullYear();
      return `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    }
    return dateString;
  };

  const handleAddFood = async () => {
    // Validate input
    if (name.trim() === "") {
      Alert.alert("알림", "식재료 이름을 입력해주세요.");
      return;
    }

    if (!expirationDate.trim() || !isValidExpirationDate(expirationDate)) {
      Alert.alert(
        "알림",
        "유효한 유통기한을 입력해주세요. (MM/DD 또는 YYYY-MM-DD)"
      );
      return;
    }

    // Create new food object
    const newFood: Food = {
      id: Date.now().toString(),
      name: name.trim(),
      expirationDate: formatDate(expirationDate),
      storageLocation,
      createdAt: new Date().toISOString(),
    };

    // Save to storage
    await Storage.addFood(newFood);

    // Go back to home screen
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>식재료 추가하기</Text>
          <Text style={styles.subtitle}>
            🐰 냉장고에 넣을 재료를 알려주세요!
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>식재료 이름</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="예: 우유, 달걀, 김치"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>유통기한</Text>
          <TextInput
            style={styles.input}
            value={expirationDate}
            onChangeText={setExpirationDate}
            placeholder="MM/DD 또는 YYYY-MM-DD"
            keyboardType={
              Platform.OS === "ios" ? "numbers-and-punctuation" : "default"
            }
          />
          <Text style={styles.helpText}>예: 12/31 또는 2023-12-31</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>보관 위치</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                storageLocation === "refrigerator" &&
                  styles.radioButtonSelected,
              ]}
              onPress={() => setStorageLocation("refrigerator")}
            >
              <Text
                style={[
                  styles.radioButtonText,
                  storageLocation === "refrigerator" &&
                    styles.radioButtonTextSelected,
                ]}
              >
                냉장
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioButton,
                storageLocation === "freezer" && styles.radioButtonSelected,
              ]}
              onPress={() => setStorageLocation("freezer")}
            >
              <Text
                style={[
                  styles.radioButtonText,
                  storageLocation === "freezer" &&
                    styles.radioButtonTextSelected,
                ]}
              >
                냉동
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioButton,
                storageLocation === "other" && styles.radioButtonSelected,
              ]}
              onPress={() => setStorageLocation("other")}
            >
              <Text
                style={[
                  styles.radioButtonText,
                  storageLocation === "other" && styles.radioButtonTextSelected,
                ]}
              >
                기타
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
          <Text style={styles.addButtonText}>추가하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  helpText: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  radioGroup: {
    flexDirection: "row",
    marginTop: 8,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 12,
  },
  radioButtonSelected: {
    backgroundColor: "#a880ff",
    borderColor: "#a880ff",
  },
  radioButtonText: {
    fontSize: 16,
    color: "#333",
  },
  radioButtonTextSelected: {
    color: "white",
  },
  addButton: {
    backgroundColor: "#a880ff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
  },
});

export default AddScreen;
