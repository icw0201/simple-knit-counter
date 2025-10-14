
/**
 * 진행 방향 타입
 * - front: 앞으로 진행
 * - back: 뒤로 진행
 */
export type Way = 'front' | 'back';

// 프로젝트/카운터 정보 타입
export type Info = {
  startDate?: string; // 시작일 (8자리 yyyyMMdd 형식)
  endDate?: string;   // 종료일 (8자리 yyyyMMdd 형식)
  gauge?: string;     // 게이지 정보 (최대 500자)
  yarn?: string;      // 실 정보 (최대 500자)
  needle?: string;    // 바늘 정보 (최대 500자)
  notes?: string;     // 메모 (최대 500자)
  way?: Way;          // 진행 방향
};

// 카운터 아이템 타입
export type Counter = {
  id: string;                    // 고유 식별자
  type: 'counter';              // 타입 (항상 'counter')
  title: string;                 // 카운터 제목
  count: number;                 // 현재 카운트 수
  targetCount?: number;          // 목표 단수 (옵션)
  elapsedTime?: number;          // 소요 시간 (옵션)
  timerIsActive?: boolean;       // 타이머 활성화 상태 (옵션)
  parentProjectId?: string | null; // 상위 프로젝트 ID (독립 카운터는 null)
  info?: Info;                   // 카운터 정보 (독립 카운터만 사용)
  // 보조 카운터 필드들
  subCount: number;              // 보조 카운터의 현재 카운트 수
  subRule: number;               // 보조 카운터의 규칙 번호
  subRuleIsActive: boolean;      // 보조 카운터의 규칙 활성화 여부
  subModalIsOpen: boolean;       // 보조 카운터 모달 열림 여부
  // 마스코트 반복 규칙 필드들
  mascotIsActive: boolean;       // 마스코트 활성화 여부
  wayChange: boolean;            // 마스코트 앞뒤 변경 여부
  repeatRuleIsActive: boolean;   // 반복 규칙 활성화 여부
  repeatRuleNumber: number;      // 반복 규칙 숫자
  repeatRuleStartNumber: number; // 반복 규칙 시작 숫자
  repeatRuleEndNumber: number;   // 반복 규칙 종료 숫자
  // 구간 기록 필드 (최신 3개만 저장)
  sectionRecords: SectionRecord[]; // 구간 기록 배열
  sectionModalIsOpen: boolean;     // 구간 기록 모달 열림 여부
  updatedAt?: number;            // 마지막 업데이트 시각 (epoch ms)
};

// 프로젝트 아이템 타입
export type Project = {
  id: string;        // 고유 식별자
  type: 'project';  // 타입 (항상 'project')
  title: string;     // 프로젝트 제목
  counterIds: string[]; // 하위 카운터 ID 배열
  info?: Info;       // 프로젝트 정보
  updatedAt?: number; // 마지막 업데이트 시각 (epoch ms)
};

// 편집 내용 로그 타입
export type EditLogType =
  | 'count_increase'     // 단수 증
  | 'count_decrease'     // 단수 감
  | 'count_reset'        // 단수 초기화
  | 'count_edit'         // 단수 편집
  | 'sub_count_increase' // 코수 증
  | 'sub_count_decrease' // 코수 감
  | 'sub_count_reset'    // 코수 초기화
  | 'sub_count_edit'     // 코수 편집
  | 'sub_rule_activate'; // 코수 규칙 활성화

// 구간 기록 타입
export type SectionRecord = {
  time: string;          // 시간 (HH:MM:SS 형식)
  editedCount: number;   // 편집 후 코수
  editContent: EditLogType; // 편집 내용
};

// 정렬 기준 타입
export type SortCriteria = 'name' | 'created' | 'startDate' | 'endDate' | 'progress' | 'elapsedTime';

// 정렬 순서 타입
export type SortOrder = 'asc' | 'desc';

// 모든 아이템의 공통 타입 (프로젝트 또는 카운터)
export type Item = Project | Counter;
