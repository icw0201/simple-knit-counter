// src/styles/screenStyles.ts

import { StyleSheet } from 'react-native';
import { Edge } from 'react-native-safe-area-context';

/**
 * SafeAreaView의 edges prop - 좌우하단만 적용 (상단은 헤더가 있으므로 제외)
 */
export const safeAreaEdges: Edge[] = ['left', 'right', 'bottom'];

/**
 * 화면 레이아웃에 사용되는 공통 스타일
 * Tailwind로 표현할 수 없는 필수적인 스타일들을 모아둡니다.
 */
export const screenStyles = StyleSheet.create({
  // SafeAreaView, KeyboardAvoidingView 등에서 사용하는 flex: 1
  flex1: {
    flex: 1,
  },
  // ScrollView contentContainerStyle - 일반적인 하단 패딩 (p-4 = 16px 포함)
  scrollViewContent: {
    padding: 16, // p-4
    paddingBottom: 20,
  },
  // pointerEvents: 'box-none' - 터치 이벤트가 자식 요소로 전달되도록 함
  pointerEventsBoxNone: {
    pointerEvents: 'box-none',
  },
  // ScrollView contentContainerStyle - 중앙 정렬 및 flexGrow (p-4 = 16px 포함)
  scrollViewContentCentered: {
    padding: 16, // p-4
    paddingBottom: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
});

