# Simple Knit Counter 🧶

React Native로 개발된 간단하고 직관적인 뜨개질 카운터 앱입니다.

## 📱 주요 기능

- **프로젝트 관리**: 뜨개질 프로젝트별로 카운터 관리
- **카운터 기능**: 증가/감소, 초기화, 편집
- **방향 표시**: 앞/뒤 방향 자동 전환 및 수동 설정
- **활성 모드**: 비활성/활성/자동 모드 지원
- **설정**: 사운드, 진동, 화면 켜짐 설정
- **데이터 저장**: 로컬 스토리지로 데이터 영구 보존

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
cd android
./gradlew assembleDebug

# Release APK 빌드
번들 파일 생성 npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
파일 위치 : android/app/src/main/assets/index.android.bundle
npx react-native run-android
파일 위치 : android/app/build/outputs/apk/debug

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
# React Native Doctor로 환경 진단
npx react-native doctor

# Metro 캐시 클리어
npx react-native start --reset-cache
```

## 🌿 브랜치 전략

### Git Flow 기반 브랜치 전략

```
main (production)
├── develop (development)
├── feature/기능명
├── hotfix/긴급수정
└── release/릴리즈준비
```

#### 브랜치 규칙

1. **main**: 프로덕션 배포용 (직접 커밋 금지)
2. **develop**: 개발 통합용 (기능 완성 후 merge)
3. **feature/기능명**: 새로운 기능 개발
4. **hotfix/긴급수정**: 프로덕션 긴급 수정
5. **release/릴리즈준비**: 릴리즈 준비 및 테스트

#### 커밋 메시지 규칙

```
type(scope): description

# 예시
feat(counter): 카운터 증가/감소 기능 추가
fix(storage): 데이터 저장 오류 수정
docs(readme): README 파일 업데이트
style(ui): UI 컴포넌트 스타일 개선
refactor(storage): 스토리지 함수 리팩토링
test(counter): 카운터 컴포넌트 테스트 추가
```

#### 브랜치 생성 및 작업 흐름

```bash
# 1. develop 브랜치에서 feature 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/새로운기능

# 2. 기능 개발 및 커밋
git add .
git commit -m "feat(scope): description"

# 3. develop 브랜치로 merge
git checkout develop
git merge feature/새로운기능
git push origin develop

# 4. feature 브랜치 삭제
git branch -d feature/새로운기능
```

## 📦 주요 의존성

### 핵심 라이브러리
- **React Native**: 0.79.2
- **React Navigation**: 7.x
- **NativeWind**: 2.0.11 (Tailwind CSS)
- **MMKV**: 로컬 스토리지
- **React Native Vector Icons**: 아이콘

### 개발 도구
- **TypeScript**: 5.0.4
- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **Jest**: 테스트 프레임워크

## 🚨 문제 해결

### 일반적인 문제들

#### Metro 서버 포트 충돌
```bash
# 포트 8081 사용 중인 프로세스 종료
taskkill /f /im node.exe  # Windows
killall node               # macOS/Linux

# 다른 포트로 시작
npx react-native start --port 8082
```

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

### 데이터 모델
```typescript
interface Project {
  id: string;
  type: 'project';
  title: string;
  counterIds: string[];
  info?: Info;
}

interface Counter {
  id: string;
  type: 'counter';
  title: string;
  count: number;
  parentProjectId?: string | null;
  info?: Info;
  activateMode?: ActivateMode;
}
```

## 🤝 기여하기

1. 이슈 생성 또는 기존 이슈 확인
2. feature 브랜치 생성
3. 코드 작성 및 테스트
4. Pull Request 생성
5. 코드 리뷰 후 merge

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

문제가 있거나 질문이 있으시면 이슈를 생성해 주세요.

---

**Happy Knitting! 🧶✨**
