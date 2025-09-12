# List Components

Main과 ProjectDetail 화면에서 공통으로 사용되는 목록 관련 컴포넌트들입니다.

## ItemRow

**용도:** 개별 아이템(프로젝트/카운터) 행을 표시하고 편집 모드에서 삭제 기능 제공
**사용 스크린:** Main, ProjectDetail

```tsx
<ItemRow
  item={item}
  isEditMode={isEditMode}
  onPress={handlePress}
  onLongPress={handleLongPress}
  onDelete={handleDelete}
/>
```

## FloatingAddButton

**용도:** 화면 우하단에 고정된 플로팅 추가 버튼
**사용 스크린:** Main, ProjectDetail

```tsx
<FloatingAddButton
  onPress={() => setModalVisible(true)}
  bottom={insets.bottom}
/>
```

## ItemModals

**용도:** 아이템 생성/삭제/중복 확인 관련 모든 모달들을 관리
**사용 스크린:** Main, ProjectDetail

```tsx
<ItemModals
  modalType="main" // 또는 "project"
  createItemModalVisible={modalVisible}
  onCreateItemModalClose={resetModalState}
  onCreateItemModalConfirm={handleCreateItemConfirm}
  deleteModalVisible={deleteModalVisible}
  onDeleteModalClose={resetDeleteModalState}
  onDeleteConfirm={handleDeleteConfirm}
  deleteDescription={getDeleteDescription()}
  duplicateModalVisible={duplicateModalVisible}
  onDuplicateModalClose={resetDuplicateModalState}
  onDuplicateConfirm={() => completeItemCreation(pendingItem)}
  duplicateDescription="중복 이름 확인 메시지"
/>
```
