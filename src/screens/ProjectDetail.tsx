// src/screens/ProjectDetail.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ItemRow, FloatingAddButton, ItemModals } from '@components/list';
import { useProjectDetail } from '@hooks/useProjectDetail';
import { Counter } from '@storage/types';

const ProjectDetail = () => {
  const insets = useSafeAreaInsets();
  // useProjectDetail 훅 사용
  const {
    items,
    isEditMode,
    modalVisible,
    deleteModalVisible,
    itemToDelete,
    duplicateModalVisible,
    pendingItem,
    setModalVisible,
    handlePress,
    handleLongPress,
    handleDelete,
    handleCreateCounterConfirm,
    handleDeleteConfirm,
    resetModalState,
    resetDeleteModalState,
    resetDuplicateModalState,
    completeCounterCreation,
  } = useProjectDetail();


  return (
    <SafeAreaView style={{ flex: 1 }} className={isEditMode ? 'bg-red-orange-400' : undefined} edges={['left', 'right', 'bottom']}>
      {/* 카운터 목록 스크롤뷰 */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} className="p-4">
        {items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            isEditMode={isEditMode}
            onPress={handlePress}
            onLongPress={handleLongPress}
            onDelete={handleDelete}
          />
        ))}
      </ScrollView>

      {/* 플로팅 추가 버튼 */}
      <FloatingAddButton
        onPress={() => setModalVisible(true)}
        bottom={insets.bottom}
      />

      {/* 모든 모달들 */}
      <ItemModals
        modalType="project"
        createCounterModalVisible={modalVisible}
        onCreateCounterModalClose={resetModalState}
        onCreateCounterModalConfirm={(name) => handleCreateCounterConfirm(name)}
        deleteModalVisible={deleteModalVisible}
        onDeleteModalClose={resetDeleteModalState}
        onDeleteConfirm={handleDeleteConfirm}
        deleteDescription={`"${itemToDelete?.title}" 카운터를 삭제하시겠습니까?`}
        duplicateModalVisible={duplicateModalVisible}
        onDuplicateModalClose={() => {
          resetDuplicateModalState();
        }}
        onDuplicateConfirm={() => {
          if (pendingItem) {
            completeCounterCreation(pendingItem as Counter);
          }
        }}
        duplicateDescription="같은 이름의 카운터가 이미 존재합니다. 생성하시겠습니까?"
      />
    </SafeAreaView>
  );
};

export default ProjectDetail;
