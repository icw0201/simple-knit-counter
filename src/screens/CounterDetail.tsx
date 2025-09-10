// src/screens/CounterDetail.tsx

import React, { useEffect, useState, useLayoutEffect, useRef, useCallback } from 'react';
import {
  View, Text, Pressable, UIManager, Platform, Vibration, useWindowDimensions, Image,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import HapticFeedback from 'react-native-haptic-feedback';
import Sound from 'react-native-sound';
import { activateKeepAwake, deactivateKeepAwake } from '@sayem314/react-native-keep-awake';

import { getHeaderRightWithActivateInfoSettings } from '@navigation/HeaderOptions';

import { getStoredItems, updateItem } from '@storage/storage';
import { ActivateMode, Way } from '@storage/types';
import { Counter } from '@storage/types';
import { getSoundSetting, getVibrationSetting, getScreenAwakeSetting } from '@storage/settings';

import CircleIcon from '@components/CircleIcon';
import CustomModal from '@components/CustomModal';
import { Images } from '@assets/images';

// Android New Architecture에서 레이아웃 애니메이션 활성화
if (
  Platform.OS === 'android' &&
  !(globalThis as any)._REACT_NATIVE_NEW_ARCH_ENABLED && // New Architecture에서 무시
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * 카운터 상세 화면 컴포넌트
 *
 * 이 화면은 사용자가 프로젝트나 독립 카운터의 숫자를 증가/감소시키고,
 * 다양한 설정(활성화 모드, 방향, 사운드, 진동)을 관리할 수 있는 핵심 화면입니다.
 *
 * 주요 기능:
 * - 좌우 터치로 숫자 증가/감소
 * - 활성화 모드 전환 (비활성/자동)
 * - 방향 전환 (앞/뒤)
 * - 사운드 및 진동 피드백
 * - 화면 켜짐 유지
 * - 카운트 편집 및 초기화
 * - 반응형 UI (화면 크기에 따른 레이아웃 조정)
 */
const CounterDetail = () => {
  // 네비게이션 및 라우트 객체
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { counterId } = route.params as { counterId: string };

  // 카운터 데이터 상태
  const [counter, setCounter] = useState<Counter | null>(null);

  // 모달 상태 관리
  const [activeModal, setActiveModal] = useState<'reset' | 'edit' | 'limit' | null>(null);
  const [currentCount, setCurrentCount] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 사운드 관련
  const clickSoundRef = useRef<Sound | null>(null);

  // 터치 피드백 상태
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);

  // 설정 상태
  const [soundSetting, setSoundSettingState] = useState(true);
  const [vibrationSetting, setVibrationSettingState] = useState(true);

  // 화면 크기 정보
  const { height, width } = useWindowDimensions();

  // 카운터 동작 상태
  const [activateMode, setActivateMode] = useState<ActivateMode>('inactive');
  const [way, setWay] = useState<Way>('front'); // 기본값: 앞쪽

  /**
   * 화면 크기에 따른 UI 요소 크기 분류
   * 컴팩트, 작음, 중간, 큼으로 구분하여 반응형 UI 제공
   */
  enum ScreenSize {
    COMPACT = 'COMPACT',   // 250x250 이하 (매우 작은 화면)
    SMALL = 'SMALL',       // 450 이하 (작은 화면)
    LARGE = 'LARGE',       // 450 초과 (큰 화면)
  }

  /**
   * 현재 화면 크기를 판단하여 적절한 ScreenSize 열거값을 반환합니다.
   */
  const screenSize: ScreenSize = (() => {
    if (height <= 250 && width <= 250) {
      return ScreenSize.COMPACT;
    }
    if (height <= 450) {
      return ScreenSize.SMALL;
    }
    return ScreenSize.LARGE;
  })();

  /**
   * 화면 크기에 따른 아이콘 크기 설정
   */
  const iconSize = {
    [ScreenSize.COMPACT]: 44,   // 컴팩트: 작은 아이콘
    [ScreenSize.SMALL]: 52,     // 작음: 중간 아이콘
    [ScreenSize.LARGE]: 64,     // 큼: 큰 아이콘
  }[screenSize];

  /**
   * 화면 크기에 따른 아이콘 마진 설정
   */
  const iconMargin = {
    [ScreenSize.COMPACT]: 'mt-3',           // 컴팩트: 위쪽 여백만
    [ScreenSize.SMALL]: 'mt-3',             // 작음: 위쪽 여백만
    [ScreenSize.LARGE]: 'mt-12 mb-14',      // 큼: 위아래 여백
  }[screenSize];

  /**
   * 화면 크기에 따른 숫자 텍스트 스타일 설정
   */
  const textClass = {
    [ScreenSize.COMPACT]: 'text-5xl mb-7',      // 컴팩트: 작은 글씨, 아래 여백
    [ScreenSize.SMALL]: 'text-7xl mb-2 mt-3',   // 작음: 중간 글씨, 위아래 여백
    [ScreenSize.LARGE]: 'text-8xl mb-10 mt-10', // 큼: 큰 글씨, 큰 여백
  }[screenSize];

  // 방향 이미지 크기 계산 (원본 비율 87:134 유지)
  const imageWidth = iconSize;
  const imageHeight = iconSize * (87 / 134);

  /**
   * 화면 포커스 시 실행되는 효과
   * 설정값 로드, 화면 켜짐 상태 관리, 카운터 데이터 최신화를 담당합니다.
   */
  useFocusEffect(
    useCallback(() => {
      // 설정값 로드
      setSoundSettingState(getSoundSetting());
      setVibrationSettingState(getVibrationSetting());

      // 화면 켜짐 설정 적용
      const screenAwake = getScreenAwakeSetting();
      if (screenAwake) {
        activateKeepAwake();
      } else {
        deactivateKeepAwake();
      }

      // 카운터 데이터 최신화
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

      // 정리 함수: 화면 켜짐 해제
      return () => {
        deactivateKeepAwake();
      };
    }, [counterId])
  );

  /**
   * 에러 모달 표시
   */
  const showErrorModal = (message: string) => {
    setErrorMessage(message);
    setErrorModalVisible(true);
  };

  /**
   * 사운드 파일 로드 및 초기화
   * 컴포넌트 마운트 시 한 번만 실행됩니다.
   */
  useEffect(() => {
    // 카테고리를 설정하지 않아 기본 동작을 사용
    // 이렇게 하면 백그라운드 음악과 함께 재생될 가능성이 높음

    const sound = new Sound(require('../assets/sounds/click_cut.mp3'), (error) => {
      if (error) {
        showErrorModal('사운드 로드 실패:\n' + error.message);
        return;
      }
      // 볼륨을 최대로 설정하여 소리가 확실히 들리도록 함
      sound.setVolume(1.0);
      clickSoundRef.current = sound;
    });

    // 정리 함수: 사운드 리소스 해제
    return () => {
      clickSoundRef.current?.release();
    };
  }, []);

  /**
   * 클릭 사운드 재생
   * 사운드 설정이 비활성화되어 있으면 재생하지 않습니다.
   */
  const playSound = () => {
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
  };

  /**
   * 햅틱 피드백 트리거
   * 진동 설정이 비활성화되어 있으면 실행하지 않습니다.
   * 플랫폼별로 다른 피드백 방식을 사용합니다.
   */
  const triggerHaptics = () => {
    if (!vibrationSetting) {
      return;
    }

    if (Platform.OS === 'android') {
      Vibration.vibrate(50); // 안드로이드: 50ms 진동
    } else {
      HapticFeedback.trigger('impactLight'); // iOS: 가벼운 충격
    }
  };

  /**
   * 카운터 상태 동기화
   * 카운터 데이터가 변경될 때마다 로컬 상태를 업데이트합니다.
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
   * 활성화 모드 순환 전환
   * inactive ↔ auto 순서로 전환됩니다.
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
   * 자동 모드일 때 방향을 자동으로 반전시킵니다.
   * @returns 자동 모드일 때 반전된 방향, 그 외에는 null
   */
  const getReversedWayIfAuto = (): Way | null => {
    if (activateMode === 'auto') {
      return way === 'front' ? 'back' : 'front';
    }
    return null;
  };

  /**
   * 헤더 옵션 설정
   * 화면 크기와 카운터 상태에 따라 헤더를 동적으로 구성합니다.
   */
  useLayoutEffect(() => {
    if (!counter) {
      return;
    }

    const hasParent = !!counter.parentProjectId;

    navigation.setOptions({
      title: counter.title,
      headerShown: screenSize !== ScreenSize.COMPACT,
      headerRight: () =>
        getHeaderRightWithActivateInfoSettings(
          navigation,
          activateMode,
          cycleActivateMode,
          hasParent ? undefined : () => navigation.navigate('InfoScreen', { itemId: counter.id })
        ),
    });
  }, [navigation, counter, activateMode, screenSize, ScreenSize.COMPACT, cycleActivateMode]);

  /**
   * 방향 토글
   * front ↔ back 방향을 전환하고 저장소에 업데이트합니다.
   */
  const toggleWay = () => {
    const newWay = way === 'front' ? 'back' : 'front';
    setWay(newWay);

    if (counter) {
      const updatedInfo = { ...counter.info, way: newWay as Way };
      updateItem(counter.id, { info: updatedInfo });
      setCounter({ ...counter, info: updatedInfo });
    }
  };

  /**
   * 숫자 증가 처리
   * 최대값(9999) 초과 시 경고 모달을 표시합니다.
   * 자동 모드일 때 방향을 자동으로 반전시킵니다.
   */
  const handleAdd = () => {
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
  };

  /**
   * 숫자 감소 처리
   * 최소값(0) 미만 시 경고 모달을 표시합니다.
   * 자동 모드일 때 방향을 자동으로 반전시킵니다.
   */
  const handleSubtract = () => {
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
  };

  /**
   * 모달 닫기 및 편집 상태 초기화
   */
  const handleClose = () => {
    setActiveModal(null);
    setCurrentCount(counter ? String(counter.count) : '');
  };

  /**
   * 카운트 업데이트 및 자동 방향 전환
   * 자동 모드에서 홀수 차이일 때 방향을 자동으로 전환합니다.
   * @param newCount - 새로운 카운트 값
   */
  const updateCountAndMaybeWay = (newCount: number) => {
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
  };

  /**
   * 편집 모달에서 확인 시 카운트 업데이트
   */
  const handleEditConfirm = () => {
    if (!counter) {
      return;
    }

    const newValue = parseInt(currentCount, 10);
    if (isNaN(newValue)) {
      return;
    }

    updateCountAndMaybeWay(newValue);
    handleClose();
  };

  /**
   * 초기화 모달에서 확인 시 카운트를 0으로 리셋
   */
  const handleResetConfirm = () => {
    if (!counter) {
      return;
    }

    updateCountAndMaybeWay(0);
    handleClose();
  };

  // 카운터 데이터가 없으면 렌더링하지 않음
  if (!counter) {
    return null;
  }

  return (
    <View className="flex-1 bg-white">
      {/* 좌우 터치 레이어 (절대 위치) */}
      <View className="absolute top-0 left-0 right-0 bottom-0 flex-row">
        {/* 왼쪽 터치 영역 (감소) */}
        <Pressable
          className={`flex-1 items-start justify-center ${leftPressed ? 'bg-gray-100' : 'bg-white'}`}
          onPress={() => {
            setLeftPressed(true);
            handleSubtract();
            setTimeout(() => setLeftPressed(false), 100);
          }}
        >
          <Text className="text-6xl text-red-500 ml-6">-</Text>
        </Pressable>

        {/* 오른쪽 터치 영역 (증가) */}
        <Pressable
          className={`flex-1 items-end justify-center ${rightPressed ? 'bg-red-200' : 'bg-red-100'}`}
          onPress={() => {
            setRightPressed(true);
            handleAdd();
            setTimeout(() => setRightPressed(false), 100);
          }}
        >
          <Text className="text-6xl text-red-500 mr-6">+</Text>
        </Pressable>
      </View>

      {/* 중앙 콘텐츠 영역 */}
      <View className="flex-1 items-center justify-center">
        {/* 방향 표시 이미지 영역 (항상 같은 공간 차지) */}
        <View className="mb-2" style={{ height: imageHeight }}>
          {activateMode !== 'inactive' && (
            <Pressable onPress={toggleWay}>
              <Image
                source={way === 'front' ? Images.way_front : Images.way_back}
                style={{ width: imageWidth, height: imageHeight, resizeMode: 'contain' }}
              />
            </Pressable>
          )}
        </View>

        {/* 현재 카운트 표시 */}
        <Text className={`${textClass} font-bold text-black`}>
          {counter.count}
        </Text>

        {/* 액션 버튼들 (컴팩트 화면이 아닐 때만 표시) */}
        {screenSize !== ScreenSize.COMPACT && (
          <View className={`${iconMargin} flex-row items-end`}>
            {/* 초기화 버튼 */}
            <CircleIcon
              size={iconSize}
              iconName="rotate-ccw"
              colorStyle="D"
              isButton
              containerClassName="mx-2"
              onPress={() => setActiveModal('reset')}
            />

            {/* 편집 버튼 */}
            <CircleIcon
              size={iconSize}
              iconName="pencil"
              colorStyle="D"
              isButton
              containerClassName="mx-2"
              onPress={() => {
                setCurrentCount(String(counter.count));
                setActiveModal('edit');
              }}
            />
          </View>
        )}
      </View>

      {/* 초기화 확인 모달 */}
      <CustomModal
        visible={activeModal === 'reset'}
        onClose={handleClose}
        title="숫자 초기화"
        description="숫자를 0으로 초기화하시겠습니까?"
        buttonType="confirmCancel"
        onConfirm={handleResetConfirm}
        onCancel={handleClose}
      />

      {/* 카운트 편집 모달 */}
      <CustomModal
        visible={activeModal === 'edit'}
        onClose={handleClose}
        title="카운트 편집"
        inputVisible
        inputPlaceholder="숫자를 입력해 주세요"
        inputValue={currentCount}
        inputType="number"
        onInputChange={setCurrentCount}
        buttonType="confirmCancel"
        onConfirm={handleEditConfirm}
        onCancel={handleClose}
      />

      {/* 범위 초과 경고 모달 */}
      <CustomModal
        visible={activeModal === 'limit'}
        onClose={handleClose}
        title="범위 초과 안내"
        description="카운터에는 0에서 9999 사이의 값만 입력할 수 있습니다."
        buttonType="confirm"
        onConfirm={handleClose}
        onCancel={handleClose}
      />

      {/* 에러 모달 */}
      <CustomModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        title="오류"
        description={errorMessage}
        buttonType="confirm"
        onConfirm={() => setErrorModalVisible(false)}
      />
    </View>
  );
};

export default CounterDetail;
