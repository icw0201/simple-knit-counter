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

/**
 * 화면 크기별 아이콘 크기 설정
 */
export const iconSizeConfig = {
  [ScreenSize.COMPACT]: 44,   // 컴팩트: 작은 아이콘
  [ScreenSize.SMALL]: 52,     // 작음: 중간 아이콘
  [ScreenSize.LARGE]: 64,     // 큼: 큰 아이콘
};

/**
 * 화면 크기별 서브 아이콘 크기 설정 (서브모달용, 더 작은 크기)
 */
export const subIconSizeConfig = {
  [ScreenSize.COMPACT]: 32,   // 컴팩트: 매우 작은 아이콘
  [ScreenSize.SMALL]: 36,     // 작음: 작은 아이콘
  [ScreenSize.LARGE]: 44,     // 큼: 중간 아이콘
};


/**
 * 화면 크기별 숫자 텍스트 스타일 설정
 */
export const textClassConfig = {
  [ScreenSize.COMPACT]: 'text-5xl',      // 컴팩트: 작은 글씨
  [ScreenSize.SMALL]: 'text-7xl',        // 작음: 중간 글씨
  [ScreenSize.LARGE]: 'text-8xl',        // 큼: 큰 글씨
};

/**
 * 화면 크기별 컴포넌트 간 세로 간격 설정 (margin-top)
 */
export const gapConfig = {
  [ScreenSize.COMPACT]: 'mt-4',          // 컴팩트: 작은 간격
  [ScreenSize.SMALL]: 'mt-6',            // 작음: 중간 간격
  [ScreenSize.LARGE]: 'mt-16',            // 큼: 큰 간격
};

/**
 * 현재 화면 크기를 판단하여 적절한 ScreenSize 열거값을 반환합니다.
 * @param height - 화면 높이
 * @param width - 화면 너비
 * @returns ScreenSize 열거값
 */
export const getScreenSize = (height: number, width: number): ScreenSize => {
  if (height <= 250 && width <= 250) {
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
  return iconSizeConfig[screenSize];
};

/**
 * 화면 크기에 따른 서브 아이콘 크기를 반환합니다.
 * @param screenSize - 화면 크기
 * @returns 서브 아이콘 크기
 */
export const getSubIconSize = (screenSize: ScreenSize): number => {
  return subIconSizeConfig[screenSize];
};


/**
 * 화면 크기에 따른 텍스트 클래스를 반환합니다.
 * @param screenSize - 화면 크기
 * @returns 텍스트 클래스
 */
export const getTextClass = (screenSize: ScreenSize): string => {
  return textClassConfig[screenSize];
};

/**
 * 화면 크기에 따른 gap 클래스를 반환합니다.
 * @param screenSize - 화면 크기
 * @returns gap 클래스
 */
export const getGapClass = (screenSize: ScreenSize): string => {
  return gapConfig[screenSize];
};
