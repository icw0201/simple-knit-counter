// src/hooks/useCounter.ts

import { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Platform, Vibration, Animated, UIManager } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import Sound from 'react-native-sound';

import { getStoredItems, updateItem } from '@storage/storage';
import { ActivateMode, Way, Counter } from '@storage/types';
import { getSoundSetting, getVibrationSetting } from '@storage/settings';
import { PADDING_TOP_MULTIPLIER, PADDING_TOP_RATIO } from '@constants/screenSizeConfig';

interface UseCounterProps {
  counterId: string;
}

interface UseCounterReturn {
  // 상태
  counter: Counter | null;
  activateMode: ActivateMode;
  way: Way;
  currentCount: string;
  activeModal: 'reset' | 'edit' | 'limit' | 'rule' | 'subReset' | 'subEdit' | 'subLimit' | null;
  errorModalVisible: boolean;
  errorMessage: string;

  // 서브 카운터 상태
  subCount: number;
  subRule: number;
  subRuleIsActive: boolean;
  subModalIsOpen: boolean;

  // 액션 함수들
  handleAdd: () => void;
  handleSubtract: () => void;
  handleEditOpen: () => void;
  handleEditConfirm: (value: string) => void;
  handleResetConfirm: () => void;
  handleClose: () => void;
  cycleActivateMode: () => void;
  toggleWay: () => void;
  showErrorModal: (message: string) => void;
  setErrorModalVisible: (visible: boolean) => void;
  setActiveModal: (modal: 'reset' | 'edit' | 'limit' | 'rule' | 'subReset' | 'subEdit' | 'subLimit' | null) => void;

  // 서브 카운터 액션 함수들
  handleSubAdd: () => void;
  handleSubSubtract: () => void;
  handleSubReset: () => void;
  handleSubEdit: () => void;
  handleSubRule: () => void;

  // 패딩 탑 애니메이션
  paddingTopAnim: Animated.Value;
  updatePaddingTopAnimation: (height: number, subModalIsOpen: boolean) => void;
  handleSubResetConfirm: () => void;
  handleSubEditConfirm: (value: string) => void;
  handleSubRuleConfirm: (rule: number, isRuleActive: boolean) => void;
  handleSubModalToggle: () => void;
}

/**
 * 카운터 관련 비즈니스 로직을 관리하는 커스텀 훅
 *
 * 주요 기능:
 * - 카운터 값 증가/감소
 * - 서브 카운터 값 증가/감소
 * - 활성화 모드 전환
 * - 방향 전환
 * - 사운드 및 진동 피드백
 * - 모달 상태 관리
 * - 에러 처리
 */
export const useCounter = ({ counterId }: UseCounterProps): UseCounterReturn => {
  // Android New Architecture에서 레이아웃 애니메이션 활성화
  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      !(globalThis as any)._REACT_NATIVE_NEW_ARCH_ENABLED && // New Architecture에서 무시
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // 카운터 데이터 상태
  const [counter, setCounter] = useState<Counter | null>(null);

  // 모달 상태 관리
  const [activeModal, setActiveModal] = useState<'reset' | 'edit' | 'limit' | 'rule' | 'subReset' | 'subEdit' | 'subLimit' | null>(null);
  const [currentCount, setCurrentCount] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 사운드 관련
  const clickSoundRef = useRef<Sound | null>(null);

  // 설정 상태
  const [soundSetting, setSoundSettingState] = useState(true);
  const [vibrationSetting, setVibrationSettingState] = useState(true);

  // 패딩 탑 애니메이션 상태
  const paddingTopAnim = useRef(new Animated.Value(0)).current;
  const isInitialized = useRef(false);
  const prevSubModalIsOpen = useRef(false);

  // 카운터 동작 상태
  const [activateMode, setActivateMode] = useState<ActivateMode>('inactive');
  const [way, setWay] = useState<Way>('front');

  /**
   * 카운터 데이터 로드
   */
  const loadCounterData = useCallback(() => {
    const allItems = getStoredItems();
    const latest = allItems.find(
      (item): item is Counter => item.id === counterId && item.type === 'counter'
    );

    if (latest) {
      setCounter(latest);
      setActivateMode(latest.activateMode ?? 'inactive');
      setWay(latest.info?.way ?? 'front');
      setCurrentCount(String(latest.count));
    }
  }, [counterId]);

  /**
   * 설정값 로드
   */
  const loadSettings = useCallback(() => {
    setSoundSettingState(getSoundSetting());
    setVibrationSettingState(getVibrationSetting());
  }, []);

  /**
   * 카운터 데이터 초기화
   */
  useEffect(() => {
    loadSettings();
    loadCounterData();
  }, [loadSettings, loadCounterData]);

  /**
   * 화면에 포커스될 때마다 설정 및 카운터 데이터 다시 로드
   */
  useFocusEffect(
    useCallback(() => {
      loadSettings();
      loadCounterData();
    }, [loadSettings, loadCounterData])
  );

  /**
   * 사운드 파일 로드 및 초기화
   */
  useEffect(() => {
    const sound = new Sound(require('../assets/sounds/click_cut.mp3'), (error) => {
      if (error) {
        setErrorMessage('사운드 로드 실패:\n' + error.message);
        setErrorModalVisible(true);
        return;
      }
      sound.setVolume(1.0);
      clickSoundRef.current = sound;
    });

    return () => {
      clickSoundRef.current?.release();
    };
  }, []);

  /**
   * 패딩 탑 애니메이션 관리
   */
  const updatePaddingTopAnimation = useCallback((height: number, subModalIsOpen: boolean) => {
    const targetPaddingTop = subModalIsOpen
      ? PADDING_TOP_MULTIPLIER * height  // 열려있으면 0.085 * height
      : PADDING_TOP_MULTIPLIER * PADDING_TOP_RATIO * height; // 닫혀있으면 0.17 * height

    if (!isInitialized.current) {
      // 초기 설정 시에는 애니메이션 없이 즉시 설정
      paddingTopAnim.setValue(targetPaddingTop);
      isInitialized.current = true;
    } else if (prevSubModalIsOpen.current !== subModalIsOpen) {
      // subModalIsOpen이 변경된 경우에만 애니메이션 적용
      Animated.timing(paddingTopAnim, {
        toValue: targetPaddingTop,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      // height만 변경된 경우에는 즉시 설정 (애니메이션 없음)
      paddingTopAnim.setValue(targetPaddingTop);
    }

    // 이전 값 업데이트
    prevSubModalIsOpen.current = subModalIsOpen;
  }, [paddingTopAnim]);

  /**
   * 카운터 상태 동기화
   */
  useEffect(() => {
    if (counter?.activateMode) {
      setActivateMode(counter.activateMode);
    }
    if (counter?.info?.way) {
      setWay(counter.info.way);
    }
  }, [counter]);

  /**
   * 에러 모달 표시
   */
  const showErrorModal = useCallback((message: string) => {
    setErrorMessage(message);
    setErrorModalVisible(true);
  }, []);

  /**
   * 클릭 사운드 재생
   */
  const playSound = useCallback(() => {
    if (!soundSetting) {
      return;
    }

    const sound = clickSoundRef.current;
    if (!sound) {
      return;
    }

    const duplicate = sound;
    duplicate.play((success) => {
      if (!success) {
        showErrorModal('사운드 재생 실패');
      }
    });
  }, [soundSetting, showErrorModal]);

  /**
   * 햅틱 피드백 트리거
   */
  const triggerHaptics = useCallback(() => {
    if (!vibrationSetting) {
      return;
    }

    if (Platform.OS === 'android') {
      Vibration.vibrate(50);
    } else {
      HapticFeedback.trigger('impactLight');
    }
  }, [vibrationSetting]);

  /**
   * 자동 모드일 때 방향을 자동으로 반전시킵니다.
   */
  const getReversedWayIfAuto = useCallback((): Way | null => {
    if (activateMode === 'auto') {
      return way === 'front' ? 'back' : 'front';
    }
    return null;
  }, [activateMode, way]);

  /**
   * 활성화 모드 순환 전환
   */
  const cycleActivateMode = useCallback(() => {
    const nextMode: ActivateMode = activateMode === 'inactive' ? 'auto' : 'inactive';

    setActivateMode(nextMode);

    if (counter) {
      updateItem(counter.id, { activateMode: nextMode });
      setCounter({ ...counter, activateMode: nextMode });
    }
  }, [activateMode, counter]);

  /**
   * 방향 토글
   */
  const toggleWay = useCallback(() => {
    const newWay = way === 'front' ? 'back' : 'front';
    setWay(newWay);

    if (counter) {
      const updatedInfo = { ...counter.info, way: newWay as Way };
      updateItem(counter.id, { info: updatedInfo });
      setCounter({ ...counter, info: updatedInfo });
    }
  }, [way, counter]);

  /**
   * 카운트 업데이트 및 자동 방향 전환
   */
  const updateCountAndMaybeWay = useCallback((newCount: number) => {
    if (!counter) {
      return;
    }

    const diff = Math.abs(counter.count - newCount);

    const newWay = activateMode === 'auto' && diff % 2 === 1
      ? way === 'front' ? 'back' : 'front'
      : way;

    const updatedInfo = { ...counter.info, way: newWay as Way };

    updateItem(counter.id, { count: newCount, info: updatedInfo });
    setCounter({ ...counter, count: newCount, info: updatedInfo });
  }, [counter, activateMode, way]);

  /**
   * 숫자 증가 처리
   */
  const handleAdd = useCallback(() => {
    if (!counter) {
      return;
    }

    const newCount = counter.count + 1;
    if (newCount > 9999) {
      setActiveModal('limit');
      return;
    }

    const newWay = getReversedWayIfAuto();
    const updatedInfo = newWay ? { ...counter.info, way: newWay as Way } : counter.info;

    updateItem(counter.id, { count: newCount, info: updatedInfo });
    setCounter({ ...counter, count: newCount, info: updatedInfo });

    triggerHaptics();
    playSound();
  }, [counter, getReversedWayIfAuto, triggerHaptics, playSound]);

  /**
   * 숫자 감소 처리
   */
  const handleSubtract = useCallback(() => {
    if (!counter) {
      return;
    }

    const newCount = counter.count - 1;
    if (newCount < 0) {
      setActiveModal('limit');
      return;
    }

    const newWay = getReversedWayIfAuto();
    const updatedInfo = newWay ? { ...counter.info, way: newWay as Way } : counter.info;

    updateItem(counter.id, { count: newCount, info: updatedInfo });
    setCounter({ ...counter, count: newCount, info: updatedInfo });

    triggerHaptics();
    playSound();
  }, [counter, getReversedWayIfAuto, triggerHaptics, playSound]);

  /**
   * 편집 모달 열기
   */
  const handleEditOpen = useCallback(() => {
    setCurrentCount(counter ? String(counter.count) : '');
    setActiveModal('edit');
  }, [counter]);

  /**
   * 모달 닫기 및 편집 상태 초기화
   */
  const handleClose = useCallback(() => {
    setActiveModal(null);
    setCurrentCount(counter ? String(counter.count) : '');
  }, [counter]);

  /**
   * 편집 모달에서 확인 시 카운트 업데이트
   */
  const handleEditConfirm = useCallback((value: string) => {
    if (!counter) {
      return;
    }

    const newValue = parseInt(value, 10);
    if (isNaN(newValue)) {
      return;
    }

    updateCountAndMaybeWay(newValue);
    handleClose();
  }, [counter, updateCountAndMaybeWay, handleClose]);

  /**
   * 초기화 모달에서 확인 시 카운트를 0으로 리셋
   */
  const handleResetConfirm = useCallback(() => {
    if (!counter) {
      return;
    }

    updateCountAndMaybeWay(0);
    handleClose();
  }, [counter, updateCountAndMaybeWay, handleClose]);

  // 서브 카운터 액션 함수들
  const handleSubAdd = useCallback(async () => {
    if (!counter) {
      return;
    }

    // 범위 체크: 9999 초과 시 경고 모달 표시
    if (counter.subCount >= 9999) {
      setActiveModal('subLimit');
      return;
    }

    playSound();
    triggerHaptics();

    let newSubCount = counter.subCount + 1;
    let newMainCount = counter.count;

    // 규칙이 활성화되어 있고 규칙 값 이상이 되면 자동 리셋
    if (counter.subRuleIsActive && newSubCount >= counter.subRule) {
      newSubCount = 0;
      newMainCount = counter.count + 1;
    }

    const updatedCounter = {
      ...counter,
      subCount: newSubCount,
      count: newMainCount,
    };

    await updateItem(counter.id, updatedCounter);
    setCounter(updatedCounter);
  }, [counter, playSound, triggerHaptics]);

  const handleSubSubtract = useCallback(async () => {
    if (!counter) {
      return;
    }

    // 범위 체크: 0 미만 시 경고 모달 표시
    if (counter.subCount <= 0) {
      setActiveModal('subLimit');
      return;
    }

    playSound();
    triggerHaptics();

    let newSubCount = counter.subCount - 1;
    let newMainCount = counter.count;

    // 규칙이 활성화되어 있고 규칙 값 이상이 되면 자동 리셋
    if (counter.subRuleIsActive && newSubCount >= counter.subRule) {
      newSubCount = 0;
      newMainCount = counter.count + 1;
    }

    const updatedCounter = {
      ...counter,
      subCount: newSubCount,
      count: newMainCount,
    };

    await updateItem(counter.id, updatedCounter);
    setCounter(updatedCounter);
  }, [counter, playSound, triggerHaptics]);

  const handleSubReset = useCallback(() => {
    setActiveModal('subReset');
  }, []);

  const handleSubEdit = useCallback(() => {
    setActiveModal('subEdit');
  }, []);

  const handleSubRule = useCallback(() => {
    setActiveModal('rule');
  }, []);

  // 서브 카운터 초기화 확인
  const handleSubResetConfirm = useCallback(() => {
    if (!counter) {
      return;
    }

    try {
      const updatedCounter = {
        ...counter,
        subCount: 0,
      };

      updateItem(counter.id, updatedCounter);
      setCounter(updatedCounter);
      handleClose();
    } catch (error) {
      console.error('서브 카운터 초기화 실패:', error);
      showErrorModal('서브 카운터 초기화에 실패했습니다.');
    }
  }, [counter, handleClose, showErrorModal]);

  // 서브 카운터 편집 확인
  const handleSubEditConfirm = useCallback((value: string) => {
    if (!counter) {
      return;
    }

    const newValue = parseInt(value, 10);
    if (isNaN(newValue) || newValue < 0 || newValue > 9999) {
      setActiveModal('subLimit');
      return;
    }

    let newSubCount = newValue;
    let newMainCount = counter.count;

    // 규칙이 활성화되어 있고 규칙 값 이상이 되면 자동 리셋
    if (counter.subRuleIsActive && newSubCount >= counter.subRule) {
      newSubCount = 0;
      newMainCount = counter.count + 1;
    }

    const updatedCounter = {
      ...counter,
      subCount: newSubCount,
      count: newMainCount,
    };

    updateItem(counter.id, updatedCounter);
    setCounter(updatedCounter);
    handleClose();
  }, [counter, handleClose]);

  // 서브 카운터 규칙 확인
  const handleSubRuleConfirm = useCallback((rule: number, isRuleActive: boolean) => {
    if (!counter) {
      return;
    }

    // 규칙이 활성화되려고 하는데 값이 0이면 에러
    if (isRuleActive && rule <= 0) {
      showErrorModal('규칙 값은 1 이상이어야 합니다.');
      return;
    }

    let newSubCount = counter.subCount;
    let newMainCount = counter.count;

    // 규칙을 활성화할 때 기존 보조 카운터 값이 규칙 값 이상이면 자동 리셋
    if (isRuleActive && counter.subCount >= rule) {
      newSubCount = 0;
      newMainCount = counter.count + 1;
    }

    const updatedCounter = {
      ...counter,
      subRule: rule,
      subRuleIsActive: isRuleActive,
      subCount: newSubCount,
      count: newMainCount,
    };

    updateItem(counter.id, updatedCounter);
    setCounter(updatedCounter);
    handleClose();
  }, [counter, handleClose, showErrorModal]);

  // 서브 카운터 모달 토글
  const handleSubModalToggle = useCallback(async () => {
    if (!counter) {
      return;
    }

    const updatedCounter = {
      ...counter,
      subModalIsOpen: !counter.subModalIsOpen,
    };

    await updateItem(counter.id, updatedCounter);
    setCounter(updatedCounter);
  }, [counter]);

  return {
    // 상태
    counter,
    activateMode,
    way,
    currentCount,
    activeModal,
    errorModalVisible,
    errorMessage,

    // 서브 카운터 상태
    subCount: counter?.subCount ?? 0,
    subRule: counter?.subRule ?? 0,
    subRuleIsActive: counter?.subRuleIsActive ?? false,
    subModalIsOpen: counter?.subModalIsOpen ?? false,

    // 액션 함수들
    handleAdd,
    handleSubtract,
    handleEditOpen,
    handleEditConfirm,
    handleResetConfirm,
    handleClose,
    cycleActivateMode,
    toggleWay,
    showErrorModal,
    setErrorModalVisible,
    setActiveModal,

    // 서브 카운터 액션 함수들
    handleSubAdd,
    handleSubSubtract,
    handleSubReset,
    handleSubEdit,
    handleSubRule,
    handleSubResetConfirm,
    handleSubEditConfirm,
    handleSubRuleConfirm,
    handleSubModalToggle,

    // 패딩 탑 애니메이션
    paddingTopAnim,
    updatePaddingTopAnimation,
  };
};
