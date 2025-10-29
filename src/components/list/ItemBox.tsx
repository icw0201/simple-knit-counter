// src/components/list/ItemBox.tsx
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import clsx from 'clsx';
import { colorStyles, ColorStyleKey } from '@styles/colorStyles';

interface ItemBoxProps {
  title: string;
  subtitle?: string;
  number?: number;
  colorStyle: ColorStyleKey;
  onPress: () => void;
  onLongPress?: () => void;
  progressPercentage?: number;
  isCompleted?: boolean;
}

/**
 * ItemRow에서 사용하는 박스 컴포넌트
 * 기존 RoundedBox의 레이아웃 스타일 C(제목과 숫자를 좌우로 배치)분리와 프로그레스 바 기능 포함
 */
const ItemBox: React.FC<ItemBoxProps> = ({
  title,
  subtitle,
  number,
  colorStyle,
  onPress,
  onLongPress,
  progressPercentage,
  isCompleted = false,
}) => {
  const { container, text, subtext } = colorStyles[colorStyle];
  const hasProgress = progressPercentage !== undefined && progressPercentage !== null;

  const boxView = (
    <View className={clsx(container, 'rounded-xl', 'relative overflow-hidden')}>
      {/* 완료 상태일 때 전체 배경 채우기 */}
      {isCompleted ? (
        <View
          className="absolute left-0 top-0 bottom-0 right-0 bg-red-orange-400"
          pointerEvents="none"
        />
      ) : (
        /* 미완료 상태일 때만 프로그레스 바 표시 */
        hasProgress && progressPercentage > 0 && (
          <View
            className={`absolute left-0 top-0 bottom-0 bg-red-orange-200 ${progressPercentage >= 100 ? 'right-0' : ''}`}
            style={progressPercentage >= 100 ? undefined : { width: `${progressPercentage}%` }}
            pointerEvents="none"
          />
        )
      )}
      {/* 콘텐츠 - 프로그레스 바 위에 표시 (패딩 포함) */}
      <View className="relative z-10 p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex flex-col">
            {subtitle && (
              <Text className={clsx('text-xs', isCompleted ? 'text-white' : subtext)}>
                {subtitle}
              </Text>
            )}
            <Text className={clsx('text-lg font-semibold', text)}>{title}</Text>
          </View>
          {number !== undefined && (
            <Text className={clsx('text-2xl font-bold', text)}>{number}</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      {boxView}
    </TouchableOpacity>
  );
};

export default ItemBox;

