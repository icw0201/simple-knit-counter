// src/components/list/ItemRow.tsx
import React from 'react';
import { View } from 'react-native';
import ItemBox from './ItemBox';
import CircleIcon from '@components/common/CircleIcon';
import { Item } from '@storage/types';
import { getProgressPercentage, isItemCompleted, getElapsedTimeValue } from '@utils/sortUtils';
import { getShowElapsedTimeInListSetting } from '@storage/settings';
import { formatElapsedTime } from '@utils/timeUtils';

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

  const getElapsedTimeText = () => {
    const showElapsed = getShowElapsedTimeInListSetting();
    if (!showElapsed) {
      return undefined;
    }

    const seconds = getElapsedTimeValue(item);
    const { formatted } = formatElapsedTime(seconds);
    return formatted;
  };

  // util 함수를 사용하여 진행률 계산
  const progressValue = getProgressPercentage(item);
  const progressPercentage = progressValue > 0 ? progressValue : undefined;

  // util 함수를 사용하여 완료 상태 확인
  const isCompleted = isItemCompleted(item);

  return (
    <View className="mb-4 flex-row items-center">
      <View className="flex-1 mr-2">
        <ItemBox
          title={item.title}
          subtitle={getSubtitle()}
          number={getNumber()}
          elapsedTimeText={getElapsedTimeText()}
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
            colorStyle="lightest"
            isButton
            onPress={() => onDelete(item)}
          />
        </View>
      )}
    </View>
  );
};

export default ItemRow;
