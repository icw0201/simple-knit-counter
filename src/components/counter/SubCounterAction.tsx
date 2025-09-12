import React from 'react';
import { View } from 'react-native';
import CircleIcon from '@components/common/CircleIcon';
import { ScreenSize } from '@constants/screenSizeConfig';

interface SubCounterActionProps {
  screenSize: ScreenSize;
  iconSize: number;
  onReset?: () => void;
  onEdit?: () => void;
  onRule?: () => void;
}

/**
 * 서브 카운터 액션 버튼 컴포넌트
 * 초기화, 편집, 규칙 버튼을 제공합니다.
 */
const SubCounterAction: React.FC<SubCounterActionProps> = ({
  screenSize,
  iconSize,
  onReset,
  onEdit,
  onRule,
}) => {
  // 컴팩트 화면이 아닐 때만 표시
  if (screenSize === ScreenSize.COMPACT) {
    return null;
  }

  return (
    <View className="flex-row items-center">
      {/* 초기화 버튼 */}
      <CircleIcon
        size={iconSize}
        iconName="rotate-ccw"
        colorStyle="C"
        isButton
        containerClassName="mx-2"
        onPress={onReset}
      />

      {/* 편집 버튼 */}
      <CircleIcon
        size={iconSize}
        iconName="pencil"
        colorStyle="C"
        isButton
        containerClassName="mx-2"
        onPress={onEdit}
      />

      {/* 규칙 버튼 */}
      <CircleIcon
        size={iconSize}
        iconName="corner-down-left"
        colorStyle="C"
        isButton
        containerClassName="mx-2"
        onPress={onRule}
      />
    </View>
  );
};

export default SubCounterAction;
