// src/components/counter/CounterModals.tsx
import React from 'react';
import { ConfirmModal, CounterEditModal } from '@components/common/modals';

interface CounterModalsProps {
  activeModal: 'reset' | 'edit' | 'limit' | null;
  errorModalVisible: boolean;
  errorMessage: string;
  currentCount: string;
  onClose: () => void;
  onEditConfirm: (value: string) => void;
  onResetConfirm: () => void;
  onErrorModalClose: () => void;
}

/**
 * 카운터 모달들을 묶은 컴포넌트
 * 초기화, 편집, 범위 초과, 에러 모달을 관리합니다.
 */
const CounterModals: React.FC<CounterModalsProps> = ({
  activeModal,
  errorModalVisible,
  errorMessage,
  currentCount,
  onClose,
  onEditConfirm,
  onResetConfirm,
  onErrorModalClose,
}) => {
  return (
    <>
      {/* 초기화 확인 모달 */}
      <ConfirmModal
        visible={activeModal === 'reset'}
        onClose={onClose}
        title="숫자 초기화"
        description="숫자를 0으로 초기화하시겠습니까?"
        onConfirm={onResetConfirm}
        confirmText="초기화"
        cancelText="취소"
        confirmButtonStyle="danger"
      />

      {/* 카운트 편집 모달 */}
      <CounterEditModal
        visible={activeModal === 'edit'}
        onClose={onClose}
        onConfirm={onEditConfirm}
        initialValue={currentCount}
        title="카운트 편집"
      />

      {/* 범위 초과 경고 모달 */}
      <ConfirmModal
        visible={activeModal === 'limit'}
        onClose={onClose}
        title="범위 초과 안내"
        description="카운터에는 0에서 9999 사이의 값만 입력할 수 있습니다."
        onConfirm={onClose}
        confirmText="확인"
        cancelText=""
        confirmButtonStyle="primary"
      />

      {/* 에러 모달 */}
      <ConfirmModal
        visible={errorModalVisible}
        onClose={onErrorModalClose}
        title="오류"
        description={errorMessage}
        onConfirm={onErrorModalClose}
        confirmText="확인"
        cancelText=""
        confirmButtonStyle="primary"
      />
    </>
  );
};

export default CounterModals;
