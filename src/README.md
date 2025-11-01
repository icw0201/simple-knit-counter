# Simple Knit Counter 🧶

React Native로 개발된 간단하고 직관적인 뜨개질 카운터 앱입니다.

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- React Native CLI
- Android Studio (Android 개발용)
- Xcode (iOS 개발용, macOS만)
- Yarn 패키지 매니저

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd simple-knit-counter

# 의존성 설치
yarn install

# iOS 의존성 설치 (macOS만)
cd ios && pod install && cd ..
```

### 실행

#### Android
```bash
# Android 앱 실행
yarn android
# 또는
npx react-native run-android
```

#### iOS (macOS만)
```bash
# iOS 앱 실행
yarn ios
# 또는
npx react-native run-ios
```

#### Metro 서버
```bash
# Metro 개발 서버 시작
yarn start
# 또는
npx react-native start

# 캐시 초기화와 함께 시작
npx react-native start --reset-cache
```

#### 안드로이드 휴대폰 연결
```bash
#디바이스 목록 확인
adb devices

#기기 페어링하기
adb pair 000.00.0.00:00000
```

### 빌드

#### Android
```bash
# Debug APK 빌드
번들 파일 생성 npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
파일 위치 : android/app/src/main/assets/index.android.bundle
npx react-native run-android
파일 위치 : android/app/build/outputs/apk/debug

# Release APK 빌드
cd android
./gradlew app:assembleRelease
생성 위치 android/app/build/outputs/apk/release 

# aab 파일 빌드
cd android, ./gradlew bundleRelease
생성 위치 android/app/build/outputs/bundle/release 
```

#### iOS (macOS만)
```bash
# Xcode에서 프로젝트 열기
open ios/MiniKnitCounter.xcworkspace
```

## 🏗️ 프로젝트 구조

```
simple-knit-counter/
├── src/
│   ├── assets/          # 이미지, 폰트, 사운드
│   ├── components/      # 재사용 가능한 컴포넌트
│   ├── navigation/      # 네비게이션 설정
│   ├── screens/         # 화면 컴포넌트
│   ├── storage/         # 데이터 저장 및 관리
│   ├── styles/          # 스타일 정의
│   └── types/           # TypeScript 타입 정의
├── android/             # Android 네이티브 코드
├── ios/                 # iOS 네이티브 코드
└── __tests__/           # 테스트 파일
```

## 🧪 테스트

```bash
# 테스트 실행
yarn test

# 테스트 커버리지
yarn test --coverage

# 특정 테스트 파일 실행
yarn test App.test.tsx
```

## 🔧 개발 도구

### 코드 품질
```bash
# ESLint 검사
yarn lint

# TypeScript 타입 검사
npx tsc --noEmit

# Prettier 포맷팅
yarn prettier --write .
```

### 디버깅
```bash
# Metro 캐시 클리어
npx react-native start --reset-cache
```

## 🌿 브랜치 전략

### Git Flow 기반 브랜치 전략

```
main (production)
├── develop (development)
├── feat/이슈번호-기능-명
├── refactor/이슈번호-기능-명
├── fix/이슈번호-수정정
├── hotfix/이슈번호-긴급수정
└── release/v0.0.0
```

#### 브랜치 규칙

1. **main**: 프로덕션 배포용 (직접 커밋 금지)
2. **develop**: 개발 통합용 (기능 완성 후 merge)
3. **feat/기능명**: 새로운 기능 개발
4. **fix/수정**: 프로덕션 오류-수정
4. **refactor/수정**: 프로덕션 수정
5. **hotfix/긴급수정**: 프로덕션 긴급 수정
6. **release/릴리즈준비**: 릴리즈 준비 및 테스트

#### 커밋 메시지 규칙

type(scope): description

**커밋 타입**

| 타입     | 설명              |
| -------- | ----------------- |
| feat     | 새로운 기능 추가  |
| fix      | 버그 수정         |
| docs     | 문서 수정         |
| style    | 코드 스타일 변경  |
| design   | UI 디자인 변경    |
| test     | 테스트 코드 작성  |
| refactor | 코드 리팩토링     |
| build    | 빌드 파일 수정    |
| ci       | CI 설정 파일 수정 |
| perf     | 성능 개선         |
| chore    | 자잘한 수정       |
| rename   | 파일/폴더명 수정  |
| remove   | 파일 삭제         |


#### 브랜치 생성 및 작업 흐름

```bash
# 1. develop 브랜치에서 feature 브랜치 생성
git checkout develop
git pull origin develop
git switch feat/새로운기능

# 2. 기능 개발 및 커밋
git add .
git commit -m "feat(scope): description"

# 3. develop 브랜치로 merge
PR 생성

# 4. feature 브랜치 삭제
git branch -D feature/새로운기능

# 5. 원격 브랜치 정리
git remote prune origin
```

## 📦 주요 의존성

### 핵심 라이브러리
- **React Native**: 0.79.2
- **React Navigation**: 7.x
- **NativeWind**: 2.0.11 (Tailwind CSS)
- **MMKV**: 로컬 스토리지
- **Lucide React Native**: 아이콘

### 개발 도구
- **TypeScript**: 5.0.4
- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **Jest**: 테스트 프레임워크

## 🚨 문제 해결

### 일반적인 문제들

#### Android 빌드 오류
```bash
# Android 프로젝트 클린
cd android
./gradlew clean
cd ..

# 다시 빌드
npx react-native run-android
```

#### iOS 빌드 오류
```bash
# iOS 의존성 재설치
cd ios
pod deintegrate
pod install
cd ..

# 다시 빌드
npx react-native run-ios
```

## 📱 앱 구조

### 주요 화면
- **Main**: 프로젝트 목록 및 관리
- **ProjectDetail**: 프로젝트 상세 및 카운터 관리
- **CounterDetail**: 카운터 조작 및 설정
- **Setting**: 앱 설정
- **InfoScreen**: 프로젝트/카운터 정보

---

**Happy Knitting! 🧶✨**
