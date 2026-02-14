// src/screens/CounterDetail.tsx

import { useLayoutEffect, useCallback, useState } from 'react';
import { View, Text, useWindowDimensions, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/AppNavigator';

import { getHeaderRightWithActivateInfoSettings } from '@navigation/HeaderOptions';

import { CounterTouchArea, CounterDirection, CounterActions, CounterModals, SubCounterModal, ProgressBar, TimeDisplay, SegmentRecordModal } from '@components/counter';
import Tooltip from '@components/common/Tooltip';
import { getCounterDetailVerticalBands, getScreenSize, getIconSize, getTextClass, getSubModalWidthRatio, getSubModalHeightRatio, getSubModalCenterY, getSubModalHandleWidth, getSubModalTopEdgePercent, getSegmentModalHeightRatio, getSegmentModalCenterY, ScreenSize } from '@constants/screenSizeConfig';
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

  // 화면 크기 정보 (서브 모달과 같은 좌표계: SafeArea 내부 높이 사용)
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentAreaHeight = height - insets.top - insets.bottom;
  const screenSize = getScreenSize(height);
  const iconSize = getIconSize(screenSize);
  const textClass = getTextClass(screenSize);

  // ProgressBar.tsx의 heightClass(h-3/h-5/h-7) 기준(px)
  const progressBarHeightPx =
    screenSize === ScreenSize.COMPACT ? 12 : screenSize === ScreenSize.SMALL ? 20 : 28;


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
    // 구간 기록 모달
    handleSectionModalToggle,
    handleSectionUndo,
  } = useCounter({ counterId });

  const [tooltipEnabled, setTooltipEnabled] = useState(true);

  // 방향 이미지 크기 계산 (원본 비율 90 / 189 유지)
  const imageWidth = iconSize * 1.4;
  const imageHeight = iconSize * (90 / 189) * 1.4;
  const hasParent = !!counter?.parentProjectId;

  // SubCounterModal 크기 및 위치 계산 (화면 크기별)
  const subModalWidth = width * getSubModalWidthRatio(screenSize);
  const subModalHeight = height * getSubModalHeightRatio(screenSize);
  const subModalCenterY = getSubModalCenterY(screenSize);
  const subModalHandleWidth = getSubModalHandleWidth(screenSize);

  // 구간 기록 모달 크기 및 위치 계산 (LARGE 화면에서만 사용)
  const segmentModalWidth = subModalWidth;
  const segmentModalHeight = height * getSegmentModalHeightRatio(screenSize);
  const segmentModalCenterY = getSegmentModalCenterY(screenSize);

  const { timerEndPercent, contentStartPercent, contentEndPercent } =
    getCounterDetailVerticalBands(screenSize);

  // 서브 모달 height는 window 기준으로 전달되므로, contentAreaHeight와 다를 때만 보정 (config의 getSubModalTopEdgePercent 활용).
  const subModalTopEdgePercent = getSubModalTopEdgePercent(screenSize);
  const effectiveContentEndPercent =
    contentAreaHeight > 0
      ? 85 - (height / contentAreaHeight) * (85 - subModalTopEdgePercent)
      : contentEndPercent;

  // bands %는 contentAreaHeight(SafeArea 내부) 기준으로 px 변환 (서브 모달과 동일 좌표계)
  const timerHeightPx = Math.max(
    0,
    (contentAreaHeight * timerEndPercent) / 100 - progressBarHeightPx
  );
  const gapBetweenTimerAndContentPx = Math.max(
    0,
    (contentAreaHeight * (contentStartPercent - timerEndPercent)) / 100
  );
  const contentHeightPx = Math.max(
    0,
    (contentAreaHeight * (effectiveContentEndPercent - contentStartPercent)) / 100
  );
  const bottomReservedHeightPx = Math.max(
    0,
    contentAreaHeight -
      progressBarHeightPx -
      (timerHeightPx + gapBetweenTimerAndContentPx + contentHeightPx)
  );

  // getCounterDetailVerticalBands(screenSize) 기준 통일 레이아웃 (화면 크기별 %는 config에서 정의)
  const contentWrapperStyle = {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: 0,
    top: progressBarHeightPx,
  };
  const timerContainerStyle = {
    width: '100%' as const,
    height: timerHeightPx,
    alignItems: 'center' as const,
    justifyContent: 'flex-start' as const,
  };
  const contentContainerStyle = {
    width: '100%' as const,
    height: contentHeightPx,
  };

  const showTimeDisplay =
    (counter?.timerIsActive ?? false) &&
    (screenSize === ScreenSize.LARGE ||
      (screenSize !== ScreenSize.COMPACT && !(screenSize === ScreenSize.SMALL && subModalIsOpen)));
  const showCounterActions =
    screenSize === ScreenSize.LARGE || !(screenSize === ScreenSize.SMALL && subModalIsOpen);

  /**
   * 화면 포커스 시 실행되는 효과
   * 화면 켜짐 상태 관리만 담당합니다.
   */
  useFocusEffect(
    useCallback(() => {
      // 툴팁 표시 설정 로드
      setTooltipEnabled(getTooltipEnabledSetting());
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

    const currentScreenSize = getScreenSize(height);

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
          counter.id,
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
            opacity: 1,
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
            text="길게 눌러 어쩌미 알림 단 설정하기"
            containerClassName="absolute right-3 top-2 z-50"
            targetAnchorX={hasParent ? width - 65 : width - 103}
          />
        )}

        <View className="flex-1 w-full items-center justify-start" style={contentWrapperStyle}>
          {/* 타이머 영역 (bands의 timerEndPercent 기준) */}
          <View className="w-full items-center" style={timerContainerStyle}>
            {showTimeDisplay && (
              <TimeDisplay
                screenSize={screenSize}
                timerIsPlaying={counter.timerIsPlaying ?? false}
                elapsedTime={counter.elapsedTime ?? 0}
                onPress={toggleTimerIsPlaying}
              />
            )}
          </View>

          {/* 구간 기록 모달 자리 (bands의 contentStartPercent - timerEndPercent) */}
          <View style={{ height: gapBetweenTimerAndContentPx }} />

          {/* 방향/숫자/버튼 (bands의 contentStartPercent ~ contentEndPercent). mascotIsActive일 때만 디렉션, 아니면 숫자·버튼 0.6 : 0.4 */}
          <View className="w-full flex-1 items-center" style={contentContainerStyle}>
            <View className="w-full flex-1">
              {mascotIsActive && (
                <View className="items-center justify-center w-full" style={{ flex: 0.25 }}>
                  <CounterDirection
                    mascotIsActive={mascotIsActive}
                    wayIsChange={wayIsChange}
                    way={way}
                    currentCount={counter.count}
                    repeatRules={counter.repeatRules || []}
                    imageWidth={imageWidth}
                    imageHeight={imageHeight}
                    screenSize={screenSize}
                    onToggleWay={toggleWay}
                  />
                </View>
              )}
              <View
                className="items-center justify-center w-full"
                style={{ flex: mascotIsActive ? 0.45 : 0.4 }}
                pointerEvents="none"
              >
                <Text className={`${textClass} font-bold text-black`}>{counter.count}</Text>
              </View>
              {showCounterActions && (
                <View className="items-center justify-center w-full" style={{ flex: mascotIsActive ? 0.3 : 0.6 }}>
                  <CounterActions
                    screenSize={screenSize}
                    iconSize={iconSize}
                    onReset={() => setActiveModal('reset')}
                    onEdit={handleEditOpen}
                  />
                </View>
              )}
            </View>
          </View>

          {/* 서브 모달 아래 영역 예약 (bands 기준 나머지) */}
          <View style={{ height: bottomReservedHeightPx }} />
        </View>
      </Animated.View>

      {/* 구간 기록 모달 - LARGE 화면에서만 표시 */}
      {screenSize === ScreenSize.LARGE && (
        <SegmentRecordModal
          isOpen={counter.sectionModalIsOpen ?? false}
          onToggle={handleSectionModalToggle}
          onUndo={handleSectionUndo}
          screenSize={screenSize}
          width={segmentModalWidth}
          height={segmentModalHeight}
          centerY={segmentModalCenterY}
          sectionRecords={counter.sectionRecords}
        />
      )}

      {/* 보조 카운터 모달 */}
      <SubCounterModal
        isOpen={subModalIsOpen}
        onToggle={handleSubModalToggle}
        onAdd={handleSubAdd}
        onSubtract={handleSubSubtract}
        onReset={handleSubReset}
        onEdit={handleSubEdit}
        onRule={handleSubRule}
        handleWidth={subModalHandleWidth}
        subCount={subCount}
        subRule={subRule}
        subRuleIsActive={subRuleIsActive}
        screenSize={screenSize}
        width={subModalWidth}
        height={subModalHeight}
        centerY={subModalCenterY}
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
