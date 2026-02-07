import { RepeatRule } from '@storage/types';

/**
 * 규칙이 적용되는 단인지 확인하는 함수
 * @param count 확인할 단수
 * @param rule 반복 규칙
 * @returns 규칙이 적용되는 단이면 true, 아니면 false
 */
export const isRuleApplied = (count: number, rule: RepeatRule): boolean => {
  const { startNumber, endNumber, ruleNumber } = rule;

  // 규칙이 입력되지 않았으면 false
  if (ruleNumber === 0) {
    return false;
  }

  if (startNumber > 0 && endNumber > 0) {
    // 시작단과 종료단 둘 다 있는 경우: 시작단 포함, ruleNumber 간격으로 적용
    let current = startNumber;
    while (current <= endNumber) {
      if (current === count) {
        return true;
      }
      current += ruleNumber;
    }
  } else if (startNumber > 0) {
    // 시작단만 있는 경우: 시작단 포함, ruleNumber 간격으로 적용
    if (count >= startNumber) {
      return (count - startNumber) % ruleNumber === 0;
    }
  } else if (endNumber > 0) {
    // 종료단만 있는 경우: ruleNumber부터 종료단까지
    let current = ruleNumber;
    while (current <= endNumber) {
      if (current === count) {
        return true;
      }
      current += ruleNumber;
    }
  }

  return false;
};

/**
 * 규칙 미리보기 계산 (시작단 포함)
 * 규칙이 적용되는 단들의 배열을 반환합니다.
 * @param startNumber 시작단
 * @param endNumber 종료단
 * @param ruleNumber 룰넘버 (몇 단마다)
 * @param maxCount 최대 반환 개수 (기본값: 5)
 * @returns 규칙이 적용되는 단들의 배열
 */
export const calculateRulePreview = (
  startNumber: number,
  endNumber: number,
  ruleNumber: number,
  maxCount: number = 5
): number[] => {
  // 규칙이 입력되지 않았으면 빈 배열 반환
  if (ruleNumber === 0) {
    return [];
  }

  const results: number[] = [];

  if (startNumber > 0 && endNumber > 0) {
    // 시작단과 종료단 둘 다 있는 경우: 시작단 포함, ruleNumber 간격으로 적용
    let current = startNumber;
    while (current <= endNumber && results.length < maxCount) {
      results.push(current);
      current += ruleNumber;
    }
  } else if (startNumber > 0) {
    // 시작단만 있는 경우: 시작단 포함, ruleNumber 간격으로 적용
    let current = startNumber;
    for (let i = 0; i < maxCount; i++) {
      results.push(current);
      current += ruleNumber;
    }
  } else if (endNumber > 0) {
    // 종료단만 있는 경우: ruleNumber부터 종료단까지
    let current = ruleNumber;
    while (current <= endNumber && results.length < maxCount) {
      results.push(current);
      current += ruleNumber;
    }
  }

  return results;
};

