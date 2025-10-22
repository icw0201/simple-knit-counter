// src/hooks/useCounter.ts

import { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Platform, Vibration, Animated, AppState } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import Sound from 'react-native-sound';

import { getStoredItems, updateItem } from '@storage/storage';
import { Way, Counter } from '@storage/types';
import { getSoundSetting, getVibrationSetting } from '@storage/settings';
import { PADDING_TOP_MULTIPLIER, PADDING_TOP_RATIO } from '@constants/screenSizeConfig';

interface UseCounterProps {
  counterId: string;
}

interface UseCounterReturn {
  // 상태
  counter: Counter | null;
  wayIsChange: boolean;
  mascotIsActive: boolean;
  way: Way;
  currentCount: string;
  activeModal: 'reset' | 'edit' | 'limit' | 'rule' | 'subReset' | 'subEdit' | 'subLimit' | null;
  errorModalVisible: boolean;
  errorMessage: string;

  // 보조 카운터 상태
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
  toggleMascotIsActive: () => void;
  toggleWay: () => void;
  showErrorModal: (message: string) => void;
  setErrorModalVisible: (visible: boolean) => void;
  setActiveModal: (modal: 'reset' | 'edit' | 'limit' | 'rule' | 'subReset' | 'subEdit' | 'subLimit' | null) => void;

  // 보조 카운터 액션 함수들
  handleSubAdd: () => void;
  handleSubSubtract: () => void;
  handleSubReset: () => void;
  handleSubEdit: () => void;
  handleSubRule: () => void;
  handleSubResetConfirm: () => void;
  handleSubEditConfirm: (value: string) => void;
  handleSubRuleConfirm: (rule: number, isRuleActive: boolean) => void;
  handleSubModalToggle: () => void;

  // 패딩 탑 애니메이션
  paddingTopAnim: Animated.Value;
  updatePaddingTopAnimation: (height: number, subModalIsOpen: boolean, options?: { animate?: boolean }) => void;
}

/**
 * 카운터 관련 비즈니스 로직을 관리하는 커스텀 훅
 *
 * 주요 기능:
 * - 카운터 값 증가/감소
 * - 보조 카운터 값 증가/감소
 * - 활성화 모드 전환
 * - 방향 전환
 * - 사운드 및 진동 피드백
 * - 모달 상태 관리
 * - 에러 처리
 */
export const useCounter = ({ counterId }: UseCounterProps): UseCounterReturn => {

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
  const prevSubModalIsOpen = useRef<boolean | null>(null); // null로 초기화하여 첫 실행과 구분

  // 카운터 동작 상태
  const [wayIsChange, setWayIsChange] = useState<boolean>(false);
  const [mascotIsActive, setMascotIsActive] = useState<boolean>(false);
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
      setWayIsChange(latest.wayIsChange ?? false);
      setMascotIsActive(latest.mascotIsActive ?? false);
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
   * 화면에 포커스될 때마다 설정 및 카운터 메타데이터(제목 등) 다시 로드
   * count 값은 로드하지 않아 롤백 방지
   */
  useFocusEffect(
    useCallback(() => {
      loadSettings();
      // 카운터 제목 등 메타데이터만 업데이트 (count는 보존)
      const allItems = getStoredItems();
      const latest = allItems.find(
        (item): item is Counter => item.id === counterId && item.type === 'counter'
      );

      if (latest) {
        // title과 info만 업데이트(헤더/표시용), 조작 가능한 필드들은 유지
        setCounter(prevCounter => {
          if (!prevCounter) {
            return latest;
          }
          return {
            ...prevCounter,
            title: latest.title,
            info: latest.info,
          };
        });
        setWay(latest.info?.way ?? 'front');
      }
    }, [counterId, loadSettings]) // counter 의존성 제거
  );

  /**
   * AppState 기반 데이터 동기화
   *
   * 동작 방식:
   * 1. background 진입 시: 현재 메모리의 카운터 상태를 MMKV에 저장 (방어적 저장)
   * 2. active 복귀 시: MMKV의 데이터와 메모리 상태를 updatedAt 타임스탬프로 비교
   *    - persisted.updatedAt > memory.updatedAt: MMKV 데이터가 더 최신 → 메모리를 MMKV 데이터로 교체
   *    - persisted.updatedAt < memory.updatedAt: 메모리가 더 최신 → MMKV에 메모리 데이터 저장
   *    - updatedAt이 같으면: 변경 없음
   *
   * 참고: counter 상태 변경 시 activateMode, way 등은 별도 useEffect에서 자동 동기화됨
   */
  useEffect(() => {
    const handleAppStateChange = (nextState: string) => {
      if (!counter) {
        return;
      }

      // 백그라운드 진입: 현재 메모리 상태를 MMKV에 저장 (방어적 저장)
      if (nextState === 'background') {
        updateItem(counter.id, counter);
        return;
      }

      // 포그라운드 복귀: MMKV와 메모리 상태 비교 후 최신 데이터 선택
      if (nextState === 'active') {
        const items = getStoredItems();
        const persisted = items.find(
          (item): item is Counter => item.id === counterId && item.type === 'counter'
        );
        if (!persisted) {
          return;
        }

        const memoryTimestamp = counter.updatedAt ?? 0;
        const persistedTimestamp = persisted.updatedAt ?? 0;

        if (persistedTimestamp > memoryTimestamp) {
          // MMKV 데이터가 더 최신: 메모리를 MMKV 데이터로 교체
          setCounter(persisted);
          setCurrentCount(String(persisted.count));
        } else if (persistedTimestamp < memoryTimestamp) {
          // 메모리가 더 최신: MMKV에 메모리 데이터 저장
          updateItem(counter.id, counter);
        }
        // updatedAt이 같으면 변경 없음
      }
    };

    // AppState 변경 이벤트 리스너 등록
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    // 컴포넌트 언마운트 시 리스너 정리
    return () => subscription.remove();
  }, [counter, counterId]);


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
  const updatePaddingTopAnimation = useCallback((height: number, subModalIsOpen: boolean, options?: { animate?: boolean }) => {
    const shouldAnimate = options?.animate ?? true;
    const targetPaddingTop = subModalIsOpen
      ? PADDING_TOP_MULTIPLIER * height  // 열려있으면 0.085 * height
      : PADDING_TOP_MULTIPLIER * PADDING_TOP_RATIO * height; // 닫혀있으면 0.17 * height

    // 첫 실행이거나 초기화되지 않은 경우
    if (prevSubModalIsOpen.current === null) {
      // 초기 설정 시에는 애니메이션 없이 즉시 설정
      paddingTopAnim.setValue(targetPaddingTop);
      isInitialized.current = true;
    } else if (prevSubModalIsOpen.current !== subModalIsOpen) {
      // subModalIsOpen이 변경된 경우에만 애니메이션 적용
      if (shouldAnimate) {
        Animated.timing(paddingTopAnim, {
          toValue: targetPaddingTop,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        // shouldAnimate가 false인 경우 (강제로 애니메이션 비활성화)
        paddingTopAnim.setValue(targetPaddingTop);
      }
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
    if (counter?.wayIsChange !== undefined) {
      setWayIsChange(counter.wayIsChange);
    }
    if (counter?.mascotIsActive !== undefined) {
      setMascotIsActive(counter.mascotIsActive);
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
   * wayIsChange가 활성화되어 있을 때 방향을 자동으로 반전시킵니다.
   */
  const getReversedWayIfWayIsChange = useCallback((): Way | null => {
    if (wayIsChange) {
      return way === 'front' ? 'back' : 'front';
    }
    return null;
  }, [wayIsChange, way]);

  /**
   * mascotIsActive 토글 (wayIsChange도 함께 토글)
   */
  const toggleMascotIsActive = useCallback(() => {
    const newMascotIsActive = !mascotIsActive;
    const newWayIsChange = !wayIsChange;

    setMascotIsActive(newMascotIsActive);
    setWayIsChange(newWayIsChange);

    if (counter) {
      updateItem(counter.id, {
        mascotIsActive: newMascotIsActive,
        wayIsChange: newWayIsChange,
      });
      setCounter({
        ...counter,
        mascotIsActive: newMascotIsActive,
        wayIsChange: newWayIsChange,
      });
    }
  }, [mascotIsActive, wayIsChange, counter]);

  /**
   * 방향 토글 (wayIsChange가 true일 때만 동작)
   */
  const toggleWay = useCallback(() => {
    if (!wayIsChange) {
      return; // wayIsChange가 false면 방향 토글하지 않음
    }

    const newWay = way === 'front' ? 'back' : 'front';
    setWay(newWay);

    if (counter) {
      const updatedInfo = { ...counter.info, way: newWay as Way };
      updateItem(counter.id, { info: updatedInfo });
      setCounter({ ...counter, info: updatedInfo });
    }
  }, [way, counter, wayIsChange]);

  /**
   * 카운트 업데이트 및 자동 방향 전환
   */
  const updateCountAndMaybeWay = useCallback((newCount: number) => {
    if (!counter) {
      return;
    }

    const diff = Math.abs(counter.count - newCount);

    const newWay = wayIsChange && diff % 2 === 1
      ? way === 'front' ? 'back' : 'front'
      : way;

    const updatedInfo = { ...counter.info, way: newWay as Way };

    updateItem(counter.id, { count: newCount, info: updatedInfo });
    setCounter({ ...counter, count: newCount, info: updatedInfo });
  }, [counter, wayIsChange, way]);

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

    const newWay = getReversedWayIfWayIsChange();
    const updatedInfo = newWay ? { ...counter.info, way: newWay as Way } : counter.info;

    updateItem(counter.id, { count: newCount, info: updatedInfo });
    setCounter({ ...counter, count: newCount, info: updatedInfo });

    triggerHaptics();
    playSound();
  }, [counter, getReversedWayIfWayIsChange, triggerHaptics, playSound]);

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

    const newWay = getReversedWayIfWayIsChange();
    const updatedInfo = newWay ? { ...counter.info, way: newWay as Way } : counter.info;

    updateItem(counter.id, { count: newCount, info: updatedInfo });
    setCounter({ ...counter, count: newCount, info: updatedInfo });

    triggerHaptics();
    playSound();
  }, [counter, getReversedWayIfWayIsChange, triggerHaptics, playSound]);

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

  // 보조 카운터 액션 함수들
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

      // 본 카운터가 9999를 넘으면 리밋 모달 표시하고 증가하지 않음
      if (newMainCount > 9999) {
        setActiveModal('limit');
        return;
      }
    }

    // way 변경 로직 적용 (본 카운터가 증가할 때)
    const newWay = newMainCount > counter.count ? getReversedWayIfWayIsChange() : null;
    const updatedInfo = newWay ? { ...counter.info, way: newWay as Way } : counter.info;

    const updatedCounter = {
      ...counter,
      subCount: newSubCount,
      count: newMainCount,
      info: updatedInfo,
    };

    await updateItem(counter.id, updatedCounter);
    setCounter(updatedCounter);
  }, [counter, playSound, triggerHaptics, getReversedWayIfWayIsChange]);

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

    const newSubCount = counter.subCount - 1;

    const updatedCounter = {
      ...counter,
      subCount: newSubCount,
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

  // 보조 카운터 초기화 확인
  const handleSubResetConfirm = useCallback(() => {
    if (!counter) {
      return;
    }

    const updatedCounter = {
      ...counter,
      subCount: 0,
    };

    updateItem(counter.id, updatedCounter);
    setCounter(updatedCounter);
    handleClose();
  }, [counter, handleClose]);

  // 보조 카운터 편집 확인
  const handleSubEditConfirm = useCallback((value: string) => {
    if (!counter) {
      return;
    }

    const newValue = parseInt(value, 10);

    let newSubCount = newValue;
    let newMainCount = counter.count;

    // 규칙이 활성화되어 있고 규칙 값 이상이 되면 자동 리셋
    if (counter.subRuleIsActive && newSubCount >= counter.subRule) {
      newSubCount = 0;
      newMainCount = counter.count + 1;

    // 본 카운터가 9999를 넘으면 리밋 모달 표시하고 증가하지 않음
    if (newMainCount > 9999) {
      // 현재 모달을 먼저 닫고, 그 다음에 리밋 모달 표시
      handleClose();
      setTimeout(() => {
        setActiveModal('limit');
      }, 100); // 모달 닫기 애니메이션 후에 리밋 모달 표시
      return;
    }
    }

    // way 변경 로직 적용 (본 카운터가 증가할 때)
    const newWay = newMainCount > counter.count ? getReversedWayIfWayIsChange() : null;
    const updatedInfo = newWay ? { ...counter.info, way: newWay as Way } : counter.info;

    const updatedCounter = {
      ...counter,
      subCount: newSubCount,
      count: newMainCount,
      info: updatedInfo,
    };

    updateItem(counter.id, updatedCounter);
    setCounter(updatedCounter);
    handleClose();
  }, [counter, handleClose, getReversedWayIfWayIsChange]);

  // 보조 카운터 규칙 확인
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

  // 보조 카운터 모달 토글
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
    wayIsChange,
    mascotIsActive,
    way,
    currentCount,
    activeModal,
    errorModalVisible,
    errorMessage,

    // 보조 카운터 상태
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
    toggleMascotIsActive,
    toggleWay,
    showErrorModal,
    setErrorModalVisible,
    setActiveModal,

    // 보조 카운터 액션 함수들
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
