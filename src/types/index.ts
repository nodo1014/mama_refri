export interface Food {
  id: string;
  name: string;
  storageLocation: "refrigerator" | "freezer" | "other";
  expirationDate: string;
  createdAt: string;
}

export type StorageLocation = "refrigerator" | "freezer" | "other";
