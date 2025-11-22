import React from 'react';
import { View, Text, DimensionValue } from 'react-native';
import { SlideModal } from '@components/common/modals/SlideModal/SlideModal';
import { ScreenSize } from '@constants/screenSizeConfig';
import { SectionRecord } from '@storage/types';
import { getEditContentText } from '@utils/sectionRecordUtils';
import CircleIcon from '@components/common/CircleIcon';
import { SEGMENT_UNDO_ICON_SIZE } from '@utils/iconUtils';

// ===== 타입 정의 =====
interface SegmentRecordModalProps {
  isOpen: boolean;
  onToggle: () => void;
  onUndo: () => void;
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
  onUndo,
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
      <View
        className="flex-1 justify-center px-4"
        style={{ paddingLeft: handleWidth + 16 }}
      >
        {displayRecords.length > 0 ? (
          <View className="flex-row items-center justify-between">
            {/* 3개 기록 묶음 - 80% 너비 */}
            <View className="flex-[0.8] mr-2">
              {displayRecords.map((record, index) => {
                // 첫 번째: black, 두 번째: darkgray, 세 번째: mediumgray
                const textColorClass = index === 0 ? 'text-black' : index === 1 ? 'text-darkgray' : 'text-mediumgray';
                return (
                  <View key={index} className="py-1">
                    <Text
                      className={`text-sm font-semibold ${textColorClass}`}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      allowFontScaling={false}
                    >
                      {record.time} {getEditContentText(record)}
                    </Text>
                  </View>
                );
              })}
            </View>
            {/* 실행 취소 버튼 - 20% 너비 */}
            <View className="flex-[0.2] items-end">
              <CircleIcon
                size={SEGMENT_UNDO_ICON_SIZE}
                isButton={true}
                onPress={onUndo}
                iconName="eraser"
                iconColor="black"
                containerClassName="bg-red-orange-200 border-0"
              />
            </View>
          </View>
        ) : (
          <View className="items-center justify-center">
            <Text className="text-sm text-darkgray" allowFontScaling={false}>
              구간 기록이 없습니다
            </Text>
          </View>
        )}
      </View>
    </SlideModal>
  );
};

export default SegmentRecordModal;

