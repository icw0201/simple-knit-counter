// src/screens/CounterDetail.tsx

import { useLayoutEffect, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, useWindowDimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { activateKeepAwake, deactivateKeepAwake } from '@sayem314/react-native-keep-awake';

import { getHeaderRightWithActivateInfoSettings } from '@navigation/HeaderOptions';
import { getScreenAwakeSetting } from '@storage/settings';

import { CounterTouchArea, CounterDirection, CounterActions, CounterModals, SubCounterModal, ProgressBar, TimeDisplay } from '@components/counter';
import Tooltip from '@components/common/Tooltip';
import { getScreenSize, getIconSize, getTextClass, getGapClass, getSubModalWidthRatio, getSubModalHeightRatio, getSubModalTop, ScreenSize } from '@constants/screenSizeConfig';
import { getTooltipEnabledSetting } from '@storage/settings';
import { screenStyles, safeAreaEdges } from '@styles/screenStyles';
import { useCounter } from '@hooks/useCounter';


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


  // 카운터 비즈니스 로직 훅
  const {
    counter,
    wayIsChange,
    mascotIsActive,
    way,
    currentCount,
    currentTargetCount,
    activeModal,
    errorModalVisible,
    errorMessage,
    handleAdd,
    handleSubtract,
    handleEditOpen,
    handleEditConfirm,
    handleResetConfirm,
    handleClose,
    handleTargetCountOpen,
    handleTargetCountConfirm,
    toggleMascotIsActive,
    toggleWay,
    toggleTimerIsActive,
    toggleTimerIsPlaying,
    setErrorModalVisible,
    setActiveModal,
    // 보조 카운터 관련
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
    // 패딩 탑 애니메이션
    paddingTopAnim,
    updatePaddingTopAnimation,
  } = useCounter({ counterId });

  // 패딩 탑 애니메이션 업데이트
  // 최초 진입 시에는 애니메이션 없이 즉시 설정하고, 이후에는 subModalIsOpen 변경 시에만 애니메이션
  const didInitPadding = useRef(false);
  const prevCounterId = useRef<string | null>(null);
  const [isPaddingReady, setPaddingReady] = useState(false);
  const [tooltipEnabled, setTooltipEnabled] = useState(true);
  useEffect(() => {
    if (!counter) { return; }

    // 최초 진입(또는 다른 카운터로 전환) 시에는 애니메이션 없이 즉시 설정
    if (!didInitPadding.current || prevCounterId.current !== counter.id) {
      updatePaddingTopAnimation(height, subModalIsOpen, { animate: false });
      didInitPadding.current = true;
      prevCounterId.current = counter.id;
      setPaddingReady(true);
      return;
    }

    // 이후에는 상태 변경 시에만 애니메이션 적용
    updatePaddingTopAnimation(height, subModalIsOpen, { animate: true });
    setPaddingReady(true);
  }, [counter, subModalIsOpen, height, updatePaddingTopAnimation]);

  // 방향 이미지 크기 계산 (원본 비율 87:134 유지)
  const imageWidth = iconSize;
  const imageHeight = iconSize * (87 / 134);
  const hasParent = !!counter?.parentProjectId;

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

      // 툴팁 표시 설정 로드
      setTooltipEnabled(getTooltipEnabledSetting());

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

    const currentScreenSize = getScreenSize(height, width);

    navigation.setOptions({
      title: counter.title,
      headerShown: currentScreenSize !== ScreenSize.COMPACT,
      headerRight: () =>
        getHeaderRightWithActivateInfoSettings(
          navigation,
          mascotIsActive,
          toggleMascotIsActive,
          counter.timerIsActive,
          toggleTimerIsActive,
          hasParent ? undefined : () => navigation.navigate('InfoScreen', { itemId: counter.id })
        ),
    });
  }, [navigation, counter, mascotIsActive, height, width, toggleMascotIsActive, toggleTimerIsActive, hasParent]);


  // 카운터 데이터가 없으면 렌더링하지 않음
  if (!counter) {
    return null;
  }

  return (
    <SafeAreaView style={screenStyles.flex1} edges={safeAreaEdges}>
      <View className="flex-1 bg-white">

      {/* 좌우 터치 레이어 */}
      <CounterTouchArea onAdd={handleAdd} onSubtract={handleSubtract} />

      {/* 중앙 콘텐츠 영역 */}
      <Animated.View
        className="flex-1 items-center justify-center"
        style={[
          screenStyles.pointerEventsBoxNone,
          {
            paddingTop: -50,
            opacity: isPaddingReady ? 1 : 0,
          },
        ]}
      >
        {/* 프로그레스 바 - 화면 최상단에 고정 */}
        <ProgressBar
          count={counter.count}
          targetCount={counter.targetCount || 0}
          screenSize={screenSize}
          onPress={handleTargetCountOpen}
        />

        {/* 프로그레스 바 아래 툴팁 (COMPACT 화면에서는 비표시) */}
        {screenSize !== ScreenSize.COMPACT && tooltipEnabled && (
          <Tooltip
            text="바를 눌러 목표 단수 설정하기"
            containerClassName={`absolute left-0 right-0 items-center z-50 ${screenSize === ScreenSize.SMALL ? 'top-7' : 'top-9'}`}
          />
        )}

        {/* 헤더 활성 아이콘 안내 툴팁 (헤더 대신 화면 위층에 표시) */}
        {screenSize !== ScreenSize.COMPACT && tooltipEnabled && (
          <Tooltip
            text="편물 앞 뒤 체크하기"
            containerClassName="absolute right-3 top-2 z-50"
            targetAnchorX={hasParent ? width - 65 : width - 103}
          />
        )}

        {/* 시간 표시 컴포넌트 */}
        {counter.timerIsActive && screenSize !== ScreenSize.COMPACT && !(screenSize === ScreenSize.SMALL && (counter.subModalIsOpen ?? false)) && (
          <TimeDisplay
            screenSize={screenSize}
            timerIsPlaying={counter.timerIsPlaying ?? false}
            elapsedTime={counter.elapsedTime ?? 0}
            onPress={toggleTimerIsPlaying}
          />
        )}

        {/* 방향 표시 이미지 영역 */}
        <CounterDirection
          mascotIsActive={mascotIsActive}
          wayIsChange={wayIsChange}
          way={way}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          screenSize={screenSize}
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

        {/* 액션 버튼들 - SMALL 화면에서 SubCounterModal이 열려있으면 숨김 */}
        {!(screenSize === ScreenSize.SMALL && subModalIsOpen) && (
          <View className={gapClass}>
            <CounterActions
              screenSize={screenSize}
              iconSize={iconSize}
              onReset={() => setActiveModal('reset')}
              onEdit={handleEditOpen}
            />
          </View>
        )}
      </Animated.View>


      {/* 보조 카운터 모달 */}
      <SubCounterModal
        isOpen={subModalIsOpen}
        onToggle={handleSubModalToggle}
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
        currentTargetCount={currentTargetCount}
        subCount={subCount}
        subRule={subRule}
        subRuleIsActive={subRuleIsActive}
        onClose={handleClose}
        onEditConfirm={handleEditConfirm}
        onResetConfirm={handleResetConfirm}
        onErrorModalClose={() => setErrorModalVisible(false)}
        onTargetCountConfirm={handleTargetCountConfirm}
        onSubEditConfirm={handleSubEditConfirm}
        onSubResetConfirm={handleSubResetConfirm}
        onSubRuleConfirm={handleSubRuleConfirm}
      />
      </View>
    </SafeAreaView>
  );
};

export default CounterDetail;
