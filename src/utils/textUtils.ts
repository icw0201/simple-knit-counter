/**
 * 텍스트 길이에 따라 적절한 폰트 크기를 미리 계산
 * 컨테이너 크기와 텍스트 길이를 고려하여 초기 폰트 크기를 결정
 */
export const calculateInitialFontSize = (
  textLength: number,
  imageWidth: number,
  imageHeight: number
): number => {
  const containerWidth = imageWidth * 0.6;
  const minFontSize = imageHeight * 0.1;
  const maxFontSize = imageHeight * 0.4;

  // 텍스트 길이에 따른 대략적인 폰트 크기 계산
  // 한글 기준: 한 글자당 대략 폰트 크기의 0.6배 정도의 너비를 차지한다고 가정
  if (textLength <= 3) {
    // 짧은 텍스트: 말풍선을 꽉 채우도록 큰 폰트
    return maxFontSize;
  } else if (textLength <= 6) {
    // 중간 텍스트: 적당한 크기
    const estimatedWidth = (textLength * maxFontSize * 0.6);
    if (estimatedWidth < containerWidth * 0.8) {
      return Math.min(maxFontSize, containerWidth / textLength / 0.6);
    }
    return imageHeight * 0.3;
  } else if (textLength <= 10) {
    // 긴 텍스트: 작은 폰트
    const estimatedWidth = (textLength * imageHeight * 0.25 * 0.6);
    if (estimatedWidth > containerWidth) {
      return Math.max(minFontSize, containerWidth / textLength / 0.6);
    }
    return imageHeight * 0.25;
  } else {
    // 매우 긴 텍스트 (10-15자): 조금 더 큰 폰트
    const calculatedSize = containerWidth / textLength / 0.6;
    // 최소값을 조금 높여서 더 보기 좋게
    return Math.max(imageHeight * 0.15, calculatedSize * 1.3);
  }
};
