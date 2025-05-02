# 마마냉장고 (Mama Refrigerator)

냉장고 식재료의 유통기한 관리, 음식 정리, 요리 추천, 재료 낭비 방지를 위한 모바일 앱입니다.

## 앱 소개

- **이름**: 마마냉장고
- **타겟 사용자**: 엄마(고델 컨셉)와 초등학생 딸(주디 컨셉)
- **목적**: 냉장고 식재료의 유통기한 관리, 음식 정리, 요리 추천, 재료 낭비 방지
- **기술 스택**: React Native (Expo 기반), AsyncStorage, DeepSeek API

## 주요 기능

- 식재료 등록 (음식 이름, 보관 위치, 유통기한)
- 유통기한 임박 식재료 자동 분류 및 표시
- 전체 냉장고 목록 보기 (냉장/냉동/기타 분류)
- AI 레시피 추천 (DeepSeek API 연동 가능)
- (추후 구현) 자동 재고 입력 (이메일 파싱)
- (추후 구현) 푸시 알림

## 개발 환경 설정

```bash
# 프로젝트 클론 후 의존성 설치
npm install

# 개발 서버 실행
npx expo start
```

### 개발환경 구성 (iMac 인텔 기준)

- Node.js, npm, Expo CLI 설치
- Xcode 설치 (iOS 시뮬레이터 포함)
- `npx expo start` → `i` 입력 시 시뮬레이터 실행
- 실기기는 Expo Go 앱으로 테스트 가능

## DeepSeek API 설정

1. [DeepSeek 플랫폼](https://platform.deepseek.com)에서 API 키 발급
2. 앱의 '설정' 메뉴에서 API 키 입력
3. API 키가 설정되면 레시피 추천 시 실제 AI 기반 추천 제공
4. API 키가 없어도 기본 레시피는 제공됩니다

## 앱 실행하기

1. Expo Go 앱을 스마트폰에 설치하세요 (iOS App Store 또는 Google Play Store에서)
2. 개발 서버를 실행하세요: `npx expo start`
3. 스마트폰으로 표시된 QR 코드를 스캔하세요
   - iOS: 카메라 앱으로 스캔
   - Android: Expo Go 앱에서 스캔

## 개발 로드맵

1. ✅ 기본 UI 구성 및 식재료 관리 기능
2. ✅ 유통기한 임박 식재료 표시
3. ✅ 레시피 추천 기능 (테스트 데이터 사용)
4. ✅ DeepSeek API 연동을 통한 진짜 AI 레시피 추천
5. ✅ 설정 화면 및 API 키 관리 기능 추가
6. ⬜ 이메일 파싱을 통한 자동 재고 입력
7. ⬜ 푸시 알림 구현
