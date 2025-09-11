// src/components/counter/CounterDirection.tsx
import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Way } from '@storage/types';
import { Images } from '@assets/images';

interface CounterDirectionProps {
  activateMode: 'inactive' | 'auto';
  way: Way;
  imageWidth: number;
  imageHeight: number;
  onToggleWay: () => void;
}

/**
 * 카운터 방향 표시 컴포넌트
 * 활성화 모드에 따라 방향을 표시하고 토글할 수 있습니다.
 */
const CounterDirection: React.FC<CounterDirectionProps> = ({
  activateMode,
  way,
  imageWidth,
  imageHeight,
  onToggleWay,
}) => {
  return (
    <View className="mb-2" style={{ height: imageHeight }}>
      {activateMode !== 'inactive' && (
        <Pressable onPress={onToggleWay}>
          <Image
            source={way === 'front' ? Images.way_front : Images.way_back}
            style={{ width: imageWidth, height: imageHeight, resizeMode: 'contain' }}
          />
        </Pressable>
      )}
    </View>
  );
};

export default CounterDirection;
