import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Food } from "../types";

interface FoodItemProps {
  food: Food;
  onPress?: () => void;
}

const FoodItem: React.FC<FoodItemProps> = ({ food, onPress }) => {
  // Calculate days until expiration
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expirationDate = new Date(food.expirationDate);
  expirationDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Determine color based on expiration status
  let statusColor = "#4CAF50"; // Green (normal)
  let statusEmoji = "🟢";

  if (diffDays <= 0) {
    statusColor = "#F44336"; // Red (today/expired)
    statusEmoji = "🔴";
  } else if (diffDays <= 3) {
    statusColor = "#FFC107"; // Yellow (within 3 days)
    statusEmoji = "🟡";
  }

  // Format expiration date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View
          style={[styles.statusIndicator, { backgroundColor: statusColor }]}
        />
        <View style={styles.content}>
          <Text style={styles.name}>{food.name}</Text>
          <View style={styles.details}>
            <Text style={styles.location}>
              {food.storageLocation === "refrigerator"
                ? "냉장"
                : food.storageLocation === "freezer"
                ? "냉동"
                : "기타"}
            </Text>
            <Text style={styles.date}>
              {statusEmoji} {formatDate(food.expirationDate)}
              {diffDays <= 0
                ? " (오늘까지)"
                : diffDays === 1
                ? " (내일까지)"
                : diffDays <= 3
                ? ` (${diffDays}일 후)`
                : ""}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
    backgroundColor: "white",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
});

export default FoodItem;
