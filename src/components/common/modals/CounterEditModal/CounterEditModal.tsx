// src/components/common/modals/CounterEditModal/CounterEditModal.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { BaseModal } from '../BaseModal';
import TextInputBox from '@components/common/TextInputBox';
import RoundedBox from '@components/common/RoundedBox';

/**
 * CounterEditModal 컴포넌트의 Props 인터페이스
 * @param visible - 모달 표시 여부
 * @param onClose - 모달 닫기 콜백 함수
 * @param onConfirm - 편집 확인 시 콜백 함수
 * @param initialValue - 초기 카운트 값
 * @param title - 모달 제목 (기본값: '카운트 편집')
 */
interface CounterEditModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  initialValue?: string;
  title?: string;
}

/**
 * 카운트 편집 모달 컴포넌트
 * 카운트 값을 편집할 때 사용하는 모달입니다.
 */
const CounterEditModal: React.FC<CounterEditModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialValue = '',
  title = '카운트 편집',
}) => {
  const [textValue, setTextValue] = useState(initialValue);

  // 모달이 열릴 때마다 초기값으로 설정
  useEffect(() => {
    if (visible) {
      setTextValue(initialValue);
    }
  }, [visible, initialValue]);

  const handleConfirm = () => {
    if (textValue.trim()) {
      onConfirm(textValue.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setTextValue(initialValue);
    onClose();
  };

  return (
    <BaseModal
      visible={visible}
      onClose={handleClose}
      title={title}
    >
      {/* 입력 필드 섹션 */}
      <TextInputBox
        label="카운트"
        value={textValue}
        onChangeText={setTextValue}
        placeholder="카운트 값을 입력하세요"
        type="number"
      />

      {/* 버튼 섹션 - 버튼 타입에 따라 다른 버튼 조합 표시 */}
      <View className="flex-row justify-evenly">
        {/* 취소 버튼 */}
        <RoundedBox
          title="취소"
          onPress={handleClose}
          isButton
          colorStyle="C"
          rounded="full"
          containerClassName="mx-1 py-3 px-8"
        />
        {/* 확인 버튼 */}
        <RoundedBox
          title="확인"
          onPress={handleConfirm}
          isButton
          colorStyle="E"
          rounded="full"
          containerClassName="mx-1 py-3 px-8"
        />
      </View>
    </BaseModal>
  );
};

export default CounterEditModal;
