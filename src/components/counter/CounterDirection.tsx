// src/components/counter/CounterDirection.tsx
import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Way } from '@storage/types';
import { Images } from '@assets/images';
import { ScreenSize, getGapClass } from '@constants/screenSizeConfig';

interface CounterDirectionProps {
  mascotIsActive: boolean;
  wayIsChange: boolean;
  way: Way;
  imageWidth: number;
  imageHeight: number;
  screenSize: ScreenSize;
  onToggleWay: () => void;
}

/**
 * 카운터 방향 표시 컴포넌트
 * mascotIsActive가 true일 때만 표시되고, wayIsChange가 true일 때만 클릭으로 방향 토글 가능합니다.
 */
const CounterDirection: React.FC<CounterDirectionProps> = ({
  mascotIsActive,
  wayIsChange,
  way,
  imageWidth,
  imageHeight,
  screenSize,
  onToggleWay,
}) => {
  if (!mascotIsActive) {
    return null;
  }

  return (
    <View className={getGapClass(screenSize)} style={{ height: imageHeight }}>
      <Pressable onPress={wayIsChange ? onToggleWay : undefined}>
        <Image
          source={
            wayIsChange
              ? way === 'front'
                ? Images.way_front
                : Images.way_back
              : Images.way_plain
          }
          style={{ width: imageWidth, height: imageHeight, resizeMode: 'contain' }}
        />
      </Pressable>
    </View>
  );
};

export default CounterDirection;
