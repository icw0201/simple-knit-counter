// src/components/list/ItemRow.tsx
import React from 'react';
import { View } from 'react-native';
import RoundedBox from '@components/common/RoundedBox';
import CircleIcon from '@components/common/CircleIcon';
import { Item, Counter } from '@storage/types';

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

  const progressPercentage = item.type === 'counter' && (item as Counter).targetCount > 0
    ? ((item as Counter).count / (item as Counter).targetCount) * 100
    : undefined;

  return (
    <View className="mb-4 flex-row items-center">
      <View className="flex-1 mr-2">
        <RoundedBox
          title={item.title}
          subtitle={getSubtitle()}
          number={getNumber()}
          layoutStyle="C"
          colorStyle={isEditMode ? 'B' : 'A'}
          isButton
          onPress={() => onPress(item)}
          onLongPress={() => onLongPress(item)}
          progressPercentage={progressPercentage}
        />
      </View>

      {/* 편집 모드일 때 삭제 아이콘 */}
      {isEditMode && (
        <View className="ml-2">
          <CircleIcon
            size={48}
            iconName="trash-2"
            colorStyle="D"
            isButton
            onPress={() => onDelete(item)}
          />
        </View>
      )}
    </View>
  );
};

export default ItemRow;
