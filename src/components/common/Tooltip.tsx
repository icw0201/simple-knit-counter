import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface TooltipProps {
  text?: string;
  children?: React.ReactNode;
  containerClassName?: string;
  containerStyle?: any;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, containerClassName, containerStyle }) => {
  return (
    <View pointerEvents="none" className={containerClassName} style={containerStyle}>
      <View style={{ width: '100%', position: 'relative', alignItems: 'flex-start' }}>
        {/* 위쪽 삼각형 화살표 (SVG로 꼭짓점 자체를 둥글게) */}
        <Svg
          width={12}
          height={20}
          style={{ position: 'absolute', left: '15%', top: -8, transform: [{ translateX: -6 }] }}
        >
          {/* 더 둥근 꼭짓점: 양쪽에서 더 아래로 진입시키고, 제어점을 더 위로 올림 */}
          <Path d="M0 20 L5 5 Q6 4 7 5 L12 20 Z" fill="rgba(0,0,0,0.6)" />
        </Svg>
        <View
          className="px-2 py-3 rounded-md bg-black/60"
          style={{ marginTop: 12, maxWidth: 240 }}
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


