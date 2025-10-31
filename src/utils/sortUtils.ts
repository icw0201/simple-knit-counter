import { Item, Counter, Project, SortCriteria, SortOrder } from '@storage/types';
import { getStoredItems } from '@storage/storage';

//진행률 계산
export const getProgressPercentage = (item: Item): number => {
  if (item.type === 'counter') {
    // 카운터: count / targetCount * 100으로 계산 (targetCount가 0이면 0 반환)
    const counter = item as Counter;
    if (counter.targetCount > 0) {
      return (counter.count / counter.targetCount) * 100;
    }
    return 0;
  } else if (item.type === 'project') {
    // 프로젝트: 하위 카운터 중 완료된 카운터의 비율로 계산
    //   - 완료 기준: 각 하위 카운터의 count / targetCount >= 100%
    //   - 진행률 = (완료된 카운터 수 / 전체 하위 카운터 수) * 100
    const project = item as Project;
    const allItems = getStoredItems();
    const childCounters = allItems.filter(
      (i): i is Counter => i.type === 'counter' && project.counterIds.includes(i.id)
    );

    if (childCounters.length > 0) {
      const completedCounters = childCounters.filter((counter) => {
        if (counter.targetCount > 0) {
          const counterProgress = (counter.count / counter.targetCount) * 100;
          return counterProgress >= 100;
        }
        return false;
      });
      return (completedCounters.length / childCounters.length) * 100;
    }
    return 0;
  }
  return 0;
};

//아이템이 완료되었는지 확인합니다.
export const isItemCompleted = (item: Item): boolean => {
  const progressPercentage = getProgressPercentage(item);

  if (item.type === 'counter') {
    // 카운터: 진행률이 100% 이상이거나 endDate가 설정되어 있는 경우 완료로 간주
    const counter = item as Counter;
    return (
      (progressPercentage >= 100) ||
      (counter.info?.endDate !== undefined && counter.info.endDate !== '' && counter.info.endDate !== null)
    );
  } else if (item.type === 'project') {
    // 프로젝트: endDate가 설정되어 있으면 완료
    // 또는 모든 하위 카운터가 완료 상태인 경우 완료
    //   (하위 카운터 완료 기준: 각 카운터의 count / targetCount >= 100%)
    const project = item as Project;
    const hasEndDate = project.info?.endDate !== undefined && project.info.endDate !== '' && project.info.endDate !== null;

    if (hasEndDate) {
      return true;
    }

    const allItems = getStoredItems();
    const childCounters = allItems.filter(
      (i): i is Counter => i.type === 'counter' && project.counterIds.includes(i.id)
    );

    if (childCounters.length > 0) {
      return childCounters.every((counter) => {
        if (counter.targetCount > 0) {
          const counterProgress = (counter.count / counter.targetCount) * 100;
          return counterProgress >= 100;
        }
        return false;
      });
    }
    return false;
  }
  return false;
};

//아이템을 정렬 기준에 따라 비교합니다.
const compareItems = (a: Item, b: Item, criteria: SortCriteria, order: SortOrder): number => {
  let aValue: string | number = '';
  let bValue: string | number = '';

  switch (criteria) {
    case 'name':
      aValue = a.title.toLowerCase();
      bValue = b.title.toLowerCase();
      break;

    case 'created':
      // ID에서 타임스탬프 추출 (format: counter_1234567890 or proj_1234567890)
      aValue = parseInt(a.id.split('_')[1] || '0', 10);
      bValue = parseInt(b.id.split('_')[1] || '0', 10);
      break;

    case 'startDate':
      // 빈 문자열도 처리 (날짜가 없는 경우 빈 문자열로 정렬)
      aValue = (a.info?.startDate && a.info.startDate !== '') ? a.info.startDate : '';
      bValue = (b.info?.startDate && b.info.startDate !== '') ? b.info.startDate : '';
      break;

    case 'endDate':
      // 빈 문자열도 처리 (날짜가 없는 경우 빈 문자열로 정렬)
      aValue = (a.info?.endDate && a.info.endDate !== '') ? a.info.endDate : '';
      bValue = (b.info?.endDate && b.info.endDate !== '') ? b.info.endDate : '';
      break;

    case 'progress':
      aValue = getProgressPercentage(a);
      bValue = getProgressPercentage(b);
      break;

    // TODO: elapsedTime 정렬 기능 구현
    case 'elapsedTime':
      // 미구현 상태
      aValue = 0;
      bValue = 0;
      break;
  }

  let comparison = 0;

  if (typeof aValue === 'string' && typeof bValue === 'string') {
    comparison = aValue.localeCompare(bValue);
  } else if (typeof aValue === 'number' && typeof bValue === 'number') {
    comparison = aValue - bValue;
  }

  return order === 'asc' ? comparison : -comparison;
};

/**
 * 아이템 배열을 정렬합니다.
 * @param items 정렬할 아이템 배열
 * @param criteria 정렬 기준
 * @param order 정렬 순서
 * @param moveCompletedToBottom 완성된 편물을 하단으로 이동할지 여부
 * @returns 정렬된 아이템 배열
 */
export const sortItems = (
  items: Item[],
  criteria: SortCriteria,
  order: SortOrder,
  moveCompletedToBottom: boolean
): Item[] => {
  // 완성된 편물을 하단으로 이동하는 경우
  if (moveCompletedToBottom) {
    const completedItems: Item[] = [];
    const incompleteItems: Item[] = [];

    items.forEach((item) => {
      if (isItemCompleted(item)) {
        completedItems.push(item);
      } else {
        incompleteItems.push(item);
      }
    });

    // 각 그룹을 정렬
    const sortedIncomplete = incompleteItems.sort((a, b) => compareItems(a, b, criteria, order));
    const sortedCompleted = completedItems.sort((a, b) => compareItems(a, b, criteria, order));

    return [...sortedIncomplete, ...sortedCompleted];
  }

  // 일반 정렬
  return items.sort((a, b) => compareItems(a, b, criteria, order));
};

