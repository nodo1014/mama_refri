import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Food } from "../types";

// 알림 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 알림 채널 설정 (Android용)
const setupNotificationChannel = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("expiration", {
      name: "유통기한 알림",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      description: "식재료 유통기한 임박 알림",
    });
  }
};

// 알림 핸들러 설정
export const setupNotificationHandler = async () => {
  try {
    await setupNotificationChannel();
    console.log("알림 채널 설정 완료");
  } catch (error) {
    console.error("알림 설정 오류:", error);
  }
};

// 알림 권한 요청
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // 기존에 권한이 없는 경우 요청
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  } catch (error) {
    console.error("알림 권한 요청 오류:", error);
    return false;
  }
};

// 유통기한 알림 예약
export const scheduleExpirationNotification = async (
  food: Food,
  notificationsEnabled: boolean
): Promise<void> => {
  try {
    if (!notificationsEnabled) return;

    // 알림 권한 확인
    const isPermissionGranted = await requestNotificationPermission();
    if (!isPermissionGranted) return;

    // 유통기한 계산
    const expirationDate = new Date(food.expirationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 유통기한이 3일 이내인 식재료만 알림 설정
    if (diffDays <= 3 && diffDays > 0) {
      // 알림 ID 생성 (식재료 ID + 유통기한으로 고유 ID 생성)
      const notificationId = `${food.id}-${food.expirationDate}`;

      // 알림 취소 (기존 알림이 있는 경우)
      await Notifications.cancelScheduledNotificationAsync(notificationId);

      // 알림 예약
      await Notifications.scheduleNotificationAsync({
        identifier: notificationId,
        content: {
          title: "유통기한 임박 알림",
          body: `${food.name}의 유통기한이 ${diffDays}일 남았습니다!`,
          data: { foodId: food.id },
        },
        trigger: {
          hour: 9, // 오전 9시에 알림
          minute: 0,
          repeats: false,
        },
      });

      console.log(`${food.name} 알림 예약 완료: ${diffDays}일 남음`);
    }
  } catch (error) {
    console.error("알림 예약 오류:", error);
  }
};

// 모든 식재료 유통기한 알림 업데이트
export const updateAllExpirationNotifications = async (
  foods: Food[],
  notificationsEnabled: boolean
): Promise<void> => {
  try {
    // 알림이 비활성화된 경우 모든 알림 취소
    if (!notificationsEnabled) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return;
    }

    // 각 식재료에 대한 알림 예약
    for (const food of foods) {
      await scheduleExpirationNotification(food, notificationsEnabled);
    }
  } catch (error) {
    console.error("알림 업데이트 오류:", error);
  }
};
