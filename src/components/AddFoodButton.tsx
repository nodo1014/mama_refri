import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface AddFoodButtonProps {
  onPress: () => void;
}

const AddFoodButton: React.FC<AddFoodButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>+ 음식 추가하기</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#a880ff", // 보라색 (고델 캐릭터 톤)
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddFoodButton;
