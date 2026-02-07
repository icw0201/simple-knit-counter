// src/components/counter/ColorPicker.tsx
import React, { useState } from 'react';
import { Pressable, View, Modal, Text } from 'react-native';
import ColorPickerIcon from '@assets/images/color_picker.svg';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

interface ColorPickerProps {
  selectedColor?: string; // hex 색상 값 (예: '#fc3e39')
  onSelect: (color: string) => void; // hex 색상 값을 반환
}

/**
 * 컬러 픽커 컴포넌트
 * 클릭 가능한 컬러 픽커 아이콘 버튼 + reanimated-color-picker 모달
 */
const ColorPickerComponent: React.FC<ColorPickerProps> = ({
  selectedColor,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleSelectColor = ({ hex }: { hex: string }) => {
    onSelect(hex);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const initialColor = selectedColor ?? '#fc3e39';

  return (
    <>
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

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={handleClose}
        >
          <Pressable
            className="bg-white rounded-2xl p-4 m-4 w-[85%] max-w-[320px]"
            onPress={(e) => e.stopPropagation()}
          >
            {/* reanimated-color-picker는 style prop 필요 */}
            <ColorPicker
              value={initialColor}
              style={{ width: '100%' }} // eslint-disable-line react-native/no-inline-styles
              onCompleteJS={handleSelectColor}
            >
              <Preview />
              <Panel1 />
              <HueSlider />
              <OpacitySlider />
              <Swatches />
            </ColorPicker>
            <Pressable
              onPress={handleClose}
              className="mt-4 py-3 rounded-xl bg-red-orange-500 items-center"
            >
              <Text className="text-base font-extrabold text-white">확인</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default ColorPickerComponent;
