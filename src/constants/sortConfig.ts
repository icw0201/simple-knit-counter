import { SortCriteria, SortOrder } from '@storage/types';

//정렬 기준 한글 옵션을 storage 값으로 매핑
export const SORT_CRITERIA_MAP: Record<string, SortCriteria> = {
  '이름': 'name',
  '생성일': 'created',
  '시작일': 'startDate',
  '종료일': 'endDate',
  '진행률': 'progress',
  '소요시간': 'elapsedTime',
};

//storage 값을 한글 옵션으로 역매핑
export const SORT_CRITERIA_REVERSE_MAP: Record<SortCriteria, string> = {
  'name': '이름',
  'created': '생성일',
  'startDate': '시작일',
  'endDate': '종료일',
  'progress': '진행률',
  'elapsedTime': '소요시간',
};

//정렬 순서 한글 옵션을 storage 값으로 매핑
export const SORT_ORDER_MAP: Record<string, SortOrder> = {
  '오름차순': 'asc',
  '내림차순': 'desc',
};

//storage 값을 한글 옵션으로 역매핑
export const SORT_ORDER_REVERSE_MAP: Record<SortOrder, string> = {
  'asc': '오름차순',
  'desc': '내림차순',
};

//정렬 기준 옵션 목록 (드롭다운 표시 순서)
export const SORT_CRITERIA_OPTIONS = ['이름', '생성일', '시작일', '종료일', '진행률', '소요시간'] as const;

//정렬 순서 옵션 목록 (드롭다운 표시 순서)
export const SORT_ORDER_OPTIONS = ['오름차순', '내림차순'] as const;

