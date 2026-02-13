// App.tsx (루트 최상위 파일)
import React from 'react';
import { SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { ScreenAwakeSync } from './src/components/common/ScreenAwakeSync';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenAwakeSync />
      <AppNavigator />
    </SafeAreaView>
  );
}