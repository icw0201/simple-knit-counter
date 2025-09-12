import React from 'react';
import { View, Text } from 'react-native';
import { SlideModal } from '../common/modals/SlideModal/SlideModal';

// ===== 타입 정의 =====
interface SubCounterModalProps {
  onClose: () => void;
}

// ===== 메인 컴포넌트 =====
export const SubCounterModal: React.FC<SubCounterModalProps> = ({
  onClose,
}) => {
  return (
    <SlideModal
      height={200}
      handleWidth={30}
      backgroundColor="white"
      padding={24}
      top="80%"
      onClose={onClose}
    >
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-gray-800">
          서브 모달입니다.
        </Text>
      </View>
    </SlideModal>
  );
};

export default SubCounterModal;
