# Custom Hooks

화면별 비즈니스 로직을 캡슐화한 커스텀 훅들입니다.

## useItemList

**용도:** Main과 ProjectDetail의 공통 아이템 목록 관리 로직
**사용 스크린:** useMain, useProjectDetail 내부에서 사용

```tsx
const {
  items,
  project,
  isEditMode,
  modalVisible,
  deleteModalVisible,
  itemToDelete,
  duplicateModalVisible,
  pendingItem,
  setItems,
  setIsEditMode,
  setModalVisible,
  setDeleteModalVisible,
  setItemToDelete,
  setDuplicateModalVisible,
  setPendingItem,
  handlePress,
  handleLongPress,
  handleDelete,
  resetModalState,
  resetDeleteModalState,
  resetDuplicateModalState,
} = useItemList({ projectId, headerSetup: () => {} });
```

## useMain

**용도:** Main 화면의 프로젝트/카운터 생성 및 관리 로직
**사용 스크린:** Main

```tsx
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
```

## useProjectDetail

**용도:** ProjectDetail 화면의 카운터 생성 및 관리 로직
**사용 스크린:** ProjectDetail

```tsx
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
```

## useCounter

**용도:** CounterDetail 화면의 카운터 증감 및 설정 관리 로직
**사용 스크린:** CounterDetail

```tsx
const {
  counter,
  activateMode,
  way,
  currentCount,
  activeModal,
  errorModalVisible,
  errorMessage,
  handleAdd,
  handleSubtract,
  handleEditOpen,
  handleEditConfirm,
  handleResetConfirm,
  handleClose,
  cycleActivateMode,
  toggleWay,
  showErrorModal,
} = useCounter();
```
