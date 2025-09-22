// src/components/settings/SettingsVersion.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface SettingsVersionProps {
  version?: string;
}

/**
 * 설정 화면의 앱 버전 정보 컴포넌트
 */
const SettingsVersion: React.FC<SettingsVersionProps> = ({
  version = '1.1.3',
}) => {
  return (
    <View className="items-center mt-4">
      <Text className="text-[14px] text-gray-500">Ver {version}</Text>
    </View>
  );
};

export default SettingsVersion;
