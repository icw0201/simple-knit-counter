// src/components/counter/CounterTouchArea.tsx
import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';

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
      {/* 왼쪽 터치 영역 (감소) - 37% */}
      <Pressable
        className={`items-start justify-center ${leftPressed ? 'bg-gray-100' : 'bg-white'}`}
        style={{ width: '37%' }}
        onPress={() => {
          setLeftPressed(true);
          onSubtract();
          setTimeout(() => setLeftPressed(false), 100);
        }}
      >
        <Minus
          size={60}
          color="#fc3e39"
          strokeWidth={2}
          className="ml-3"
        />
      </Pressable>

      {/* 오른쪽 터치 영역 (증가) - 63% */}
      <Pressable
        className={`items-end justify-center ${rightPressed ? 'bg-red-200' : 'bg-red-100'}`}
        style={{ width: '63%' }}
        onPress={() => {
          setRightPressed(true);
          onAdd();
          setTimeout(() => setRightPressed(false), 100);
        }}
      >
        <Plus
          size={60}
          color="#fc3e39"
          strokeWidth={2}
          className="mr-3"
        />
      </Pressable>
    </View>
  );
};

export default CounterTouchArea;
