// src/components/counter/CounterActions.tsx
import React from 'react';
import { View } from 'react-native';
import CircleIcon from '@components/common/CircleIcon';
import { ScreenSize } from '@constants/screenSizeConfig';

interface CounterActionsProps {
  screenSize: ScreenSize;
  iconSize: number;
  onReset: () => void;
  onEdit: () => void;
}

/**
 * 카운터 액션 버튼 컴포넌트
 * 초기화 및 편집 버튼을 제공합니다.
 */
const CounterActions: React.FC<CounterActionsProps> = ({
  screenSize,
  iconSize,
  onReset,
  onEdit,
}) => {
  // 컴팩트 화면이 아닐 때만 표시
  if (screenSize === ScreenSize.COMPACT) {
    return null;
  }

  return (
    <View className="flex-row items-end">
      {/* 초기화 버튼 */}
      <CircleIcon
        size={iconSize}
        iconName="rotate-ccw"
        colorStyle="medium"
        isButton
        containerClassName="mx-2"
        onPress={onReset}
      />

      {/* 편집 버튼 */}
      <CircleIcon
        size={iconSize}
        iconName="pencil"
        colorStyle="medium"
        isButton
        containerClassName="mx-2"
        onPress={onEdit}
      />
    </View>
  );
};

export default CounterActions;
