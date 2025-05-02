import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface MamaSpeechBubbleProps {
  message: string;
}

const MamaSpeechBubble: React.FC<MamaSpeechBubbleProps> = ({ message }) => {
  // 메시지를 두 부분으로 분리: 엄마의 대화와 딸의 반응
  // 메시지에 따라 다른 반응을 보이도록 함
  const transformGothelMessage = (message: string) => {
    if (message.includes("오늘까지")) {
      return (
        message.replace("오늘까지", "오늘까지 어여 빨리") +
        " 내 사랑스러운 꽃송이야."
      );
    } else if (message.includes("임박한 식재료")) {
      return "이 식재료들, 곧 썩어버릴 거야. 귀여운 내 딸이 해결해주겠지? 엄마는 너를 믿어~";
    } else if (message.includes("잘 정리되어 있네요")) {
      return "냉장고가 정리되어 있구나! 내 소중한 딸~ 이번엔 뭔가 특별한 걸 만들어볼까? 엄마를 위해서?";
    } else {
      return message + " 엄마의 소중한 보물아~";
    }
  };

  const getJudyResponse = (message: string) => {
    if (message.includes("오늘까지")) {
      return "네, 어머니. 바로 해볼게요... (솔직히 그냥 버려도 될 것 같은데)";
    } else if (message.includes("임박한 식재료")) {
      return "알겠어요! 확인할게요... (또 이러시네. 그냥 배달시켜 먹고 싶은데)";
    } else if (message.includes("잘 정리되어 있네요")) {
      return "새로운 요리 배워볼게요! (사실 유튜브에서 본 간단한 거로 때울까 했는데)";
    } else {
      return "냉장고에 뭐가 있는지 살펴볼게요... (어차피 또 손이 많이 가는 요리 시키겠지)";
    }
  };

  const gothelMessage = transformGothelMessage(message);
  const judyResponse = getJudyResponse(message);

  return (
    <View style={styles.container}>
      <View style={styles.conversation}>
        <View style={styles.avatarContainer}>
          <Image
            source={require("../../assets/gothel.jpeg")}
            style={styles.avatar}
            defaultSource={require("../../assets/gothel.jpeg")}
          />
        </View>
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>{gothelMessage}</Text>
        </View>
      </View>

      <View style={styles.conversationReverse}>
        <View style={styles.speechBubbleJudy}>
          <Text style={styles.speechTextJudy}>{judyResponse}</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Image
            source={require("../../assets/judy.png")}
            style={styles.avatar}
            defaultSource={require("../../assets/judy.png")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 8,
  },
  conversation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  conversationReverse: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  speechBubble: {
    backgroundColor: "#a880ff20",
    padding: 16,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    maxWidth: "80%",
    marginLeft: 8,
    flex: 1,
  },
  speechBubbleJudy: {
    backgroundColor: "#4f9cf920",
    padding: 16,
    borderRadius: 16,
    borderTopRightRadius: 0,
    maxWidth: "80%",
    marginRight: 8,
    flex: 1,
  },
  speechText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    fontStyle: "italic",
  },
  speechTextJudy: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    textAlign: "right",
  },
});

export default MamaSpeechBubble;
