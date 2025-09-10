// src/components/RadioButtonGroup.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import clsx from 'clsx';
import { colorStyles } from '@styles/colorStyles';

/**
 * 라디오 버튼 옵션의 타입 정의
 * @param value - 옵션의 고유 값
 * @param label - 사용자에게 표시될 라벨 텍스트
 * @param tooltip - 선택 시 표시될 도움말 텍스트 (선택사항)
 */
type Option = {
  value: string;
  label: string;
  tooltip?: string;
};

/**
 * RadioButtonGroup 컴포넌트의 Props 인터페이스
 * @param options - 라디오 버튼 옵션 배열
 * @param selected - 현재 선택된 옵션의 값 (null일 경우 아무것도 선택되지 않음)
 * @param onSelect - 옵션 선택 시 실행될 콜백 함수
 * @param containerClassName - 컨테이너에 추가할 스타일 클래스 (선택사항)
 */
interface RadioButtonGroupProps {
  options: Option[];
  selected: string | null;
  onSelect: (value: string) => void;
  containerClassName?: string;
}

/**
 * 선택된 옵션의 툴팁을 찾는 헬퍼 함수
 * @param options - 옵션 배열
 * @param selectedValue - 선택된 값
 * @returns 툴팁 텍스트 또는 undefined
 */
const getSelectedTooltip = (options: Option[], selectedValue: string | null): string | undefined => {
  if (!selectedValue) {
    return undefined;
  }
  return options.find(option => option.value === selectedValue)?.tooltip;
};

/**
 * 개별 라디오 버튼을 렌더링하는 함수
 * @param option - 라디오 버튼 옵션
 * @param isSelected - 선택 여부
 * @param onSelect - 선택 콜백 함수
 */
const renderRadioButton = (option: Option, isSelected: boolean, onSelect: (value: string) => void) => (
  <TouchableOpacity
    key={option.value}
    onPress={() => onSelect(option.value)}
    className="items-center"
    activeOpacity={0.7}
  >
    {/* 라디오 버튼 원형 아이콘 */}
    <View
      className={clsx(
        'w-6 h-6 rounded-full items-center justify-center mb-1',
        isSelected
          ? colorStyles.E.container // 선택된 상태: 테마 색상 사용
          : 'bg-red-orange-100 border border-red-orange-100' // 선택되지 않은 상태: 회색 배경과 테두리
      )}
    >
      {/* 선택된 상태일 때만 체크 아이콘 표시 */}
      {isSelected && (
        <Check size={14} color="white" />
      )}
    </View>
    {/* 옵션 라벨 텍스트 */}
    <Text className="text-sm text-black">{option.label}</Text>
  </TouchableOpacity>
);

/**
 * 라디오 버튼 그룹 컴포넌트
 * 여러 옵션 중 하나를 선택할 수 있는 라디오 버튼들을 가로로 배치합니다.
 * 선택된 옵션이 있으면 해당 옵션의 툴팁을 하단에 표시합니다.
 */
const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options,
  selected,
  onSelect,
  containerClassName,
}) => {
  // 선택된 옵션의 툴팁 가져오기
  const selectedTooltip = getSelectedTooltip(options, selected);

  return (
    <View className={clsx('items-center', containerClassName)}>
      {/* 라디오 버튼들을 가로로 배치하는 컨테이너 */}
      <View className="flex-row justify-center items-center space-x-6">
        {options.map((option) => {
          // 현재 옵션이 선택되었는지 확인
          const isSelected = selected === option.value;
          return renderRadioButton(option, isSelected, onSelect);
        })}
      </View>

      {/* 선택된 옵션이 있고 해당 옵션에 툴팁이 있을 때만 표시 */}
      {selectedTooltip && (
        <Text className="text-xs text-gray-500 mt-2 text-center">
          {selectedTooltip}
        </Text>
      )}
    </View>
  );
};

export default RadioButtonGroup;
