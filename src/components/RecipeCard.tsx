import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RecipeResponse } from "../utils/deepseekAPI";

interface RecipeCardProps {
  recipe: RecipeResponse;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>필요한 재료</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={`ingredient-${index}`} style={styles.listItem}>
            • {ingredient}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>조리 방법</Text>
        {recipe.steps.map((step, index) => (
          <Text key={`step-${index}`} style={styles.listItem}>
            {index + 1}. {step}
          </Text>
        ))}
      </View>

      {recipe.tips && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>요리 팁</Text>
          <Text style={styles.tipText}>{recipe.tips}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#a880ff",
  },
  listItem: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  tipText: {
    fontSize: 16,
    fontStyle: "italic",
    lineHeight: 22,
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#a880ff",
  },
});

export default RecipeCard;
