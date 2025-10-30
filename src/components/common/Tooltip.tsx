import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface TooltipProps {
  text?: string;
  children?: React.ReactNode;
  maxWidth?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, maxWidth }) => {
  return (
    <View pointerEvents="none">
      <View style={{ width: '100%', position: 'relative', alignItems: 'flex-start' }}>
        {/* 위쪽 삼각형 화살표 (SVG로 꼭짓점 자체를 둥글게) */}
        <Svg
          width={12}
          height={20}
          style={{ position: 'absolute', left: '30%', top: -8, transform: [{ translateX: -6 }] }}
        >
          {/* 더 둥근 꼭짓점: 양쪽에서 더 아래로 진입시키고, 제어점을 더 위로 올림 */}
          <Path d="M0 20 L5 5 Q6 4 7 5 L12 20 Z" fill="rgba(0,0,0,0.6)" />
        </Svg>
        <View
          className="px-2 py-3 rounded-md bg-black/60"
          style={maxWidth ? { maxWidth, marginTop: 12 } : { marginTop: 12 }}
        >
          {text ? (
            <Text className="text-white text-xs">{text}</Text>
          ) : (
            children
          )}
        </View>
      </View>
    </View>
  );
};

export default Tooltip;


