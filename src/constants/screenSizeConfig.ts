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
 * 화면 크기별 아이콘 마진 설정
 */
export const iconMarginConfig = {
  [ScreenSize.COMPACT]: 'mt-3',           // 컴팩트: 위쪽 여백만
  [ScreenSize.SMALL]: 'mt-3',             // 작음: 위쪽 여백만
  [ScreenSize.LARGE]: 'mt-12 mb-14',      // 큼: 위아래 여백
};

/**
 * 화면 크기별 숫자 텍스트 스타일 설정
 */
export const textClassConfig = {
  [ScreenSize.COMPACT]: 'text-5xl mb-7',      // 컴팩트: 작은 글씨, 아래 여백
  [ScreenSize.SMALL]: 'text-7xl mb-2 mt-3',   // 작음: 중간 글씨, 위아래 여백
  [ScreenSize.LARGE]: 'text-8xl mb-10 mt-10', // 큼: 큰 글씨, 큰 여백
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
 * 화면 크기에 따른 아이콘 마진을 반환합니다.
 * @param screenSize - 화면 크기
 * @returns 아이콘 마진 클래스
 */
export const getIconMargin = (screenSize: ScreenSize): string => {
  return iconMarginConfig[screenSize];
};

/**
 * 화면 크기에 따른 텍스트 클래스를 반환합니다.
 * @param screenSize - 화면 크기
 * @returns 텍스트 클래스
 */
export const getTextClass = (screenSize: ScreenSize): string => {
  return textClassConfig[screenSize];
};
