import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { getHeaderRightWithEditAndSettings } from '@navigation/HeaderOptions';

import { Item } from '@storage/types';
import { addItem, removeItem, getStoredItems } from '@storage/storage';
import { useItemList } from './useItemList';

/**
 * Main 화면 전용 훅
 */
export const useMain = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // useItemList 훅 사용
  const {
    items,
    isEditMode,
    modalVisible,
    deleteModalVisible,
    itemToDelete,
    duplicateModalVisible,
    pendingItem,
    setItems,
    setIsEditMode,
    setModalVisible,
    setDuplicateModalVisible,
    setPendingItem,
    handlePress,
    handleLongPress,
    handleDelete,
    resetModalState,
    resetDeleteModalState,
    resetDuplicateModalState,
  } = useItemList({
    headerSetup: () => {
      navigation.setOptions({
        headerRight: () =>
          getHeaderRightWithEditAndSettings(navigation, () =>
            setIsEditMode((prev) => !prev)
          ),
      });
    },
  });

  /**
   * 아이템 생성 함수
   */
  const createNewItem = useCallback((type: string, title: string): Item => {
    const timestamp = Date.now();

    if (type === 'project') {
      return {
        id: `proj_${timestamp}`,
        type: 'project',
        title,
        counterIds: [],
      };
    }

    return {
      id: `counter_${timestamp}`,
      type: 'counter',
      title,
      count: 0,
      targetCount: undefined,
      elapsedTime: undefined,
      timerIsActive: false,
      parentProjectId: null,
      subCount: 0,
      subRule: 0,
      subRuleIsActive: false,
      subModalIsOpen: false,
      // 마스코트 반복 규칙 기본값
      mascotIsActive: false,
      wayIsChange: false,
      repeatRuleIsActive: false,
      repeatRuleNumber: 0,
      repeatRuleStartNumber: 0,
      repeatRuleEndNumber: 0,
      // 구간 기록 기본값 (빈 배열)
      sectionRecords: [],
      sectionModalIsOpen: false,
    };
  }, []);

  /**
   * 중복 이름 체크 함수
   */
  const checkDuplicateName = useCallback((newItem: Item): boolean => {
    const allItems = getStoredItems();

    return allItems.some((item) =>
      item.title === newItem.title &&
      item.type === newItem.type &&
      ((item.type === 'counter' && item.parentProjectId === null) ||
       item.type === 'project')
    );
  }, []);

  /**
   * 아이템 생성 완료 처리 (실제 저장 및 상태 초기화)
   */
  const completeItemCreation = useCallback((item: Item) => {
    addItem(item);
    resetModalState();
    setItems(prev => [item, ...prev]);
  }, [resetModalState, setItems]);

  /**
   * 프로젝트/카운터 생성 모달에서 확인 시 아이템 생성 및 중복 체크
   */
  const handleCreateItemConfirm = useCallback((name: string, type: 'project' | 'counter') => {
    const newItem = createNewItem(type, name);

    if (checkDuplicateName(newItem)) {
      setPendingItem(newItem);
      setDuplicateModalVisible(true);
      return;
    }

    completeItemCreation(newItem);
  }, [createNewItem, checkDuplicateName, completeItemCreation, setPendingItem, setDuplicateModalVisible]);

  /**
   * 삭제 모달 설명 텍스트 생성
   */
  const getDeleteDescription = useCallback(() => {
    if (!itemToDelete) {
      return '';
    }

    const isProject = itemToDelete.type === 'project';
    const count = isProject ? itemToDelete.counterIds.length : 0;

    return isProject
      ? `"${itemToDelete.title}" 프로젝트를 삭제하면 하위 카운터 ${count}개도 함께 삭제됩니다. 진행하시겠습니까?`
      : `"${itemToDelete.title}" 카운터를 삭제하시겠습니까?`;
  }, [itemToDelete]);

  /**
   * 삭제 확인 시 실제 삭제 처리
   */
  const handleDeleteConfirm = useCallback(() => {
    if (!itemToDelete) {
      return;
    }

    // 프로젝트 삭제 시 하위 카운터들도 함께 삭제
    if (itemToDelete.type === 'project') {
      const { counterIds } = itemToDelete;
      counterIds.forEach((id) => removeItem(id));
    }

    removeItem(itemToDelete.id);
    resetDeleteModalState();
    setItems(prev => prev.filter(item => item.id !== itemToDelete.id));
  }, [itemToDelete, resetDeleteModalState, setItems]);

  return {
    // 상태
    items,
    isEditMode,
    modalVisible,
    deleteModalVisible,
    itemToDelete,
    duplicateModalVisible,
    pendingItem,

    // 상태 설정 함수들
    setModalVisible,

    // 액션 함수들
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
  };
};
