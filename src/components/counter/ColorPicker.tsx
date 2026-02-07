// src/components/counter/ColorPicker.tsx
import React from 'react';
import { Pressable, View } from 'react-native';
import ColorPickerIcon from '@assets/images/color_picker.svg';

interface ColorPickerProps {
  selectedColor?: string; // hex 색상 값 (예: '#fc3e39')
  onSelect: (color: string) => void; // hex 색상 값을 반환 (TODO: 컬러 픽커 라이브러리 추가 시 사용)
}

/**
 * 컬러 픽커 컴포넌트
 * 클릭 가능한 컬러 픽커 아이콘 버튼
 */
const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onSelect: _onSelect, // TODO: 컬러 픽커 라이브러리 추가 시 사용
}) => {
  const handlePress = () => {
    // TODO: 컬러 픽커 라이브러리 추가 시 onSelect 호출
  };

  return (
    <Pressable
      onPress={handlePress}
      className="w-8 h-8 justify-center items-center"
    >
      {selectedColor ? (
        <View
          className="w-6 h-6 rounded border border-lightgray"
          style={{ backgroundColor: selectedColor }}
        />
      ) : (
        <ColorPickerIcon width={24} height={24} />
      )}
    </Pressable>
  );
};

export default ColorPicker;
