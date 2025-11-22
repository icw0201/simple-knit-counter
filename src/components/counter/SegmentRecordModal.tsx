import React from 'react';
import { View, DimensionValue } from 'react-native';
import { SlideModal } from '@components/common/modals/SlideModal/SlideModal';
import { ScreenSize } from '@constants/screenSizeConfig';

// ===== 타입 정의 =====
interface SegmentRecordModalProps {
  isOpen: boolean;
  onToggle: () => void;
  handleWidth?: number;
  screenSize: ScreenSize;
  width: number;
  height: number;
  top: DimensionValue;
}

// ===== 메인 컴포넌트 =====
export const SegmentRecordModal: React.FC<SegmentRecordModalProps> = ({
  isOpen,
  onToggle,
  handleWidth = 30,
  screenSize: _screenSize,
  width,
  height,
  top,
}) => {

  return (
    <SlideModal
      isOpen={isOpen}
      onToggle={onToggle}
      height={height}
      width={width}
      handleWidth={handleWidth}
      backgroundColor="white"
      padding={0}
      top={top}
    >
      {/* 콘텐츠 영역 */}
      <View className="flex-1 items-center justify-center" style={{ paddingLeft: handleWidth }}>
        {/* 구간 기록 기능 구현 예정 */}
      </View>
    </SlideModal>
  );
};

export default SegmentRecordModal;

