import React from 'react';
import { View, Text } from 'react-native';
import { SlideModal } from '../common/modals/SlideModal/SlideModal';
import SubCounterAction from './SubCounterAction';
import SubCounterTouchArea from './SubCounterTouchArea';
import { getScreenSize, getSubIconSize } from '@constants/screenSizeConfig';
import { useWindowDimensions } from 'react-native';

// ===== 타입 정의 =====
interface SubCounterModalProps {
  onClose: () => void;
  onReset?: () => void;
  onEdit?: () => void;
  onRule?: () => void;
  onAdd?: () => void;
  onSubtract?: () => void;
  handleWidth?: number;
  subCount?: number;
  subRule?: number;
  subRuleIsActive?: boolean;
}

// ===== 메인 컴포넌트 =====
export const SubCounterModal: React.FC<SubCounterModalProps> = ({
  onClose,
  onReset,
  onEdit,
  onRule,
  onAdd,
  onSubtract,
  handleWidth = 30,
  subCount = 0,
}) => {
  // 화면 크기 정보
  const { height, width } = useWindowDimensions();
  const screenSize = getScreenSize(height, width);
  const iconSize = getSubIconSize(screenSize);
  return (
    <SlideModal
      height={230}
      handleWidth={handleWidth}
      backgroundColor="white"
      padding={0}
      top="80%"
      onClose={onClose}
    >
      {/* 터치 영역 - 배경 100% 차지 */}
      <SubCounterTouchArea
        handleWidth={handleWidth}
        onAdd={onAdd}
        onSubtract={onSubtract}
      />

      {/* 콘텐츠 영역 */}
      <View className="flex-1 items-center justify-center" style={{ paddingLeft: handleWidth }}>

      <View pointerEvents="none">
        <Text className="text-4xl font-bold text-black mt-5 mb-10">
          {subCount}
        </Text>
      </View>

        {/* 액션 버튼들 */}
        <SubCounterAction
          screenSize={screenSize}
          iconSize={iconSize}
          onReset={onReset}
          onEdit={onEdit}
          onRule={onRule}
        />
      </View>
    </SlideModal>
  );
};

export default SubCounterModal;
