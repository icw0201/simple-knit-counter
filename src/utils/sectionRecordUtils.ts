import { SectionRecord } from '@storage/types';

/**
 * 편집 내용 타입에 따른 표시 텍스트 반환
 */
export const getEditContentText = (record: SectionRecord): string => {
  const { editContent, editedCount, editedMainCount } = record;

  switch (editContent) {
    case 'count_increase':
      return `${editedMainCount ?? 0}단 (+)`;
    case 'count_decrease':
      return `${editedMainCount ?? 0}단 (-)`;
    case 'count_reset':
      return '단수 초기화';
    case 'count_edit':
      return `${editedMainCount ?? 0}단 (단수 편집)`;
    case 'sub_count_increase':
      return `${editedMainCount ?? 0}단 ${editedCount}코 (+)`;
    case 'sub_count_decrease':
      return `${editedMainCount ?? 0}단 ${editedCount}코 (-)`;
    case 'sub_count_reset':
      return '코수 초기화';
    case 'sub_count_edit':
      return `${editedMainCount ?? 0}단 ${editedCount}코 (코수 편집)`;
    case 'sub_rule_activate':
      // 단수/코수가 바뀌는 경우에만 숫자 표시
      if (editedMainCount !== undefined) {
        return `${editedMainCount}단 ${editedCount}코 (코수 규칙 활성화)`;
      }
      return '코수 규칙 활성화';
    case 'sub_rule_deactivate':
      return '코수 규칙 비활성화';
    case 'way_change_front':
      return '방향 변경 (앞)';
    case 'way_change_back':
      return '방향 변경 (뒤)';
    default:
      return '';
  }
};

