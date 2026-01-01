import React, { useState, useRef } from 'react';
import { TouchableOpacity, LayoutChangeEvent, View, Modal, Pressable, StyleSheet } from 'react-native';
import { CircleQuestionMark } from 'lucide-react-native';
import Tooltip from './Tooltip';

interface QuestionMarkIconProps {
  tooltipText: string;
  onPress?: () => void;
}

/**
 * 터치하면 툴팁을 표시하는 퀘스천마크 아이콘 컴포넌트
 */
const QuestionMarkIcon: React.FC<QuestionMarkIconProps> = ({
  tooltipText,
  onPress,
}) => {
  const iconSize = 24;
  const iconColor = '#767676';
  const [showTooltip, setShowTooltip] = useState(false);
  const iconRef = useRef<View | null>(null);
  const [targetAnchorX, setTargetAnchorX] = useState<number | undefined>(undefined);
  const [tooltipTop, setTooltipTop] = useState<number | undefined>(undefined);

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    // 아이콘의 화면 기준 좌표를 측정하여 툴팁 위치/화살표 정렬에 사용
    iconRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
      setTargetAnchorX(x + width / 2);
      // Tooltip 화살표가 "위쪽"에 있으므로, 아이콘 아래에 툴팁을 배치합니다.
      setTooltipTop(y + height + 6);
      setShowTooltip(true);
    });
  };

  return (
    <>
      <View
        ref={(ref) => { iconRef.current = ref; }}
        onLayout={(_e: LayoutChangeEvent) => {
          // 레이아웃이 변경될 때마다 위치 재계산
          iconRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
            setTargetAnchorX(x + width / 2);
            setTooltipTop(y + height + 6);
          });
        }}
      >
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <CircleQuestionMark size={iconSize} color={iconColor} />
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={showTooltip}
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setShowTooltip(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowTooltip(false)}>
          {showTooltip && tooltipTop != null && (
            <Tooltip
              text={tooltipText}
              // Modal(전체 화면) 위에 띄워서, 아이콘 폭에 의해 툴팁 폭이 쪼그라들지 않게 합니다.
              containerStyle={[styles.tooltipContainer, { top: tooltipTop }]}
              targetAnchorX={targetAnchorX}
              onHide={() => setShowTooltip(false)}
            />
          )}
        </Pressable>
      </Modal>
    </>
  );
};

export default QuestionMarkIcon;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  tooltipContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
});

