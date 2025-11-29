import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Pencil } from 'lucide-react-native';
import CircleIcon from '@components/common/CircleIcon';

interface RuleCardProps {
  title: string;
  message: string;
  startNumber: number;
  endNumber: number;
  ruleNumber: number;
  exampleText?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onConfirm?: () => void;
  isEditable?: boolean; // 편집 가능 여부 (줄임단은 false, 늘림단은 true)
}

/**
 * 규칙 카드 컴포넌트
 * 줄임단/늘림단 규칙을 표시하고 편집할 수 있는 카드
 */
const RuleCard: React.FC<RuleCardProps> = ({
  title,
  message,
  startNumber,
  endNumber,
  ruleNumber,
  exampleText,
  onEdit,
  onDelete,
  onConfirm,
  isEditable = false,
}) => {
  const [isEditMode, setIsEditMode] = useState(isEditable);

  const handleEditClick = () => {
    setIsEditMode(true);
    onEdit?.();
  };

  const handleConfirm = () => {
    setIsEditMode(false);
    onConfirm?.();
  };

  const handleDelete = () => {
    setIsEditMode(false);
    onDelete?.();
  };

  // 보기 모드 (줄임단 카드 기본 상태)
  if (!isEditMode) {
    return (
      <View className="mb-4 bg-red-orange-50 border border-lightgray rounded-xl p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-base font-extrabold text-black">{title}</Text>
          <TouchableOpacity
            onPress={handleEditClick}
            className="w-12 h-12 bg-red-orange-200 rounded-full items-center justify-center"
          >
            <Pencil size={15} color="black" />
          </TouchableOpacity>
        </View>
        <Text className="text-base text-black">
          {startNumber}단부터 {endNumber}단까지 {ruleNumber}단마다
        </Text>
      </View>
    );
  }

  // 편집 모드 (늘림단 카드 또는 줄임단 카드 편집 상태)
  return (
    <View className="mb-4 bg-red-orange-50 border border-lightgray rounded-xl p-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-extrabold text-black">{title}</Text>
      </View>

      {/* 메시지 섹션 */}
      <View className="mb-3">
        <Text className="text-base font-extrabold text-black mb-2">메시지 :</Text>
        <View className="bg-white border border-lightgray rounded-xl px-3 py-2">
          <Text className="text-base text-black">{message}</Text>
        </View>
      </View>

      {/* 규칙 섹션 */}
      <View className="mb-3">
        <Text className="text-base font-extrabold text-black mb-2">규칙 :</Text>
        <View className="flex-row items-center mb-2">
          <View className="bg-white border border-lightgray rounded-xl w-9 h-11 items-center justify-center mr-2">
            <Text className="text-base text-black">{startNumber}</Text>
          </View>
          <Text className="text-base text-black mr-2">단부터</Text>
          <View className="bg-white border border-lightgray rounded-xl w-9 h-11 items-center justify-center mr-2">
            <Text className="text-base text-black">{endNumber || ''}</Text>
          </View>
          <Text className="text-base text-black">단까지</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <View className="bg-white border border-lightgray rounded-xl w-9 h-11 items-center justify-center mr-2">
            <Text className="text-base text-black">{ruleNumber}</Text>
          </View>
          <Text className="text-base text-black">단마다 반복 규칙</Text>
        </View>
        {exampleText && (
          <Text className="text-sm text-darkgray">{exampleText}</Text>
        )}
      </View>

      {/* 삭제/확인 버튼 */}
      <View className="flex-row justify-end gap-2">
        <CircleIcon
          size={44}
          isButton={true}
          iconName="trash-2"
          colorStyle="medium"
          onPress={handleDelete}
        />
        <CircleIcon
          size={44}
          isButton={true}
          iconName="check"
          colorStyle="medium"
          onPress={handleConfirm}
        />
      </View>
    </View>
  );
};

export default RuleCard;

