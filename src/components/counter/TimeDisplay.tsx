import React, { useEffect, useState } from 'react';
import { Text, View, LayoutChangeEvent, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ScreenSize, getTimeDisplayTextClass, getGapClass } from '@constants/screenSizeConfig';
import { timeDisplayStyles } from './TimeDisplayStyles';
import { formatElapsedTime } from '@utils/timeUtils';

interface TimeDisplayProps {
  screenSize: ScreenSize;
  timerIsPlaying: boolean;
  elapsedTime: number; // 소요 시간 (초 단위, 0 ~ 35999999, 최대 9999:59:59)
  onPress: () => void;
}

/**
 * 시간 표시 컴포넌트
 * DSEG7Classic 폰트를 사용하여 시간을 표시합니다.
 */
const TimeDisplay: React.FC<TimeDisplayProps> = ({ screenSize, timerIsPlaying, elapsedTime, onPress }) => {
  // 깎인 모서리 크기 (픽셀 단위)
  const cornerSize = 8;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showColon, setShowColon] = useState(true);

  useEffect(() => {
    if (!timerIsPlaying) {
      setShowColon(true);
      return;
    }

    const VISIBLE_DURATION_MS = 600;

    // 초가 바뀌는(elapsedTime 변경) 순간 콜론을 켜고,
    // 600ms 동안 켜져 있다가 나머지 400ms는 꺼진 상태 유지
    setShowColon(true);

    const timeoutId = setTimeout(() => {
      setShowColon(false);
    }, VISIBLE_DURATION_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [timerIsPlaying, elapsedTime]);

  // COMPACT일 때는 렌더링하지 않음
  if (screenSize === ScreenSize.COMPACT) {
    return null;
  }

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  // View 크기에 맞춰 깎인 크기를 비율로 계산
  const cornerX = dimensions.width > 0 ? (cornerSize / dimensions.width) * 100 : 0;
  const cornerY = dimensions.height > 0 ? (cornerSize / dimensions.height) * 100 : 0;

  // 화면 크기에 따른 패딩 클래스
  const paddingClass = screenSize === ScreenSize.SMALL ? 'px-3 py-1.5' : 'px-4 py-2';

  // 배경색 결정: timerIsPlaying이 false면 light gray, true면 red-orange-300
  const backgroundColor = timerIsPlaying ? '#ffa09e' : '#DBDBDB'; // lightgray from tailwind config

  // 시간 포맷팅
  const { hours, minutes, seconds } = formatElapsedTime(elapsedTime);
  const colonStyle = timerIsPlaying && !showColon ? timeDisplayStyles.colonHidden : undefined;

  return (
    <Pressable
      onPress={onPress}
      className={`items-center justify-center ${getGapClass(screenSize)} ${paddingClass} relative`}
      onLayout={onLayout}
    >
      {/* 배경 - SVG path로 깎인 모양 구현 */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <View className="absolute inset-0">
          <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Path
              d={`M ${cornerX},0 L ${100 - cornerX},0 L 100,${cornerY} L 100,${100 - cornerY} L ${100 - cornerX},100 L ${cornerX},100 L 0,${100 - cornerY} L 0,${cornerY} Z`}
              fill={backgroundColor}
            />
          </Svg>
        </View>
      )}
      <Text style={timeDisplayStyles.dseg7Bold} className={`${getTimeDisplayTextClass(screenSize)} relative z-10`}>
        {hours}
        <Text style={colonStyle}>:</Text>
        {minutes}
        <Text style={colonStyle}>:</Text>
        {seconds}
      </Text>
    </Pressable>
  );
};

export default TimeDisplay;

