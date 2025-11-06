import React from 'react';
import { View } from 'react-native';
import CircleIcon from '@components/common/CircleIcon';

interface FloatingAddButtonProps {
  onPress: () => void;
  bottom: number;
}

/**
 * 플로팅 추가 버튼 컴포넌트
 *
 * Main과 ProjectDetail에서 공통으로 사용되는 플로팅 버튼
 */
const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
  onPress,
  bottom,
}) => {
  return (
    <View
      className="absolute right-8"
      style={{ bottom: 20 + bottom }}
    >
      <CircleIcon
        size={64}
        iconName="plus"
        colorStyle="light"
        isButton
        onPress={onPress}
      />
    </View>
  );
};

export default FloatingAddButton;
