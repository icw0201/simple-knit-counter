// src/screens/ProjectDetail.tsx
import React, { useState, useCallback, useLayoutEffect, useEffect } from 'react';
import { ScrollView, View, BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import RoundedBox from '@components/common/RoundedBox';
import CircleIcon from '@components/common/CircleIcon';
import CustomModal from '@components/common/modals/CustomModal';
import { getHeaderRightWithInfoEditAndSettings } from '@navigation/HeaderOptions';

import { Item, Counter, Project } from '@storage/types';
import { getStoredItems, addItem, removeCounterFromProject, updateItem } from '@storage/storage';

const ProjectDetail = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ProjectDetail'>>();
  const { projectId } = route.params;
  const insets = useSafeAreaInsets();

  // 상태 정의
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [textValue, setTextValue] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);
  const [pendingCounter, setPendingCounter] = useState<Counter | null>(null);

  /**
   * 프로젝트와 하위 카운터들을 불러와서 정렬 후 상태에 저장
   */
  const fetchProjectData = useCallback(() => {
    const allItems = getStoredItems();

    const currentProject = allItems.find(
      (item): item is Project => item.id === projectId && item.type === 'project'
    );

    if (currentProject) {
      setProject(currentProject);

      const countersInProject = allItems.filter(
        (item): item is Counter =>
          item.type === 'counter' && currentProject.counterIds.includes(item.id)
      );

      const sorted = countersInProject.sort((a, b) => {
        const aTime = parseInt(a.id.split('_')[1], 10);
        const bTime = parseInt(b.id.split('_')[1], 10);
        return bTime - aTime;
      });

      setItems(sorted);
    }
  }, [projectId]);

  /**
   * 새 카운터 생성 함수
   */
  const createNewCounter = (title: string): Counter => {
    const timestamp = Date.now();
    return {
      id: `counter_${timestamp}`,
      type: 'counter',
      title,
      count: 0,
      parentProjectId: project?.id ?? '',
    };
  };

  /**
   * 프로젝트 내에서 중복 이름 체크 함수
   */
  const checkDuplicateName = (newCounter: Counter): boolean => {
    const allItems = getStoredItems();
    const sameProjectCounters = allItems.filter(
      (item): item is Counter =>
        item.type === 'counter' &&
        item.parentProjectId === project?.id
    );

    return sameProjectCounters.some(
      (counter) => counter.title === newCounter.title
    );
  };

  /**
   * 모달 상태 초기화 함수
   */
  const resetModalState = () => {
    setModalVisible(false);
    setTextValue('');
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
    setPendingCounter(null);
  };

  // 화면이 포커스될 때마다 프로젝트 데이터 새로고침
  useFocusEffect(useCallback(() => {
    fetchProjectData();
  }, [fetchProjectData]));

  // 헤더 설정
  useLayoutEffect(() => {
    navigation.setOptions({
      title: project?.title ?? '',
      headerRight: () =>
        getHeaderRightWithInfoEditAndSettings(
          navigation,
          () => navigation.navigate('InfoScreen', { itemId: project?.id ?? '' }),
          () => setIsEditMode((prev) => !prev)
        ),
    });
  }, [navigation, project]);

  // 프로젝트 정보 업데이트
  useEffect(() => {
    const storedItems = getStoredItems();
    const currentProject = storedItems.find((item): item is Project => item.id === projectId && item.type === 'project');
    if (currentProject) {
      setProject(currentProject);
    }
  }, [projectId]);

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
   * 카운터 클릭 시 상세화면 이동 또는 삭제 모달 표시
   */
  const handlePress = (item: Item) => {
    if (!isEditMode && item.type === 'counter') {
      navigation.navigate('CounterDetail', { counterId: item.id });
    } else {
      setItemToDelete(item);
      setDeleteModalVisible(true);
    }
  };

  /**
   * 카운터 길게 누르기 시 편집 모드 진입 및 삭제 모달 표시
   */
  const handleLongPress = (item: Item) => {
    if (!isEditMode) {
      setIsEditMode(true);
    }
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  /**
   * 모달에서 확인 시 카운터 생성 및 중복 체크
   */
  const handleModalConfirm = () => {
    if (!textValue.trim()) {
      return;
    }

    const newCounter = createNewCounter(textValue);

    if (checkDuplicateName(newCounter)) {
      setPendingCounter(newCounter);
      setDuplicateModalVisible(true);
      return;
    }

    proceedAddCounter(newCounter);
  };

  /**
   * 카운터 추가 처리 (실제 저장 및 상태 업데이트)
   */
  const proceedAddCounter = (newCounter: Counter) => {
    addItem(newCounter);

    const updatedProject: Partial<Project> = {
      counterIds: [newCounter.id, ...(project?.counterIds ?? [])],
    };

    if (project) {
      updateItem(project.id, updatedProject);
    }

    if (project) {
      setProject({
        ...project,
        counterIds: updatedProject.counterIds!,
      });
    }

    setItems((prev) => [newCounter, ...prev]);
    resetModalState();
  };

  /**
   * 삭제 확인 시 실제 삭제 처리
   */
  const handleDeleteConfirm = () => {
    if (!itemToDelete || itemToDelete.type !== 'counter') {
      return;
    }

    if (project) {
      removeCounterFromProject(project.id, itemToDelete.id);

      setProject({
        ...project,
        counterIds: project.counterIds.filter(id => id !== itemToDelete.id),
      });
    }

    setItems(prev => prev.filter(i => i.id !== itemToDelete.id));
    resetDeleteModalState();
  };

  /**
   * 개별 카운터 렌더링 함수
   */
  const renderCounter = (item: Item) => (
    <View key={item.id} className="mb-4 flex-row items-center">
      <View className="flex-1 mr-2">
        <RoundedBox
          title={item.title}
          subtitle="카운터"
          number={item.type === 'counter' ? item.count : 0}
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
          setTextValue('');
          setModalVisible(true);
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
      {/* 카운터 목록 스크롤뷰 */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} className="p-4">
        {items.map(renderCounter)}
      </ScrollView>

      {/* 플로팅 추가 버튼 */}
      {renderFloatingAddButton()}

      {/* 새 카운터 생성 모달 */}
      <CustomModal
        visible={modalVisible}
        onClose={resetModalState}
        title="새 카운터 생성하기"
        inputVisible
        inputValue={textValue}
        onInputChange={setTextValue}
        inputPlaceholder="이름을 입력해 주세요"
        inputType="text"
        buttonType="create"
        onConfirm={handleModalConfirm}
        onCancel={resetModalState}
      />

      {/* 삭제 확인 모달 */}
      <CustomModal
        visible={deleteModalVisible}
        onClose={resetDeleteModalState}
        title="삭제"
        description={`"${itemToDelete?.title}" 카운터를 삭제하시겠습니까?`}
        buttonType="confirmCancel"
        onConfirm={handleDeleteConfirm}
        onCancel={resetDeleteModalState}
      />

      {/* 중복 이름 확인 모달 */}
      <CustomModal
        visible={duplicateModalVisible}
        onClose={resetDuplicateModalState}
        title="중복 이름"
        description="같은 이름의 카운터가 이미 존재합니다. 생성하시겠습니까?"
        buttonType="confirmCancel"
        onConfirm={() => {
          if (pendingCounter) {
            proceedAddCounter(pendingCounter);
          }
          resetDuplicateModalState();
        }}
        onCancel={resetDuplicateModalState}
      />
    </SafeAreaView>
  );
};

export default ProjectDetail;
