// src/constants/screenSizeConfig.ts

/**
 * 화면 크기에 따른 UI 요소 크기 분류
 * 컴팩트, 작음, 중간, 큼으로 구분하여 반응형 UI 제공
 */
export enum ScreenSize {
  COMPACT = 'COMPACT',   // 250x250 이하 (매우 작은 화면)
  SMALL = 'SMALL',       // 450 이하 (작은 화면)
  LARGE = 'LARGE',       // 450 초과 (큰 화면)
}

const PERCENT_GAP = 0;


/**
 * 현재 화면 크기를 판단하여 적절한 ScreenSize 열거값을 반환합니다.
 * @param height - 화면 높이
 * @param width - 화면 너비
 * @returns ScreenSize 열거값
 */
export const getScreenSize = (height: number): ScreenSize => {
  if (height <= 300) {
    return ScreenSize.COMPACT;
  }
  if (height <= 450) {
    return ScreenSize.SMALL;
  }
  return ScreenSize.LARGE;
};

/**
 * 화면 크기에 따른 아이콘 크기를 반환합니다.
 * @param screenSize - 화면 크기
 * @returns 아이콘 크기
 */
export const getIconSize = (screenSize: ScreenSize): number => {
  const iconSizeConfig = {
    [ScreenSize.COMPACT]: 44,   // 컴팩트: 작은 아이콘
    [ScreenSize.SMALL]: 52,     // 작음: 중간 아이콘
    [ScreenSize.LARGE]: 64,     // 큼: 큰 아이콘
  };
  return iconSizeConfig[screenSize];
};

/**
 * 화면 크기에 따른 서브 아이콘 크기를 반환합니다.
 * @param screenSize - 화면 크기
 * @returns 서브 아이콘 크기
 */
export const getSubIconSize = (screenSize: ScreenSize): number => {
  const subIconSizeConfig = {
    [ScreenSize.COMPACT]: 32,   // 컴팩트: 매우 작은 아이콘
    [ScreenSize.SMALL]: 36,     // 작음: 작은 아이콘
    [ScreenSize.LARGE]: 44,     // 큼: 중간 아이콘
  };
  return subIconSizeConfig[screenSize];
};


/**
 * 화면 크기에 따른 텍스트 클래스를 반환합니다.
 * @param screenSize - 화면 크기
 * @returns 텍스트 클래스
 */
export const getTextClass = (screenSize: ScreenSize): string => {
  const textClassConfig = {
    [ScreenSize.COMPACT]: 'text-5xl',      // 컴팩트: 작은 글씨
    [ScreenSize.SMALL]: 'text-7xl',        // 작음: 중간 글씨
    [ScreenSize.LARGE]: 'text-8xl',        // 큼: 큰 글씨
  };
  return textClassConfig[screenSize];
};

/**
 * 화면 크기에 따른 TimeDisplay 텍스트 클래스를 반환합니다.
 * @param screenSize - 화면 크기
 * @returns 텍스트 클래스
 */
export const getTimeDisplayTextClass = (screenSize: ScreenSize): string => {
  const timeDisplayTextClassConfig = {
    [ScreenSize.COMPACT]: 'text-lg',      // 컴팩트: 사용 안 함 (숨김)
    [ScreenSize.SMALL]: 'text-xl',        // 작음: 작은 글씨
    [ScreenSize.LARGE]: 'text-2xl',       // 큼: 큰 글씨
  };
  return timeDisplayTextClassConfig[screenSize];
};

/**
 * 화면 크기에 따른 TimeDisplay 최소 높이를 반환합니다.
 * @param screenSize - 화면 크기
 * @returns 최소 높이 (픽셀)
 */
export const getTimeDisplayMinHeight = (screenSize: ScreenSize): number => {
  const timeDisplayMinHeightConfig = {
    [ScreenSize.COMPACT]: 0,              // 컴팩트: 사용 안 함
    [ScreenSize.SMALL]: 20,                // 작음: 작은 높이
    [ScreenSize.LARGE]: 20,                // 큼: 기본 높이
  };
  return timeDisplayMinHeightConfig[screenSize];
};

/**
 * 화면 크기에 따른 서브 모달 텍스트 마진 클래스를 반환합니다.
 * @param screenSize - 화면 크기
 * @returns 텍스트 마진 클래스
 */
export const getSubModalTextMarginClass = (screenSize: ScreenSize): string => {
  const subModalTextMarginConfig = {
    [ScreenSize.COMPACT]: '',     // 컴팩트: 작은 마진
    [ScreenSize.SMALL]: '',       // 작음: 중간 마진
    [ScreenSize.LARGE]: 'mt-3 mb-8',      // 큼: 큰 마진
  };
  return subModalTextMarginConfig[screenSize];
};

/**
 * 화면 크기에 따른 서브 모달 height 비율을 반환합니다.
 * @param screenSize - 화면 크기
 * @returns height 비율 (0.0 ~ 1.0)
 */
export const getSubModalHeightRatio = (screenSize: ScreenSize): number => {
  const subModalHeightRatioConfig = {
    [ScreenSize.COMPACT]: 0.30,   // 컴팩트: 30%
    [ScreenSize.SMALL]: 0.30,     // 작음: 30%
    [ScreenSize.LARGE]: 0.22,     // 큼: 22%
  };
  return subModalHeightRatioConfig[screenSize];
};

const getSubModalCenterYPercent = (screenSize: ScreenSize): number => {
  const subModalCenterYPercentConfig: Record<ScreenSize, number> = {
    [ScreenSize.COMPACT]: 85,
    [ScreenSize.SMALL]: 85,
    [ScreenSize.LARGE]: 87,
  };
  return subModalCenterYPercentConfig[screenSize];
};

/**
 * 화면 크기에 따른 서브 모달 세로 중앙 위치를 반환합니다.
 * SlideModal에서 centerY로 사용하며, translateY: -height/2 로 실제 상단이 정해짐.
 * @param screenSize - 화면 크기
 * @returns 세로 중앙 위치 퍼센트(예: 85)
 */
export const getSubModalCenterY = (screenSize: ScreenSize): number => {
  return getSubModalCenterYPercent(screenSize);
};

/**
 * 화면 크기에 따른 서브 모달 핸들 너비를 반환합니다.
 * LARGE가 아닐 때는 콘텐츠 공간 확보를 위해 핸들을 더 얇게 사용합니다.
 */
export const getSubModalHandleWidth = (screenSize: ScreenSize): number => {
  const subModalHandleWidthConfig: Record<ScreenSize, number> = {
    [ScreenSize.COMPACT]: 24,
    [ScreenSize.SMALL]: 24,
    [ScreenSize.LARGE]: 30,
  };
  return subModalHandleWidthConfig[screenSize];
};

/**
 * 화면 크기에 따른 구간 기록 모달 height 비율을 반환합니다.
 * @param screenSize - 화면 크기
 * @returns height 비율 (0.0 ~ 1.0, LARGE일 때만 0.15)
 */
export const getSegmentModalHeightRatio = (screenSize: ScreenSize): number => {
  const segmentModalHeightRatioConfig = {
    [ScreenSize.COMPACT]: 0,      // 컴팩트: 사용 안 함
    [ScreenSize.SMALL]: 0,        // 작음: 사용 안 함
    [ScreenSize.LARGE]: 0.13,     // 큼: 13%
  };
  return segmentModalHeightRatioConfig[screenSize];
};

const getSegmentModalCenterYPercent = (screenSize: ScreenSize): number => {
  const segmentModalCenterYPercentConfig: Record<ScreenSize, number> = {
    [ScreenSize.COMPACT]: 0,
    [ScreenSize.SMALL]: 0,
    [ScreenSize.LARGE]: 21,
  };
  return segmentModalCenterYPercentConfig[screenSize];
};

/**
 * 화면 크기에 따른 구간 기록 모달 세로 중앙 위치를 반환합니다.
 * SlideModal에서 centerY로 사용함.
 * @param screenSize - 화면 크기
 * @returns 세로 중앙 위치 퍼센트 (LARGE일 때만 23)
 */
export const getSegmentModalCenterY = (screenSize: ScreenSize): number => {
  if (screenSize !== ScreenSize.LARGE) {
    return 0;
  }
  return getSegmentModalCenterYPercent(screenSize);
};

/**
 * 서브 모달의 상단 경계(%)를 반환합니다.
 * 동일 좌표계에서 메인 콘텐츠 종료 지점 계산에 사용합니다.
 */
export const getSubModalTopEdgePercent = (screenSize: ScreenSize): number => {
  const centerPercent = getSubModalCenterYPercent(screenSize);
  const heightPercent = getSubModalHeightRatio(screenSize) * 100;
  return centerPercent - (heightPercent / 2);
};

/**
 * 구간 기록 모달의 하단 경계(%)를 반환합니다.
 * 동일 좌표계에서 메인 콘텐츠 시작 지점 계산에 사용합니다.
 */
export const getSegmentModalBottomEdgePercent = (screenSize: ScreenSize): number => {
  const centerPercent = getSegmentModalCenterYPercent(screenSize);
  const heightPercent = getSegmentModalHeightRatio(screenSize) * 100;
  return centerPercent + (heightPercent / 2);
};

/**
 * 구간 기록 모달의 상단 경계(%)를 반환합니다.
 * 타이머 종료 지점과 정렬할 때 사용합니다.
 */
export const getSegmentModalTopEdgePercent = (screenSize: ScreenSize): number => {
  const centerPercent = getSegmentModalCenterYPercent(screenSize);
  const heightPercent = getSegmentModalHeightRatio(screenSize) * 100;
  return centerPercent - (heightPercent / 2);
};

/**
 * 구간 기록 모달 실행 취소 버튼 아이콘 크기
 * 서브 아이콘 LARGE 크기와 동일 (44)
 */
export const SEGMENT_UNDO_ICON_SIZE = getSubIconSize(ScreenSize.LARGE);

// ===== CounterDetail 세로 구간(%) =====

export type CounterDetailVerticalBands = {
  /**
   * ProgressBar 바로 아래를 0%로 봤을 때가 아니라,
   * "화면 전체 높이" 기준 퍼센트(%)입니다.
   * CounterDetail에서는 ProgressBar 높이(px)를 빼서 실제 높이를 계산해 사용합니다.
   */
  timerEndPercent: number;      // 0% ~ timerEndPercent
  contentStartPercent: number;  // contentStartPercent ~ contentEndPercent
  contentEndPercent: number;
};


/**
 * CounterDetail의 타이머/메인 컨텐츠(방향·숫자·버튼) 세로 구간을 화면 퍼센트로 지정합니다.
 * contentEndPercent는 원하면 getSubModalTopEdgePercent(screenSize)로 맞출 수 있음 (서브 모달 상단과 정렬).
 */
export const getCounterDetailVerticalBands = (screenSize: ScreenSize): CounterDetailVerticalBands => {
  const smallTimerEndPercent = 20;
  const smallContentStartPercent = smallTimerEndPercent + PERCENT_GAP;
  const smallContentEndPercent = getSubModalTopEdgePercent(ScreenSize.SMALL) - PERCENT_GAP;
  const largeTimerEndPercent = getSegmentModalTopEdgePercent(ScreenSize.LARGE) - PERCENT_GAP;
  const largeContentStartPercent = getSegmentModalBottomEdgePercent(ScreenSize.LARGE) + PERCENT_GAP;
  const largeContentEndPercent = getSubModalTopEdgePercent(ScreenSize.LARGE) - PERCENT_GAP;

  const config: Record<ScreenSize, CounterDetailVerticalBands> = {
    [ScreenSize.COMPACT]: { timerEndPercent: 20, contentStartPercent: 35, contentEndPercent: 70 },
    [ScreenSize.SMALL]: {
      timerEndPercent: smallTimerEndPercent,
      contentStartPercent: smallContentStartPercent,
      contentEndPercent: smallContentEndPercent,
    },
    [ScreenSize.LARGE]: {
      timerEndPercent: largeTimerEndPercent,
      contentStartPercent: largeContentStartPercent,
      contentEndPercent: largeContentEndPercent,
    },
  };
  return config[screenSize];
};
