import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { CircleQuestionMark } from 'lucide-react-native';

interface QuestionMarkTooltipProps {
  tooltipText: string;
}

/**
 * 퀘스천마크 아이콘과 툴팁을 함께 제공하는 컴포넌트
 * 아이콘을 누르면 모달로 툴팁이 표시됩니다.
 * 툴팁은 화살표가 아래를 향하고 박스가 위에 위치합니다.
 */
const QuestionMarkTooltip: React.FC<QuestionMarkTooltipProps> = ({ tooltipText }) => {
  const iconSize = 24;
  const iconColor = '#767676';
  const { height: screenHeight } = useWindowDimensions();
  const [showTooltip, setShowTooltip] = useState(false);
  const iconRef = useRef<View | null>(null);
  const bodyRef = useRef<View | null>(null);
  const [targetAnchorX, setTargetAnchorX] = useState<number | undefined>(undefined);
  const [tooltipBottom, setTooltipBottom] = useState<number | undefined>(undefined);
  const [arrowLeftPx, setArrowLeftPx] = useState<number | null>(null);
  const opacity = useRef(new Animated.Value(1)).current;
  const AUTO_HIDE_MS = 4000;
  const FADE_OUT_MS = 400;
  const ARROW_HALF_WIDTH = 6; // Svg width 12 기준

  const handlePress = () => {
    // 아이콘의 화면 기준 좌표를 측정하여 툴팁 위치/화살표 정렬에 사용
    iconRef.current?.measureInWindow((x: number, y: number, width: number) => {
      setTargetAnchorX(x + width / 2);
      // Tooltip 화살표가 "아래쪽"에 있으므로, 아이콘 위에 툴팁을 배치합니다.
      // bottom을 사용하여 화면 하단에서부터의 거리로 계산합니다.
      // y축 거리를 줄이기 위해 아이콘 높이(24px) + 작은 간격(12px) = 36px 추가
      setTooltipBottom(screenHeight - y - 24);
      setShowTooltip(true);
      opacity.setValue(1);
    });
  };

  useEffect(() => {
    if (showTooltip && AUTO_HIDE_MS > 0) {
      const t = setTimeout(() => {
        // 페이드아웃: 지정 시간 동안 opacity를 1 → 0으로 감소시킵니다.
        Animated.timing(opacity, {
          toValue: 0,
          duration: FADE_OUT_MS,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            setShowTooltip(false);
          }
        });
      }, AUTO_HIDE_MS);
      return () => clearTimeout(t);
    }
  }, [showTooltip, AUTO_HIDE_MS, FADE_OUT_MS, opacity]);

  return (
    <>
      <View
        ref={(ref) => { iconRef.current = ref; }}
        onLayout={(_e: LayoutChangeEvent) => {
          // 레이아웃이 변경될 때마다 위치 재계산
          if (showTooltip) {
            iconRef.current?.measureInWindow((x: number, y: number, width: number) => {
              setTargetAnchorX(x + width / 2);
              setTooltipBottom(screenHeight - y + iconSize + 12);
            });
          }
        }}
      >
        <Pressable onPress={handlePress} style={{ padding: 4 }}>
          <CircleQuestionMark size={iconSize} color={iconColor} />
        </Pressable>
      </View>

      <Modal
        transparent
        visible={showTooltip}
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => {
          setShowTooltip(false);
        }}
      >
        <Pressable style={styles.modalOverlay} onPress={() => {
          setShowTooltip(false);
        }}>
          {showTooltip && tooltipBottom != null && (
            <Animated.View
              pointerEvents="none"
              style={[styles.tooltipContainer, { bottom: tooltipBottom, opacity }]}
            >
              <View className="relative self-center">
                <View className="relative">
                  {/* 아래쪽 삼각형 화살표 (180도 회전) - 박스 위에 위치 */}
                  <Svg
                    width={12}
                    height={20}
                    style={{
                      position: 'absolute',
                      left: arrowLeftPx ?? undefined,
                      bottom: -8,
                      transform: [{ translateX: -(arrowLeftPx != null ? ARROW_HALF_WIDTH : 6) }, { rotate: '180deg' }],
                      ...(arrowLeftPx == null && { alignSelf: 'center' }),
                    }}
                  >
                    <Path d="M0 20 L5 5 Q6 4 7 5 L12 20 Z" fill="rgba(0,0,0,0.6)" />
                  </Svg>
                  <View
                    ref={(ref) => { bodyRef.current = ref; }}
                    className="px-2 py-3 rounded-md bg-black/60 mb-3"
                    style={{ maxWidth: 240 }}
                    onLayout={(_e: LayoutChangeEvent) => {
                      if (!targetAnchorX || !bodyRef.current) {
                        setArrowLeftPx(null); // 기본 중앙 정렬
                        return;
                      }
                      // 박스의 화면 기준 좌표를 가져와 타겟 X와의 차이로 화살표 위치(px) 계산
                      bodyRef.current.measureInWindow((x, _y, width) => {
                        const raw = targetAnchorX - x;
                        const clamped = Math.max(ARROW_HALF_WIDTH, Math.min(width - ARROW_HALF_WIDTH, raw));
                        setArrowLeftPx(clamped);
                      });
                    }}
                  >
                    {tooltipText ? (
                      <Text className="text-white text-xs text-center">{tooltipText}</Text>
                    ) : null}
                  </View>
                </View>
              </View>
            </Animated.View>
          )}
        </Pressable>
      </Modal>
    </>
  );
};

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

export default QuestionMarkTooltip;

