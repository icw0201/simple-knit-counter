// src/screens/CounterDetail.tsx

import React, { useLayoutEffect, useCallback } from 'react';
import { View, Text, UIManager, Platform, useWindowDimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { activateKeepAwake, deactivateKeepAwake } from '@sayem314/react-native-keep-awake';

import { getHeaderRightWithActivateInfoSettings } from '@navigation/HeaderOptions';
import { getScreenAwakeSetting } from '@storage/settings';

import { CounterTouchArea, CounterDirection, CounterActions, CounterModals, SubCounterModal } from '@components/counter';
import { getScreenSize, getIconSize, getTextClass, getGapClass, getSubModalWidthRatio, getSubModalHeightRatio, getSubModalTop, ScreenSize } from '@constants/screenSizeConfig';
import { useCounter } from '@hooks/useCounter';

// 패딩 탑 상수
const PADDING_TOP_MULTIPLIER = 0.085;
const PADDING_TOP_RATIO = 2; // SUBCOUNTERMODAL 열릴 때 2배

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

  // 화면 크기 정보
  const { height, width } = useWindowDimensions();
  const screenSize = getScreenSize(height, width);
  const iconSize = getIconSize(screenSize);
  const textClass = getTextClass(screenSize);
  const gapClass = getGapClass(screenSize);

  // 슬라이드 모달 핸들러
  const handleSlideModalClose = useCallback(() => {
    // 모달 닫기 로직 (필요시 추가)
  }, []);

  // 카운터 비즈니스 로직 훅
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
    setErrorModalVisible,
    setActiveModal,
    // 서브 카운터 관련
    subCount,
    subRule,
    subRuleIsActive,
    subModalIsOpen,
    handleSubAdd,
    handleSubSubtract,
    handleSubReset,
    handleSubEdit,
    handleSubRule,
    handleSubResetConfirm,
    handleSubEditConfirm,
    handleSubRuleConfirm,
    handleSubModalToggle,
  } = useCounter({ counterId });

  // 패딩 탑 애니메이션
  const paddingTopAnim = React.useRef(new Animated.Value(0)).current;
  const isInitialized = React.useRef(false);

  // 이전 subModalIsOpen 값을 추적
  const prevSubModalIsOpen = React.useRef(subModalIsOpen);

  // 패딩 탑 위치 조정 (height 변화 시 즉시, subModalIsOpen 변화 시 애니메이션)
  React.useEffect(() => {
    const targetPaddingTop = subModalIsOpen
      ? PADDING_TOP_MULTIPLIER * height  // 열려있으면 0.085 * height
      : PADDING_TOP_MULTIPLIER * PADDING_TOP_RATIO * height; // 닫혀있으면 0.17 * height

    console.log('subModalIsOpen changed:', subModalIsOpen, 'targetPaddingTop:', targetPaddingTop);

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
  }, [subModalIsOpen, height, paddingTopAnim]);

  // 화면 크기 및 설정값 계산 (이미 위에서 정의됨)

  // 방향 이미지 크기 계산 (원본 비율 87:134 유지)
  const imageWidth = iconSize;
  const imageHeight = iconSize * (87 / 134);

  // SubCounterModal 크기 및 위치 계산 (화면 크기별)
  const subModalWidth = width * getSubModalWidthRatio(screenSize);
  const subModalHeight = height * getSubModalHeightRatio(screenSize);
  const subModalTop = getSubModalTop(screenSize);

  /**
   * 화면 포커스 시 실행되는 효과
   * 화면 켜짐 상태 관리만 담당합니다.
   */
  useFocusEffect(
    useCallback(() => {
      // 화면 켜짐 설정 적용
      const screenAwake = getScreenAwakeSetting();
      if (screenAwake) {
        activateKeepAwake();
      } else {
        deactivateKeepAwake();
      }

      // 정리 함수: 화면 켜짐 해제
      return () => {
        deactivateKeepAwake();
      };
    }, [])
  );


  /**
   * 헤더 옵션 설정
   * 화면 크기와 카운터 상태에 따라 헤더를 동적으로 구성합니다.
   */
  useLayoutEffect(() => {
    if (!counter) {
      return;
    }

    const hasParent = !!counter.parentProjectId;
    const currentScreenSize = getScreenSize(height, width);

    navigation.setOptions({
      title: counter.title,
      headerShown: currentScreenSize !== ScreenSize.COMPACT,
      headerRight: () =>
        getHeaderRightWithActivateInfoSettings(
          navigation,
          activateMode,
          cycleActivateMode,
          hasParent ? undefined : () => navigation.navigate('InfoScreen', { itemId: counter.id })
        ),
    });
  }, [navigation, counter, activateMode, height, width, cycleActivateMode]);


  // 카운터 데이터가 없으면 렌더링하지 않음
  if (!counter) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
      <View className="flex-1 bg-white">
      {/* 좌우 터치 레이어 */}
      <CounterTouchArea onAdd={handleAdd} onSubtract={handleSubtract} />

      {/* 중앙 콘텐츠 영역 */}
      <Animated.View
        className="flex-1 items-center"
        style={{ 
          pointerEvents: 'box-none', 
          paddingTop: paddingTopAnim 
        }}
      >
        {/* 방향 표시 이미지 영역 */}
        <CounterDirection
          activateMode={activateMode}
          way={way}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          onToggleWay={toggleWay}
        />

        {/* 현재 카운트 표시 */}
        <View pointerEvents="none" className={gapClass}>
          <Text
            className={`${textClass} font-bold text-black`}
          >
            {counter.count}
          </Text>
        </View>

        {/* 액션 버튼들 */}
        <View className={gapClass}>
          <CounterActions
            screenSize={screenSize}
            iconSize={iconSize}
            onReset={() => setActiveModal('reset')}
            onEdit={handleEditOpen}
          />
        </View>
      </Animated.View>


      {/* 서브 카운터 모달 */}
      <SubCounterModal
        isOpen={subModalIsOpen}
        onToggle={handleSubModalToggle}
        onClose={handleSlideModalClose}
        onAdd={handleSubAdd}
        onSubtract={handleSubSubtract}
        onReset={handleSubReset}
        onEdit={handleSubEdit}
        onRule={handleSubRule}
        subCount={subCount}
        subRule={subRule}
        subRuleIsActive={subRuleIsActive}
        screenSize={screenSize}
        width={subModalWidth}
        height={subModalHeight}
        top={subModalTop}
      />

      {/* 모달들 */}
      <CounterModals
        activeModal={activeModal}
        errorModalVisible={errorModalVisible}
        errorMessage={errorMessage}
        currentCount={currentCount}
        subCount={subCount}
        subRule={subRule}
        subRuleIsActive={subRuleIsActive}
        onClose={handleClose}
        onEditConfirm={handleEditConfirm}
        onResetConfirm={handleResetConfirm}
        onErrorModalClose={() => setErrorModalVisible(false)}
        onSubEditConfirm={handleSubEditConfirm}
        onSubResetConfirm={handleSubResetConfirm}
        onSubRuleConfirm={handleSubRuleConfirm}
      />
      </View>
    </SafeAreaView>
  );
};

export default CounterDetail;
