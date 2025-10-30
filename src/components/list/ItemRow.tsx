// src/components/list/ItemRow.tsx
import React from 'react';
import { View } from 'react-native';
import ItemBox from './ItemBox';
import CircleIcon from '@components/common/CircleIcon';
import { Item, Counter, Project } from '@storage/types';
import { getStoredItems } from '@storage/storage';

interface ItemRowProps {
  item: Item;
  isEditMode: boolean;
  onPress: (item: Item) => void;
  onLongPress: (item: Item) => void;
  onDelete: (item: Item) => void;
}

/**
 * 개별 아이템(프로젝트/카운터) 행 컴포넌트
 *
 * Main과 ProjectDetail에서 공통으로 사용되는 아이템 표시 로직
 */
const ItemRow: React.FC<ItemRowProps> = ({
  item,
  isEditMode,
  onPress,
  onLongPress,
  onDelete,
}) => {
  const getSubtitle = () => {
    return item.type === 'project' ? '프로젝트' : '카운터';
  };

  const getNumber = () => {
    if (item.type === 'project') {
      return item.counterIds?.length ?? 0;
    }
    return item.count;
  };

  let progressPercentage: number | undefined;

  if (item.type === 'counter') {
    // 카운터: count/targetCount로 계산
    const counter = item as Counter;
    if (counter.targetCount > 0) {
      progressPercentage = (counter.count / counter.targetCount) * 100;
    }
  } else if (item.type === 'project') {
    // 프로젝트: 하위 카운터의 완료율로 계산
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
      progressPercentage = (completedCounters.length / childCounters.length) * 100;
    }
  }

  // 완료 상태 확인
  let isCompleted = false;

  if (item.type === 'counter') {
    // 카운터: 100% 이상이거나 endDate가 있는 경우
    isCompleted = (progressPercentage !== undefined && progressPercentage >= 100) ||
                  (item.info?.endDate !== undefined && item.info.endDate !== '');
  } else if (item.type === 'project') {
    // 프로젝트: 종료일이 있거나 하위 카운터가 모두 완료 상태인 경우
    const project = item as Project;
    const hasEndDate = project.info?.endDate !== undefined && project.info.endDate !== '';

    if (hasEndDate) {
      isCompleted = true;
    } else {
      // 하위 카운터 확인
      const allItems = getStoredItems();
      const childCounters = allItems.filter(
        (i): i is Counter => i.type === 'counter' && project.counterIds.includes(i.id)
      );

      if (childCounters.length > 0) {
        // 모든 하위 카운터가 완료 상태인지 확인
        isCompleted = childCounters.every((counter) => {
          if (counter.targetCount > 0) {
            const counterProgress = (counter.count / counter.targetCount) * 100;
            return counterProgress >= 100;
          }
          return false; // targetCount가 없으면 미완료
        });
      }
    }
  }

  return (
    <View className="mb-4 flex-row items-center">
      <View className="flex-1 mr-2">
        <ItemBox
          title={item.title}
          subtitle={getSubtitle()}
          number={getNumber()}
          onPress={() => onPress(item)}
          onLongPress={() => onLongPress(item)}
          progressPercentage={progressPercentage}
          isCompleted={isCompleted}
          isEditMode={isEditMode}
        />
      </View>

      {/* 편집 모드일 때 삭제 아이콘 */}
      {isEditMode && (
        <View className="ml-2">
          <CircleIcon
            size={48}
            iconName="trash-2"
            colorStyle="F"
            isButton
            onPress={() => onDelete(item)}
          />
        </View>
      )}
    </View>
  );
};

export default ItemRow;
