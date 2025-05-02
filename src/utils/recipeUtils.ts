import { Food } from "../types";
import {
  generateRecipePrompt,
  callDeepSeekAPI,
  RecipeResponse,
} from "./deepseekAPI";

// API 키 설정 (실제 환경에서는 .env 파일이나 보안 스토리지에 저장하는 것이 좋습니다)
let DEEPSEEK_API_KEY = "";

// API 키 설정 함수
export const setDeepSeekApiKey = (apiKey: string) => {
  DEEPSEEK_API_KEY = apiKey;
};

// API 키 확인 함수
export const hasApiKey = (): boolean => {
  return !!DEEPSEEK_API_KEY;
};

// 레시피 요청 함수
export const requestRecipe = async (
  foods: Food[],
  theme?: string
): Promise<RecipeResponse> => {
  try {
    // API 키가 설정되어 있고 실제 API 호출을 원하는 경우
    if (DEEPSEEK_API_KEY) {
      // 1. 프롬프트 생성
      const prompt = generateRecipePrompt(foods, theme);

      // 2. API 호출
      return await callDeepSeekAPI(prompt, DEEPSEEK_API_KEY);
    }

    // API 키가 없는 경우 더미 레시피 반환
    return generateDummyRecipe(foods, theme);
  } catch (error) {
    console.error("레시피 요청 오류:", error);
    // 오류 발생 시에도 더미 레시피 반환
    return generateDummyRecipe(foods, theme);
  }
};

// 템플릿 기반 더미 레시피 생성
const generateDummyRecipe = (foods: Food[], theme?: string): RecipeResponse => {
  // 사용 가능한 식재료 목록
  const foodNames = foods.map((f) => f.name);

  // 테마에 따른 레시피 제목 생성
  let title = "";
  let additionalIngredients: string[] = [];
  let steps: string[] = [];
  let tips = "";

  if (foodNames.includes("김치") && foodNames.includes("달걀")) {
    title = "김치 달걀 볶음밥";
    additionalIngredients = [
      "밥 1공기",
      "식용유 약간",
      "소금 약간",
      "후추 약간",
      "파 약간",
    ];
    steps = [
      "프라이팬에 식용유를 두르고 달걀을 풀어 스크램블 에그를 만듭니다.",
      "김치를 적당한 크기로 썰어 달걀과 함께 볶습니다.",
      "밥을 넣고 함께 볶으며 소금과 후추로 간을 합니다.",
      "파를 송송 썰어 뿌려 완성합니다.",
    ];
    tips =
      "김치는 조금 묵은 김치가 더 맛있어요. 참기름을 한 방울 넣으면 풍미가 더 좋아집니다.";
  } else if (foodNames.includes("닭가슴살")) {
    title = "닭가슴살 샐러드";
    additionalIngredients = [
      "상추",
      "방울토마토",
      "오이",
      "올리브오일",
      "레몬즙",
      "소금",
      "후추",
    ];
    steps = [
      "닭가슴살을 삶아서 식힌 후 손으로 찢어 준비합니다.",
      "상추는 씻어서 먹기 좋은 크기로 찢고, 토마토는 반으로 자르고, 오이는 얇게 슬라이스합니다.",
      "올리브오일, 레몬즙, 소금, 후추를 섞어 드레싱을 만듭니다.",
      "모든 재료를 섞어 드레싱을 뿌려 완성합니다.",
    ];
    tips = "닭가슴살은 삶을 때 월계수잎이나 향신료를 넣으면 더 맛있어요.";
  } else if (foodNames.includes("두부")) {
    title = "두부 조림";
    additionalIngredients = [
      "간장 2큰술",
      "설탕 1큰술",
      "다진 마늘 1작은술",
      "참기름 1작은술",
      "고추장 1작은술",
      "대파 약간",
    ];
    steps = [
      "두부를 적당한 크기로 썰어 소금물에 살짝 데칩니다.",
      "팬에 식용유를 두르고 두부를 노릇하게 굽습니다.",
      "간장, 설탕, 다진 마늘, 고추장을 섞어 양념장을 만듭니다.",
      "두부에 양념장을 넣고 조려 먹기 좋은 크기로 잘라 완성합니다.",
    ];
    tips =
      "두부는 먼저 소금물에 살짝 데치면 더 단단해져 조리할 때 부서지지 않아요.";
  } else {
    // 기본 레시피
    title = `${foodNames.slice(0, 3).join(", ")} 요리`;
    additionalIngredients = ["소금", "후추", "식용유", "양파", "마늘"];
    steps = [
      "모든 재료를 손질하여 준비합니다.",
      "프라이팬에 식용유를 두르고 양파와 마늘을 볶습니다.",
      `${foodNames.join(", ")}을(를) 넣고 함께 볶습니다.`,
      "소금과 후추로 간을 맞추고 완성합니다.",
    ];
    tips = "개인 취향에 맞게 양념을 조절해보세요!";
  }

  // 테마별 추가 팁
  if (theme === "아이 반찬") {
    tips += " 아이들을 위해 야채를 작게 다져 숨겨보세요.";
  } else if (theme === "아침식사") {
    tips += " 아침식사로는 가볍게 준비해 부담없이 먹을 수 있어요.";
  } else if (theme === "해장") {
    tips += " 해장에는 국물을 조금 더 진하게 해보세요.";
  } else if (theme === "다이어트") {
    tips += " 다이어트 중이라면 기름을 최소화하고 향신료로 맛을 내보세요.";
  }

  return {
    title,
    ingredients: [...foodNames, ...additionalIngredients],
    steps,
    tips,
  };
};
