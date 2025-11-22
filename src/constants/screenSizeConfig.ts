// src/constants/screenSizeConfig.ts

import { DimensionValue } from 'react-native';

/**
 * 화면 크기에 따른 UI 요소 크기 분류
 * 컴팩트, 작음, 중간, 큼으로 구분하여 반응형 UI 제공
 */
export enum ScreenSize {
  COMPACT = 'COMPACT',   // 250x250 이하 (매우 작은 화면)
  SMALL = 'SMALL',       // 450 이하 (작은 화면)
  LARGE = 'LARGE',       // 450 초과 (큰 화면)
}


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
 * 화면 크기에 따른 gap 클래스를 반환합니다.
 * @param screenSize - 화면 크기
 * @returns gap 클래스
 */
export const getGapClass = (screenSize: ScreenSize): string => {
  const gapConfig = {
    [ScreenSize.COMPACT]: 'mt-2 mb-2',          // 컴팩트: 작은 간격
    [ScreenSize.SMALL]: 'mt-3 mb-3',            // 작음: 중간 간격
    [ScreenSize.LARGE]: 'mt-8 mb-8',          // 큼: 큰 간격
  };
  return gapConfig[screenSize];
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
 * 화면 크기에 따른 서브 모달 width 비율을 반환합니다.
 * @param screenSize - 화면 크기
 * @returns width 비율 (0.0 ~ 1.0)
 */
export const getSubModalWidthRatio = (screenSize: ScreenSize): number => {
  const subModalWidthRatioConfig = {
    [ScreenSize.COMPACT]: 1.0,    // 컴팩트: 100%
    [ScreenSize.SMALL]: 1.0,      // 작음: 100%
    [ScreenSize.LARGE]: 0.9,      // 큼: 90%
  };
  return subModalWidthRatioConfig[screenSize];
};

/**
 * 화면 크기에 따른 서브 모달 height 비율을 반환합니다.
 * @param screenSize - 화면 크기
 * @returns height 비율 (0.0 ~ 1.0)
 */
export const getSubModalHeightRatio = (screenSize: ScreenSize): number => {
  const subModalHeightRatioConfig = {
    [ScreenSize.COMPACT]: 0.45,   // 컴팩트: 45%
    [ScreenSize.SMALL]: 0.45,     // 작음: 45%
    [ScreenSize.LARGE]: 0.27,     // 큼: 27%
  };
  return subModalHeightRatioConfig[screenSize];
};

/**
 * 화면 크기에 따른 서브 모달 top 위치를 반환합니다.
 * @param screenSize - 화면 크기
 * @returns top 위치 (DimensionValue)
 */
export const getSubModalTop = (screenSize: ScreenSize): DimensionValue => {
  const subModalTopConfig: Record<ScreenSize, DimensionValue> = {
    [ScreenSize.COMPACT]: '80%',  // 컴팩트: 80%
    [ScreenSize.SMALL]: '85%',    // 작음: 85%
    [ScreenSize.LARGE]: '80%',    // 큼: 80%
  };
  return subModalTopConfig[screenSize];
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

/**
 * 화면 크기에 따른 구간 기록 모달 top 위치를 반환합니다.
 * SubCounterModal 위에 배치되며, SubCounterModal 상단(80%)에서 구간 기록 모달 높이(15%)와 간격(12%)을 뺀 값입니다.
 * @param screenSize - 화면 크기
 * @returns top 위치 (DimensionValue, LARGE일 때만 '53%')
 */
export const getSegmentModalTop = (screenSize: ScreenSize): DimensionValue => {
  const segmentModalTopConfig: Record<ScreenSize, DimensionValue> = {
    [ScreenSize.COMPACT]: 0,      // 컴팩트: 사용 안 함
    [ScreenSize.SMALL]: 0,        // 작음: 사용 안 함
    [ScreenSize.LARGE]: '53%',   // 큼: 53% (80% - 13% - 14%)
  };
  return segmentModalTopConfig[screenSize];
};

// ===== 패딩 탑 애니메이션 상수 =====

/**
 * 구간 기록 모달 실행 취소 버튼 아이콘 크기
 * 서브 아이콘 LARGE 크기와 동일 (44)
 */
export const SEGMENT_UNDO_ICON_SIZE = 44;

/**
 * 패딩 탑 배수 (기본값)
 */
export const PADDING_TOP_MULTIPLIER = 0;

/**
 * SubCounterModal 열릴 때 패딩 탑 배수 (2배)
 */
export const PADDING_TOP_RATIO = 2;
