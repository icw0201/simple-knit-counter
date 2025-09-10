// src/components/common/modals/ConfirmModal/ConfirmModal.tsx
import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import RoundedBox from '@components/common/RoundedBox';
import { modalStyles } from '@styles/modalStyle';

/**
 * ConfirmModal 컴포넌트의 Props 인터페이스
 * @param visible - 모달 표시 여부
 * @param onClose - 모달 닫기 콜백 함수
 * @param title - 모달 제목
 * @param description - 모달 설명
 * @param onConfirm - 확인 버튼 클릭 시 콜백 함수
 * @param confirmText - 확인 버튼 텍스트 (기본값: '확인')
 * @param cancelText - 취소 버튼 텍스트 (기본값: '취소')
 * @param confirmButtonStyle - 확인 버튼 스타일 (기본값: 'danger')
 */
interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonStyle?: 'danger' | 'primary';
}

/**
 * 확인/취소 모달 컴포넌트
 * 사용자에게 확인을 받을 때 사용하는 모달입니다.
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = '확인',
  cancelText = '취소',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}} // 뒤로가기 버튼 비활성화
    >
      {/* 모달 배경 오버레이 - 클릭 비활성화 */}
      <Pressable style={[modalStyles.overlay, { zIndex: 1000 }]}>
        {/* 모달 컨테이너 - 배경 클릭 이벤트 전파 방지 */}
        <Pressable style={modalStyles.container} onPress={(e) => e.stopPropagation()}>
          {/* 모달 제목 */}
          <Text style={modalStyles.title}>{title}</Text>

          {/* 모달 설명 - 줄바꿈 지원 */}
          <Text style={modalStyles.description}>
            {description.split('\n').map((line, index) => (
              <Text key={index}>
                {line}
                {'\n'}
              </Text>
            ))}
          </Text>

          {/* 버튼 섹션 - 버튼 타입에 따라 다른 버튼 조합 표시 */}
          <View className="flex-row justify-evenly">
            {/* 취소 버튼 */}
            {cancelText && (
              <RoundedBox
                title={cancelText}
                onPress={onClose}
                isButton
                colorStyle="C"
                rounded="full"
                containerClassName="mx-1 py-3 px-8"
              />
            )}
            {/* 확인 버튼 */}
            <RoundedBox
              title={confirmText}
              onPress={handleConfirm}
              isButton
              colorStyle="E"
              rounded="full"
              containerClassName="mx-1 py-3 px-8"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmModal;
