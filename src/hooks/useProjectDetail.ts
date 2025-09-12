import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import { getHeaderRightWithInfoEditAndSettings } from '@navigation/HeaderOptions';

import { Counter, Project } from '@storage/types';
import { addItem, removeCounterFromProject, updateItem, getStoredItems } from '@storage/storage';
import { useItemList } from './useItemList';

/**
 * ProjectDetail 화면 전용 훅
 */
export const useProjectDetail = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ProjectDetail'>>();
  const { projectId } = route.params;

  // useItemList 훅 사용
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
    setDuplicateModalVisible,
    setPendingItem,
    handlePress,
    handleLongPress,
    handleDelete,
    resetModalState,
    resetDeleteModalState,
    resetDuplicateModalState,
  } = useItemList({ 
    projectId, 
    headerSetup: () => {
      navigation.setOptions({
        title: project?.title ?? '',
        headerRight: () =>
          getHeaderRightWithInfoEditAndSettings(
            navigation,
            () => navigation.navigate('InfoScreen', { itemId: project?.id ?? '' }),
            () => setIsEditMode((prev) => !prev)
          ),
      });
    }
  });

  /**
   * 새 카운터 생성 함수
   */
  const createNewCounter = useCallback((title: string): Counter => {
    const timestamp = Date.now();
    return {
      id: `counter_${timestamp}`,
      type: 'counter',
      title,
      count: 0,
      parentProjectId: project?.id ?? '',
    };
  }, [project?.id]);

  /**
   * 프로젝트 내에서 중복 이름 체크 함수
   */
  const checkDuplicateName = useCallback((newCounter: Counter): boolean => {
    const allItems = getStoredItems();
    const sameProjectCounters = allItems.filter(
      (item): item is Counter =>
        item.type === 'counter' &&
        item.parentProjectId === project?.id
    );

    return sameProjectCounters.some(
      (counter) => counter.title === newCounter.title
    );
  }, [project?.id]);

  /**
   * 카운터 추가 처리 (실제 저장 및 상태 업데이트)
   */
  const proceedAddCounter = useCallback((newCounter: Counter) => {
    addItem(newCounter);

    const updatedProject: Partial<Project> = {
      counterIds: [newCounter.id, ...(project?.counterIds ?? [])],
    };

    if (project) {
      updateItem(project.id, updatedProject);
    }

    setItems((prev) => [newCounter, ...prev]);
    resetModalState();
  }, [project, setItems, resetModalState]);

  /**
   * 모달에서 확인 시 카운터 생성 및 중복 체크
   */
  const handleModalConfirm = useCallback((name?: string) => {
    if (!name?.trim()) {
      return;
    }

    const newCounter = createNewCounter(name);

    if (checkDuplicateName(newCounter)) {
      setPendingItem(newCounter);
      setDuplicateModalVisible(true);
      return;
    }

    proceedAddCounter(newCounter);
  }, [createNewCounter, checkDuplicateName, proceedAddCounter, setPendingItem, setDuplicateModalVisible]);

  /**
   * 삭제 확인 시 실제 삭제 처리
   */
  const handleDeleteConfirm = useCallback(() => {
    if (!itemToDelete || itemToDelete.type !== 'counter') {
      return;
    }

    if (project) {
      removeCounterFromProject(project.id, itemToDelete.id);
    }

    setItems(prev => prev.filter(i => i.id !== itemToDelete.id));
    resetDeleteModalState();
  }, [itemToDelete, project, setItems, resetDeleteModalState]);

  return {
    // 상태
    items,
    project,
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
    handleModalConfirm,
    handleDeleteConfirm,
    resetModalState,
    resetDeleteModalState,
    resetDuplicateModalState,
    proceedAddCounter,
  };
};
