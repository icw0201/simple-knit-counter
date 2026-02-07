// src/components/counter/ColorPicker.tsx
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import ColorPickerIcon from '@assets/images/color_picker.svg';
import ColorPicker, { Panel1, Swatches, HueSlider } from 'reanimated-color-picker';
import { RED_ORANGE_SWATCHES } from '@constants/colors';
import RoundedButton from '@components/common/RoundedButton';
import BaseModal from '@components/common/modals/BaseModal/BaseModal';

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
  const [pendingColor, setPendingColor] = useState(selectedColor ?? '#fc3e39');

  const initialColor = selectedColor ?? '#fc3e39';

  const handlePress = () => {
    setPendingColor(initialColor);
    setModalVisible(true);
  };

  const handleColorChange = ({ hex }: { hex: string }) => {
    setPendingColor(hex);
  };

  const handleConfirm = () => {
    onSelect(pendingColor);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        className="w-8 h-8 justify-center items-center"
      >
        <ColorPickerIcon
          width={24}
          height={24}
          color={selectedColor ?? '#fc3e39'}
        />
      </Pressable>

      {/* 색상 선택 모달 */}
      <BaseModal
        visible={modalVisible}
        onClose={handleCancel}
        title="색상 선택"
      >
        <View className="pb-2">
          {/* reanimated-color-picker는 style prop 필요 */}
          <ColorPicker
            value={pendingColor}
            style={{ width: '100%' }} // eslint-disable-line react-native/no-inline-styles
            onCompleteJS={handleColorChange}
            onChangeJS={handleColorChange}
          >
            <Panel1 />
            <View className="h-3" />
            <HueSlider />
            <View className="h-4" />
            <View>
              <Swatches colors={RED_ORANGE_SWATCHES.slice(0, 5)} />
              <View className="h-2" />
              <Swatches colors={RED_ORANGE_SWATCHES.slice(5, 10)} />
            </View>
          </ColorPicker>
          <View className="mt-4 flex-row justify-evenly">
            <RoundedButton
              title="취소"
              colorStyle="light"
              onPress={handleCancel}
            />
            <RoundedButton
              title="확인"
              colorStyle="vivid"
              onPress={handleConfirm}
            />
          </View>
        </View>
      </BaseModal>
    </>
  );
};

export default ColorPickerComponent;
