// src/storage/types.ts

/**
 * 활성화 모드 타입
 * - inactive: 비활성화 상태
 * - auto: 자동 활성화 상태 (기존 active 상태는 auto로 마이그레이션됨)
 */
export type ActivateMode = 'inactive' | 'auto';

/**
 * 진행 방향 타입
 * - front: 앞으로 진행
 * - back: 뒤로 진행
 */
export type Way = 'front' | 'back';

/**
 * 프로젝트/카운터 정보 타입
 */
export type Info = {
  startDate?: string; // 시작일 (8자리 yyyyMMdd 형식)
  endDate?: string;   // 종료일 (8자리 yyyyMMdd 형식)
  gauge?: string;     // 게이지 정보 (최대 500자)
  yarn?: string;      // 실 정보 (최대 500자)
  needle?: string;    // 바늘 정보 (최대 500자)
  notes?: string;     // 메모 (최대 500자)
  way?: Way;          // 진행 방향
};

/**
 * 카운터 아이템 타입
 */
export type Counter = {
  id: string;                    // 고유 식별자
  type: 'counter';              // 타입 (항상 'counter')
  title: string;                 // 카운터 제목
  count: number;                 // 현재 카운트 수
  parentProjectId?: string | null; // 상위 프로젝트 ID (독립 카운터는 null)
  info?: Info;                   // 카운터 정보 (독립 카운터만 사용)
  activateMode?: ActivateMode;   // 활성화 모드
  // 서브 카운터 필드들
  subCount: number;              // 서브 카운터의 현재 카운트 수
  subRule: number;               // 서브 카운터의 규칙 번호
  subRuleIsActive: boolean;      // 서브 카운터의 규칙 활성화 여부
};

/**
 * 프로젝트 아이템 타입
 */
export type Project = {
  id: string;        // 고유 식별자
  type: 'project';  // 타입 (항상 'project')
  title: string;     // 프로젝트 제목
  counterIds: string[]; // 하위 카운터 ID 배열
  info?: Info;       // 프로젝트 정보
};

/**
 * 모든 아이템의 공통 타입 (프로젝트 또는 카운터)
 */
export type Item = Project | Counter;
