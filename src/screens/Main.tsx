// src/screens/Main.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ItemRow, FloatingAddButton, ItemModals } from '@components/list';
import { useMain } from '@hooks/useMain';

const Main = () => {
  const insets = useSafeAreaInsets();
  // useMain 훅 사용
  const {
    items,
    isEditMode,
    modalVisible,
    deleteModalVisible,
    duplicateModalVisible,
    pendingItem,
    setModalVisible,
    handlePress,
    handleLongPress,
    handleDelete,
    handleCreateItemConfirm,
    handleDeleteConfirm,
    resetModalState,
    resetDeleteModalState,
    resetDuplicateModalState,
    completeItemCreation,
    getDeleteDescription,
  } = useMain();


  return (
    <SafeAreaView style={{ flex: 1 }} className={isEditMode ? 'bg-red-orange-400' : undefined} edges={['left', 'right', 'bottom']}>
      {/* 아이템 목록 스크롤뷰 */}
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
        modalType="main"
        createItemModalVisible={modalVisible}
        onCreateItemModalClose={resetModalState}
        onCreateItemModalConfirm={handleCreateItemConfirm}
        deleteModalVisible={deleteModalVisible}
        onDeleteModalClose={resetDeleteModalState}
        onDeleteConfirm={handleDeleteConfirm}
        deleteDescription={getDeleteDescription()}
        duplicateModalVisible={duplicateModalVisible}
        onDuplicateModalClose={() => {
          resetDuplicateModalState();
        }}
        onDuplicateConfirm={() => {
          if (pendingItem) {
            completeItemCreation(pendingItem);
          }
        }}
        duplicateDescription={`같은 이름을 가진 ${pendingItem?.type === 'project' ? '프로젝트' : '카운터'}가 이미 존재합니다. 생성하시겠습니까?`}
      />
    </SafeAreaView>
  );
};

export default Main;
