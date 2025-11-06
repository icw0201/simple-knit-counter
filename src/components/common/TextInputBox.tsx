// src/components/TextInputBox.tsx
import React, { useState } from 'react';
import { View, TextInput as RNTextInput, Text } from 'react-native';
import clsx from 'clsx';

// 상수 정의
const INPUT_LIMITS = {
  number: 4,
  text: 15,
  longText: 500,
} as const;

const DATE_MAX_LENGTH = 8;

/**
 * 텍스트 입력 필드의 타입 정의
 * - number: 숫자만 입력 가능 (최대 4자리)
 * - text: 일반 텍스트 입력 (최대 15자리)
 * - date: 날짜 형식 입력 (YYYY.MM.DD)
 * - longText: 긴 텍스트 입력 (최대 500자리, 여러 줄 지원)
 */
type TextInputType = 'number' | 'text' | 'date' | 'longText';

/**
 * TextInputBox 컴포넌트의 Props 인터페이스
 * @param label - 입력 필드 위에 표시될 라벨 텍스트
 * @param value - 입력 필드의 현재 값
 * @param onChangeText - 입력 값 변경 시 실행될 콜백 함수
 * @param placeholder - 입력 필드에 표시될 플레이스홀더 텍스트
 * @param type - 입력 필드의 타입 (TextInputType)
 * @param maxLength - 최대 입력 길이 (기본값: longText는 70, 나머지는 15)
 * @param className - 추가적인 컨테이너 스타일 클래스
 */
interface TextInputBoxProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  type: TextInputType;
  maxLength?: number;
  className?: string;
}

/**
 * 텍스트 입력 필드 컴포넌트
 * 다양한 타입의 입력을 지원하며, 각 타입에 맞는 유효성 검사와 포맷팅을 제공합니다.
 * 포커스 상태에 따라 테두리 색상이 변경되고, 문자 수 카운터를 표시합니다.
 */
const TextInputBox: React.FC<TextInputBoxProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  type,
  maxLength = type === 'longText' ? INPUT_LIMITS.longText : INPUT_LIMITS.text,
  className = '',
}) => {
  // 입력 필드의 포커스 상태 관리
  const [isFocused, setIsFocused] = useState(false);

  /**
   * 숫자 입력 처리 함수
   * @param text - 입력된 텍스트
   */
  const handleNumberInput = (text: string) => {
    if (!/^\d*$/.test(text) || text.length > INPUT_LIMITS.number) {
      return;
    }
    onChangeText?.(text);
  };

  /**
   * 날짜 입력 처리 함수
   * @param text - 입력된 텍스트
   */
  const handleDateInput = (text: string) => {
    const raw = text.replace(/\./g, '').slice(0, DATE_MAX_LENGTH);
    if (!/^\d*$/.test(raw)) {
      return;
    }

    let formatted = raw;
    if (raw.length > 4) {
      formatted = `${raw.slice(0, 4)}.${raw.slice(4)}`;
    }
    if (raw.length > 6) {
      formatted = `${raw.slice(0, 4)}.${raw.slice(4, 6)}.${raw.slice(6)}`;
    }

    onChangeText?.(formatted);
  };

  /**
   * 일반 텍스트 입력 처리 함수
   * @param text - 입력된 텍스트
   */
  const handleTextInput = (text: string) => {
    const limit = type === 'longText' ? INPUT_LIMITS.longText : INPUT_LIMITS.text;
    if (text.length > limit) {
      return;
    }
    onChangeText?.(text);
  };

  /**
   * 입력 텍스트 변경 시 처리하는 함수
   * 타입에 따라 다른 유효성 검사와 포맷팅을 적용합니다.
   * @param text - 입력된 텍스트
   */
  const handleChangeText = (text: string) => {
    switch (type) {
      case 'number':
        handleNumberInput(text);
        break;
      case 'date':
        handleDateInput(text);
        break;
      default:
        handleTextInput(text);
        break;
    }
  };

  // 입력 필드 스타일 클래스
  const inputFieldClass = clsx(
    'px-3 border rounded-xl bg-white text-black',
    type === 'longText' ? 'text-sm min-h-[54px]' : 'h-[54px]',
    isFocused ? 'border-red-orange-400' : 'border-lightgray'
  );

  // 문자 수 카운터 표시 여부
  const shouldShowCounter = type === 'longText' || type === 'text';
  const currentLength = (value ?? '').length;
  const maxLengthForType = type === 'longText' ? INPUT_LIMITS.longText : maxLength;

  return (
    <View className={clsx('w-full mb-4', className)}>
      {/* 라벨과 문자 수 카운터를 표시하는 상단 영역 */}
      <View className="pl-1 mb-1 flex-row justify-between items-center">
        <Text className="text-sm text-darkgray font-medium">{label}</Text>
        {/* 텍스트와 롱텍스트 타입일 때만 문자 수 카운터 표시 */}
        {shouldShowCounter && (
          <Text className="text-xs text-darkgray">
            {currentLength}/{maxLengthForType}
          </Text>
        )}
      </View>

      {/* 실제 텍스트 입력 필드 */}
      <RNTextInput
        className={inputFieldClass}
        keyboardType={type === 'number' || type === 'date' ? 'numeric' : 'default'}
        multiline={type === 'longText'}
        textAlignVertical="center"
        placeholder={placeholder}
        value={value}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        maxLength={type === 'longText' ? maxLength : undefined}
      />
    </View>
  );
};

export default TextInputBox;
