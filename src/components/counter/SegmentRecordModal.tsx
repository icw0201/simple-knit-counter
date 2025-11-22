import React from 'react';
import { View, Text, DimensionValue } from 'react-native';
import { SlideModal } from '@components/common/modals/SlideModal/SlideModal';
import { ScreenSize } from '@constants/screenSizeConfig';
import { SectionRecord } from '@storage/types';
import { getEditContentText } from '@utils/sectionRecordUtils';

// ===== 타입 정의 =====
interface SegmentRecordModalProps {
  isOpen: boolean;
  onToggle: () => void;
  handleWidth?: number;
  screenSize: ScreenSize;
  width: number;
  height: number;
  top: DimensionValue;
  sectionRecords?: SectionRecord[];
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
  sectionRecords = [],
}) => {
  // 최신 3개만 표시 (이미 최신 순으로 정렬되어 있음)
  const displayRecords = sectionRecords.slice(0, 3);

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
      <View className="flex-1 justify-center px-4" style={{ paddingLeft: handleWidth + 16 }}>
        {displayRecords.length > 0 ? (
          displayRecords.map((record, index) => {
            // 첫 번째: black, 두 번째: darkgray, 세 번째: mediumgray
            const textColorClass = index === 0 ? 'text-black' : index === 1 ? 'text-darkgray' : 'text-mediumgray';
            return (
              <View key={index} className="py-1">
                <Text className={`text-sm font-semibold ${textColorClass}`}>
                  {record.time} {getEditContentText(record)}
                </Text>
              </View>
            );
          })
        ) : (
          <View className="items-center justify-center">
            <Text className="text-sm text-darkgray">구간 기록이 없습니다</Text>
          </View>
        )}
      </View>
    </SlideModal>
  );
};

export default SegmentRecordModal;

