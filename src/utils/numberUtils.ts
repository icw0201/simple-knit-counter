/** 숫자를 문자열로 변환 (0이면 빈 문자열, 입력 필드용) */
export const numberToString = (num: number): string => {
  return num === 0 ? '' : num.toString();
};
