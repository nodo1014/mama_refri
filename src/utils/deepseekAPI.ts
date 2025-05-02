import { Food } from "../types";

// RecipeResponse 인터페이스 정의
export interface RecipeResponse {
  title: string;
  ingredients: string[];
  steps: string[];
  tips?: string;
}

// DeepSeek API 요청을 위한 프롬프트 생성
export const generateRecipePrompt = (foods: Food[], theme?: string): string => {
  const foodNames = foods.map((f) => f.name).join(", ");
  const themeContext = theme ? `${theme} 테마의 ` : "";

  return `다음 식재료를 활용한 ${themeContext}요리 레시피를 추천해주세요:
식재료: ${foodNames}

응답 형식:
{
  "title": "요리 제목",
  "ingredients": ["필요한 재료1", "필요한 재료2", ...],
  "steps": ["조리 단계1", "조리 단계2", ...],
  "tips": "요리 팁"
}

응답은 반드시 위 JSON 형식이어야 하며, 재료와 조리 단계를 상세히 작성해주세요. 요리 팁은 유용한 조리 방법이나 변형 요리에 대한 정보를 포함해주세요.`;
};

// DeepSeek API 호출 함수
export const callDeepSeekAPI = async (
  prompt: string,
  apiKey: string
): Promise<RecipeResponse> => {
  try {
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "당신은 요리 레시피를 잘 아는 요리 전문가입니다. 주어진 식재료로 만들 수 있는 요리 레시피를 JSON 형식으로 추천해주세요.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();

    // API 응답에서 JSON 부분 추출 (괄호 {} 사이의 텍스트)
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("API 응답에서 JSON 형식을 찾을 수 없습니다.");
    }

    // JSON 파싱
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("DeepSeek API 호출 오류:", error);
    throw error;
  }
};
