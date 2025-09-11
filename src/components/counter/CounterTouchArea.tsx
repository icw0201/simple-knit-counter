// src/components/counter/CounterTouchArea.tsx
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

interface CounterTouchAreaProps {
  onAdd: () => void;
  onSubtract: () => void;
}

/**
 * 카운터 터치 영역 컴포넌트
 * 좌우 터치로 숫자 증가/감소를 처리합니다.
 */
const CounterTouchArea: React.FC<CounterTouchAreaProps> = ({
  onAdd,
  onSubtract,
}) => {
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 flex-row">
      {/* 왼쪽 터치 영역 (감소) */}
      <Pressable
        className={`flex-1 items-start justify-center ${leftPressed ? 'bg-gray-100' : 'bg-white'}`}
        onPress={() => {
          setLeftPressed(true);
          onSubtract();
          setTimeout(() => setLeftPressed(false), 100);
        }}
      >
        <Text className="text-6xl text-red-500 ml-6">-</Text>
      </Pressable>

      {/* 오른쪽 터치 영역 (증가) */}
      <Pressable
        className={`flex-1 items-end justify-center ${rightPressed ? 'bg-red-200' : 'bg-red-100'}`}
        onPress={() => {
          setRightPressed(true);
          onAdd();
          setTimeout(() => setRightPressed(false), 100);
        }}
      >
        <Text className="text-6xl text-red-500 mr-6">+</Text>
      </Pressable>
    </View>
  );
};

export default CounterTouchArea;
