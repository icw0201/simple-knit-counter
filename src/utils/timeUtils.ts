/**
 * 초 단위 시간을 H:MM:SS 또는 HH:MM:SS 형식으로 변환
 * 시간이 세 자릿수 이상일 때는 필요한 만큼 자릿수가 늘어남
 * 최대값: 9999:59:59 (35999999초)
 * @param seconds 초 단위 시간 (0 ~ 35999999, 음수는 0으로 처리)
 * @returns H:MM:SS 또는 HH:MM:SS 또는 HHH:MM:SS 형식의 문자열 (시간 자릿수 가변)
 */
export const formatElapsedTime = (seconds: number): string => {
  // 최대값: 9999시간 59분 59초 = 35999999초
  const MAX_SECONDS = 35999999;
  const totalSeconds = Math.min(Math.max(0, seconds), MAX_SECONDS);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  // 시간은 필요한 만큼 자릿수 표시 (패딩 없음), 분과 초는 항상 2자리
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

