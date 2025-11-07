import React, { useState } from 'react';
import { Text, View, LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ScreenSize, getTimeDisplayTextClass } from '@constants/screenSizeConfig';
import { timeDisplayStyles } from './TimeDisplayStyles';

interface TimeDisplayProps {
  screenSize: ScreenSize;
}

/**
 * 시간 표시 컴포넌트
 * DSEG7Classic 폰트를 사용하여 시간을 표시합니다.
 */
const TimeDisplay: React.FC<TimeDisplayProps> = ({ screenSize }) => {
  // 깎인 모서리 크기 (픽셀 단위)
  const cornerSize = 8;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

  return (
    <View
      className={`items-center justify-center mb-2 ${paddingClass} relative -mt-14`}
      onLayout={onLayout}
    >
      {/* 배경 - SVG path로 깎인 모양 구현 */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <View className="absolute inset-0">
          <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Path
              d={`M ${cornerX},0 L ${100 - cornerX},0 L 100,${cornerY} L 100,${100 - cornerY} L ${100 - cornerX},100 L ${cornerX},100 L 0,${100 - cornerY} L 0,${cornerY} Z`}
              fill="#ffa09e"
            />
          </Svg>
        </View>
      )}
      <Text style={timeDisplayStyles.dseg7Bold} className={`${getTimeDisplayTextClass(screenSize)} relative z-10`}>
        88:88:88
      </Text>
    </View>
  );
};

export default TimeDisplay;

