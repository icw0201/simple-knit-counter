/**
 * 텍스트 길이에 따라 적절한 폰트 크기를 미리 계산
 * 컨테이너 크기와 텍스트 길이를 고려하여 초기 폰트 크기를 결정
 */

// 상수 정의
const CONTAINER_WIDTH_RATIO = 0.6; // 컨테이너 너비 비율 (이미지 너비 대비)
const CHAR_WIDTH_RATIO = 0.6; // 한 글자당 폰트 크기의 너비 비율 (한글 기준)
const MIN_FONT_SIZE_RATIO = 0.1; // 최소 폰트 크기 비율 (이미지 높이 대비)
const MAX_FONT_SIZE_RATIO = 0.4; // 최대 폰트 크기 비율 (이미지 높이 대비)
const MID_FONT_SIZE_RATIO = 0.3; // 중간 폰트 크기 비율 (이미지 높이 대비)
const LONG_FONT_SIZE_RATIO = 0.25; // 긴 텍스트 폰트 크기 비율 (이미지 높이 대비)
const VERY_LONG_MIN_FONT_SIZE_RATIO = 0.15; // 매우 긴 텍스트 최소 폰트 크기 비율
const CONTAINER_FILL_THRESHOLD = 0.8; // 컨테이너 채움 임계값 (80%)
const LONG_TEXT_MULTIPLIER = 1.3; // 매우 긴 텍스트 폰트 크기 배율

// 텍스트 길이 임계값
const SHORT_TEXT_LENGTH = 3;
const MID_TEXT_LENGTH = 6;
const LONG_TEXT_LENGTH = 10;

export const calculateInitialFontSize = (
  textLength: number,
  imageWidth: number,
  imageHeight: number
): number => {
  const containerWidth = imageWidth * CONTAINER_WIDTH_RATIO;
  const minFontSize = imageHeight * MIN_FONT_SIZE_RATIO;
  const maxFontSize = imageHeight * MAX_FONT_SIZE_RATIO;

  // 텍스트 길이에 따른 대략적인 폰트 크기 계산
  // 한글 기준: 한 글자당 대략 폰트 크기의 CHAR_WIDTH_RATIO 배 정도의 너비를 차지한다고 가정
  // 예: 폰트 크기 30이면 한 글자 너비 약 18px (30 * 0.6)
  if (textLength <= SHORT_TEXT_LENGTH) {
    // 짧은 텍스트 (1-3자): 말풍선을 꽉 채우도록 큰 폰트
    return maxFontSize;
  } else if (textLength <= MID_TEXT_LENGTH) {
    // 중간 텍스트 (4-6자): 적당한 크기
    const estimatedWidth = textLength * maxFontSize * CHAR_WIDTH_RATIO;
    if (estimatedWidth < containerWidth * CONTAINER_FILL_THRESHOLD) {
      return Math.min(maxFontSize, containerWidth / textLength / CHAR_WIDTH_RATIO);
    }
    return imageHeight * MID_FONT_SIZE_RATIO;
  } else if (textLength <= LONG_TEXT_LENGTH) {
    // 긴 텍스트 (7-10자): 작은 폰트
    const estimatedWidth = textLength * imageHeight * LONG_FONT_SIZE_RATIO * CHAR_WIDTH_RATIO;
    if (estimatedWidth > containerWidth) {
      return Math.max(minFontSize, containerWidth / textLength / CHAR_WIDTH_RATIO);
    }
    return imageHeight * LONG_FONT_SIZE_RATIO;
  } else {
    // 매우 긴 텍스트 (11-15자): 조금 더 큰 폰트로 가독성 확보
    const calculatedSize = containerWidth / textLength / CHAR_WIDTH_RATIO;
    return Math.max(imageHeight * VERY_LONG_MIN_FONT_SIZE_RATIO, calculatedSize * LONG_TEXT_MULTIPLIER);
  }
};
