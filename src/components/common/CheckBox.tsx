// src/components/CheckBox.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { colorStyles } from '@styles/colorStyles';
import clsx from 'clsx';

/**
 * CheckBox 컴포넌트의 Props 인터페이스
 * @param label - 체크박스 옆에 표시될 텍스트 라벨 (선택사항)
 * @param checked - 체크박스의 체크 상태 (true: 체크됨, false: 체크 안됨)
 * @param onToggle - 체크박스 클릭 시 실행될 콜백 함수
 * @param disabled - 체크박스 비활성화 여부 (기본값: false)
 */
interface CheckBoxProps {
  label?: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

/**
 * 체크박스 컴포넌트
 * 라벨과 함께 표시되는 체크박스로, 클릭 시 상태를 토글할 수 있습니다.
 * 비활성화 상태일 때는 클릭이 불가능합니다.
 */
const CheckBox: React.FC<CheckBoxProps> = ({ label, checked, onToggle, disabled = false }) => {
  // 체크박스 색상 설정
  const activeColor = colorStyles.E.container; // 활성화 상태일 때의 배경색 (체크된 상태)
  const inactiveColor = 'bg-red-orange-100'; // 비활성화 상태일 때의 배경색 (체크되지 않은 상태)

  // 체크박스 컨테이너 스타일 클래스
  const checkboxClass = clsx(
    'w-6 h-6 rounded-md items-center justify-center',
    checked ? activeColor : inactiveColor
  );

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onToggle} // 비활성화 상태일 때는 onPress 이벤트를 무시
      activeOpacity={0.7} // 터치 시 투명도 효과
      className={label ? "flex-row items-center justify-between px-4 py-3" : ""}
    >
      {/* 체크박스 라벨 텍스트 - label이 있을 때만 표시 */}
      {label && (
        <Text className="text-base text-black">{label}</Text>
      )}

      {/* 체크박스 아이콘 컨테이너 */}
      <View className={checkboxClass}>
        {/* 체크된 상태일 때만 체크 아이콘 표시 */}
        {checked && (
          <Check size={16} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CheckBox;
