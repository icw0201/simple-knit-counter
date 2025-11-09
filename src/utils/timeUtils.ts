export interface FormattedElapsedTime {
  formatted: string;
  hours: string;
  minutes: string;
  seconds: string;
}

/**
 * 초 단위 시간을 H:MM:SS 또는 HH:MM:SS 형식으로 변환하고
 * 표시용 문자열과 시간/분/초 문자열을 함께 반환합니다.
 * 시간이 세 자릿수 이상일 때는 필요한 만큼 자릿수가 늘어남
 * 최대값: 9999:59:59 (35999999초)
 * @param seconds 초 단위 시간 (0 ~ 35999999, 음수는 0으로 처리)
 */
export const formatElapsedTime = (seconds: number): FormattedElapsedTime => {
  // 최대값: 9999시간 59분 59초 = 35999999초
  const MAX_SECONDS = 35999999;
  const totalSeconds = Math.min(Math.max(0, seconds), MAX_SECONDS);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const hoursString = String(hours);
  const minutesString = String(minutes).padStart(2, '0');
  const secondsString = String(secs).padStart(2, '0');

  return {
    formatted: `${hoursString}:${minutesString}:${secondsString}`,
    hours: hoursString,
    minutes: minutesString,
    seconds: secondsString,
  };
};

