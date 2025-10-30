import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface TooltipProps {
  text?: string;
  children?: React.ReactNode;
  containerClassName?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, containerClassName }) => {
  const [visible, setVisible] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;
  const AUTO_HIDE_MS = 4000;
  const FADE_OUT_MS = 400;

  useEffect(() => {
    if (AUTO_HIDE_MS > 0) {
      const t = setTimeout(() => {
        // 페이드아웃: 지정 시간 동안 opacity를 1 → 0으로 감소시킵니다.
        Animated.timing(opacity, {
          toValue: 0,
          duration: FADE_OUT_MS,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            setVisible(false);
          }
        });
      }, AUTO_HIDE_MS);
      return () => clearTimeout(t);
    }
  }, [AUTO_HIDE_MS, FADE_OUT_MS, opacity]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View pointerEvents="none" className={containerClassName} style={{ opacity }}>
      <View className="relative self-center">
        <View className="relative">
          {/* 위쪽 삼각형 화살표 (SVG로 꼭짓점 자체를 둥글게) - 바로 아래 박스의 정확한 중앙에 정렬 */}
          <Svg
            width={12}
            height={20}
            style={{ position: 'absolute', left: '50%', top: -8, transform: [{ translateX: -6 }] }}
          >
            <Path d="M0 20 L5 5 Q6 4 7 5 L12 20 Z" fill="rgba(0,0,0,0.6)" />
          </Svg>
          <View
            className="px-2 py-3 rounded-md bg-black/60 mt-3"
            style={{ maxWidth: 240 }}
          >
            {text ? (
              <Text className="text-white text-xs text-center">{text}</Text>
            ) : (
              children
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default Tooltip;


