import { Food } from "../types";

// Helper to get date X days from today
const getDateString = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
};

export const sampleFoods: Food[] = [
  {
    id: "1",
    name: "우유",
    storageLocation: "refrigerator",
    expirationDate: getDateString(1), // Tomorrow
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "달걀",
    storageLocation: "refrigerator",
    expirationDate: getDateString(5), // 5 days from now
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "김치",
    storageLocation: "refrigerator",
    expirationDate: getDateString(14), // 14 days from now
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "닭가슴살",
    storageLocation: "freezer",
    expirationDate: getDateString(30), // 30 days from now
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "브로콜리",
    storageLocation: "freezer",
    expirationDate: getDateString(20), // 20 days from now
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "양파",
    storageLocation: "other",
    expirationDate: getDateString(10), // 10 days from now
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "토마토",
    storageLocation: "refrigerator",
    expirationDate: getDateString(0), // Today
    createdAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "두부",
    storageLocation: "refrigerator",
    expirationDate: getDateString(2), // 2 days from now
    createdAt: new Date().toISOString(),
  },
];

// Function to load sample data
export const loadSampleData = async (): Promise<void> => {
  // Import storage functions here to avoid circular dependency
  const Storage = await import("./storage");
  await Storage.saveFoods(sampleFoods);
};
