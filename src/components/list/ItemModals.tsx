import React from 'react';
import { ProjectCreateModal, CounterCreateModal, ConfirmModal } from '@components/common/modals';

interface ItemModalsProps {
  // Main 화면용 props
  createItemModalVisible?: boolean;
  onCreateItemModalClose?: () => void;
  onCreateItemModalConfirm?: (name: string, type: 'project' | 'counter') => void;

  // ProjectDetail 화면용 props
  createCounterModalVisible?: boolean;
  onCreateCounterModalClose?: () => void;
  onCreateCounterModalConfirm?: (name?: string) => void;

  // 공통 props
  deleteModalVisible: boolean;
  onDeleteModalClose: () => void;
  onDeleteConfirm: () => void;
  deleteDescription: string;

  duplicateModalVisible: boolean;
  onDuplicateModalClose: () => void;
  onDuplicateConfirm: () => void;
  duplicateDescription: string;

  // 모달 타입 구분
  modalType: 'main' | 'project';
}

/**
 * 아이템 관련 모달들을 관리하는 컴포넌트
 *
 * Main과 ProjectDetail에서 공통으로 사용되는 모달 로직
 */
const ItemModals: React.FC<ItemModalsProps> = ({
  // Main 화면용 props
  createItemModalVisible = false,
  onCreateItemModalClose,
  onCreateItemModalConfirm,

  // ProjectDetail 화면용 props
  createCounterModalVisible = false,
  onCreateCounterModalClose,
  onCreateCounterModalConfirm,

  // 공통 props
  deleteModalVisible,
  onDeleteModalClose,
  onDeleteConfirm,
  deleteDescription,

  duplicateModalVisible,
  onDuplicateModalClose,
  onDuplicateConfirm,
  duplicateDescription,

  modalType,
}) => {
  return (
    <>
      {/* Main 화면용 프로젝트/카운터 생성 모달 */}
      {modalType === 'main' && (
        <ProjectCreateModal
          visible={createItemModalVisible}
          onClose={onCreateItemModalClose || (() => {})}
          onConfirm={onCreateItemModalConfirm || (() => {})}
        />
      )}

      {/* ProjectDetail 화면용 카운터 생성 모달 */}
      {modalType === 'project' && (
        <CounterCreateModal
          visible={createCounterModalVisible}
          onClose={onCreateCounterModalClose || (() => {})}
          title="새 카운터 생성하기"
          onConfirm={onCreateCounterModalConfirm || (() => {})}
        />
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        visible={deleteModalVisible}
        onClose={onDeleteModalClose}
        title="삭제"
        description={deleteDescription}
        onConfirm={onDeleteConfirm}
        confirmText="삭제"
        cancelText="취소"
        confirmButtonStyle="danger"
      />

      {/* 중복 이름 확인 모달 */}
      <ConfirmModal
        visible={duplicateModalVisible}
        onClose={onDuplicateModalClose}
        title="중복 이름"
        description={duplicateDescription}
        onConfirm={onDuplicateConfirm}
        confirmText="생성"
        cancelText="취소"
        confirmButtonStyle="primary"
      />
    </>
  );
};

export default ItemModals;
