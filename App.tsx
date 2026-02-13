// App.tsx (루트 최상위 파일)
import React from 'react';
import { SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { useScreenAwakeSync } from './src/hooks/useScreenAwakeSync';

export default function App() {
  useScreenAwakeSync();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppNavigator />
    </SafeAreaView>
  );
}
