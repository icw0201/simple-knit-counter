// src/screens/Main.tsx
import React, { useState, useCallback, useLayoutEffect, useEffect } from 'react';
import { ScrollView, View, BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import RoundedBox from '@components/common/RoundedBox';
import CircleIcon from '@components/common/CircleIcon';
import { ProjectCreateModal, ConfirmModal } from '@components/common/modals';
import { getHeaderRightWithEditAndSettings } from '@navigation/HeaderOptions';

import { Item } from '@storage/types';
import { getStoredItems, addItem, removeItem, getAllProjects, getIndependentCounters } from '@storage/storage';

// 상수 정의 (ProjectCreateModal에서 사용)

const Main = () => {
  // 네비게이션 객체
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  // 상태 정의
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);
  const [pendingItem, setPendingItem] = useState<Item | null>(null);

  /**
   * 저장된 아이템(프로젝트, 카운터) 불러와서 정렬 후 상태에 저장
   */
  const fetchItems = useCallback(() => {
    const projects = getAllProjects();
    const independentCounters = getIndependentCounters();

    const filtered = [...projects, ...independentCounters].sort((a, b) => {
      const aTime = parseInt(a.id.split('_')[1], 10);
      const bTime = parseInt(b.id.split('_')[1], 10);
      return bTime - aTime;
    });

    setItems(filtered);
  }, []);

  /**
   * 아이템 생성 함수
   */
  const createNewItem = (type: string, title: string): Item => {
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
      parentProjectId: null,
    };
  };

  /**
   * 중복 이름 체크 함수
   */
  const checkDuplicateName = (newItem: Item): boolean => {
    const allItems = getStoredItems();

    return allItems.some((item) =>
      item.title === newItem.title &&
      item.type === newItem.type &&
      ((item.type === 'counter' && item.parentProjectId === null) ||
       item.type === 'project')
    );
  };

  /**
   * 모달 상태 초기화 함수
   */
  const resetModalState = () => {
    setModalVisible(false);
  };

  /**
   * 삭제 모달 상태 초기화 함수
   */
  const resetDeleteModalState = () => {
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  /**
   * 중복 모달 상태 초기화 함수
   */
  const resetDuplicateModalState = () => {
    setDuplicateModalVisible(false);
    setPendingItem(null);
  };

  // 화면이 포커스될 때마다 아이템 목록 새로고침
  useFocusEffect(useCallback(() => {
    fetchItems();
  }, [fetchItems]));

  // 헤더에 편집/설정 버튼 세팅
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        getHeaderRightWithEditAndSettings(navigation, () =>
          setIsEditMode((prev) => !prev)
        ),
    });
  }, [navigation]);

  // 뒤로가기 버튼 핸들링 (편집 모드일 때는 편집 모드 해제)
  useEffect(() => {
    const onBackPress = () => {
      if (isEditMode) {
        setIsEditMode(false);
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [isEditMode]);

  /**
   * 아이템 클릭 시 상세화면 이동 또는 삭제 모달 표시
   */
  const handlePress = (item: Item) => {
    if (!isEditMode) {
      if (item.type === 'project') {
        navigation.navigate('ProjectDetail', { projectId: item.id });
      } else {
        navigation.navigate('CounterDetail', { counterId: item.id });
      }
    } else {
      setItemToDelete(item);
      setDeleteModalVisible(true);
    }
  };

  /**
   * 아이템 길게 누르기 시 편집 모드 진입 및 삭제 모달 표시
   */
  const handleLongPress = (item: Item) => {
    if (!isEditMode) {
      setIsEditMode(true);
    }
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  /**
   * 아이템 추가 처리 (실제 저장 및 상태 초기화)
   */
  const proceedAddItem = (item: Item) => {
    addItem(item);
    resetModalState();
    fetchItems();
  };

  /**
   * 모달에서 확인 시 아이템 생성 및 중복 체크
   */
  const handleModalConfirm = (name: string, type: 'project' | 'counter') => {
    const newItem = createNewItem(type, name);

    if (checkDuplicateName(newItem)) {
      setPendingItem(newItem);
      setDuplicateModalVisible(true);
      return;
    }

    proceedAddItem(newItem);
  };

  /**
   * 삭제 모달 설명 텍스트 생성
   */
  const getDeleteDescription = () => {
    if (!itemToDelete) {
      return '';
    }

    const isProject = itemToDelete.type === 'project';
    const count = isProject ? itemToDelete.counterIds.length : 0;

    return isProject
      ? `"${itemToDelete.title}" 프로젝트를 삭제하면 하위 카운터 ${count}개도 함께 삭제됩니다. 진행하시겠습니까?`
      : `"${itemToDelete.title}" 카운터를 삭제하시겠습니까?`;
  };

  /**
   * 삭제 확인 시 실제 삭제 처리
   */
  const handleDeleteConfirm = () => {
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
    fetchItems();
  };

  /**
   * 개별 아이템 렌더링 함수
   */
  const renderItem = (item: Item) => (
    <View key={item.id} className="mb-4 flex-row items-center">
      <View className="flex-1 mr-2">
        <RoundedBox
          title={item.title}
          subtitle={item.type === 'project' ? '프로젝트' : '카운터'}
          number={
            item.type === 'project'
              ? item.counterIds?.length ?? 0
              : item.count
          }
          layoutStyle="C"
          colorStyle={isEditMode ? 'B' : 'A'}
          isButton
          onPress={() => handlePress(item)}
          onLongPress={() => handleLongPress(item)}
        />
      </View>

      {/* 편집 모드일 때 삭제 아이콘 */}
      {isEditMode && (
        <View className="ml-2">
          <CircleIcon
            size={48}
            iconName="trash-2"
            colorStyle="D"
            isButton
            onPress={() => {
              setItemToDelete(item);
              setDeleteModalVisible(true);
            }}
          />
        </View>
      )}
    </View>
  );

  /**
   * 플로팅 추가 버튼 렌더링 함수
   */
  const renderFloatingAddButton = () => (
    <View
      className="absolute right-8"
      style={{ bottom: 20 + insets.bottom }}
    >
      <CircleIcon
        size={64}
        iconName="plus"
        colorStyle="C"
        isButton
        onPress={() => {
          setModalVisible(true);
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
      {/* 아이템 목록 스크롤뷰 */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} className="p-4">
        {items.map(renderItem)}
      </ScrollView>

      {/* 플로팅 추가 버튼 */}
      {renderFloatingAddButton()}

      {/* 새 프로젝트/카운터 생성 모달 */}
      <ProjectCreateModal
        visible={modalVisible}
        onClose={resetModalState}
        onConfirm={handleModalConfirm}
      />

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        visible={deleteModalVisible}
        onClose={resetDeleteModalState}
        title="삭제"
        description={getDeleteDescription()}
        onConfirm={handleDeleteConfirm}
        confirmText="삭제"
        cancelText="취소"
        confirmButtonStyle="danger"
      />

      {/* 중복 이름 확인 모달 */}
      <ConfirmModal
        visible={duplicateModalVisible}
        onClose={() => {
          resetDuplicateModalState();
          // 중복 모달이 닫힐 때 원래 프로젝트 생성 모달은 유지 (modalVisible은 true로 유지)
        }}
        title="중복 이름"
        description={`같은 이름을 가진 ${pendingItem?.type === 'project' ? '프로젝트' : '카운터'}가 이미 존재합니다. 생성하시겠습니까?`}
        onConfirm={() => {
          if (pendingItem) {
            proceedAddItem(pendingItem);
          }
          // resetDuplicateModalState는 ConfirmModal의 onClose에서 자동으로 호출됨
        }}
        confirmText="생성"
        cancelText="취소"
        confirmButtonStyle="primary"
      />
    </SafeAreaView>
  );
};

export default Main;
