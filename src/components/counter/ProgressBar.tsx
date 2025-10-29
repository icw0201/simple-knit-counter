// src/components/counter/ProgressBar.tsx
import React from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { ScreenSize } from '@constants/screenSizeConfig';

interface ProgressBarProps {
  count: number;
  targetCount: number;
  screenSize: ScreenSize;
  onPress: () => void;
}

/**
 * 프로그레스 바 컴포넌트
 * 화면 상단에 고정되어 목표 진행률을 표시합니다.
 * 터치 시 목표 단수 설정 모달이 열립니다.
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ count, targetCount, screenSize, onPress }) => {
  const { width } = useWindowDimensions();

  const percentage = targetCount > 0 ? (count / targetCount) * 100 : null;
  const percentageText = percentage !== null ? `${percentage.toFixed(1)}%` : null;

  // 프로그레스 바의 너비 계산 (100%를 넘어가도 표시)
  const progressWidth = percentage !== null ? Math.min((width * percentage) / 100, width) : 0;
  const isFullWidth = percentage !== null && percentage >= 100;

  // 텍스트가 들어갈 수 있는 최소 너비 (대략적으로 "100.0%" 정도를 고려)
  const minTextWidth = 50;
  const isProgressBarWideEnough = progressWidth >= minTextWidth;
  const isCompact = screenSize === ScreenSize.COMPACT;
  const heightClass = isCompact ? 'h-5' : 'h-7';

  return (
    <Pressable
      className={`absolute top-0 left-0 right-0 ${heightClass} bg-red-orange-50`}
      onPress={onPress}
    >
      {/* 프로그레스 바 (왼쪽부터 채워지는 부분) */}
      {percentage !== null && progressWidth > 0 && (
        <View
          className={`absolute left-0 top-0 bottom-0 bg-red-orange-300 ${isFullWidth ? '' : 'rounded-tr-2xl rounded-br-2xl'}`}
          style={{ width: progressWidth }}
        />
      )}

      {/* 백분율 텍스트 - compact 화면에서는 표시하지 않음, 목표 단수가 있을 때만 표시 */}
      {percentageText && targetCount > 0 && !isCompact && (
        <View
          className="absolute left-0 top-0 bottom-0 justify-center"
          style={{
            width: isProgressBarWideEnough ? progressWidth : undefined,
            paddingRight: isProgressBarWideEnough ? 8 : 0,
            paddingLeft: isProgressBarWideEnough ? 0 : 8,
          }}
          pointerEvents="none"
        >
          <Text
            className="text-black text-xs font-bold"
            numberOfLines={1}
            style={{ textAlign: isProgressBarWideEnough ? 'right' : 'left' }}
          >
            {percentageText}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default ProgressBar;
