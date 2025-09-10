// src/components/CustomModal.tsx
import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { modalStyles } from '@styles/modalStyle';

import TextInputBox from '@components/common/TextInputBox';
import RoundedBox from '@components/common/RoundedBox';
import CheckBox from '@components/common/CheckBox';
import RadioButtonGroup from '@components/common/RadioButtonGroup';

import clsx from 'clsx';

/**
 * CustomModal 컴포넌트의 Props 인터페이스
 * @param visible - 모달 표시 여부
 * @param onClose - 모달 닫기 콜백 함수
 * @param title - 모달 제목
 * @param description - 모달 설명 (선택사항, 줄바꿈 지원)
 * @param inputVisible - 입력 필드 표시 여부
 * @param inputValue - 입력 필드의 현재 값
 * @param onInputChange - 입력 값 변경 시 콜백 함수
 * @param inputLabel - 입력 필드 라벨
 * @param inputPlaceholder - 입력 필드 플레이스홀더
 * @param inputType - 입력 필드 타입 ('text' | 'number')
 * @param checkboxVisible - 체크박스 표시 여부
 * @param checkboxLabel - 체크박스 라벨
 * @param checkboxChecked - 체크박스 체크 상태
 * @param onCheckboxToggle - 체크박스 토글 시 콜백 함수
 * @param buttonType - 버튼 타입 ('confirm' | 'create' | 'confirmCancel')
 * @param onConfirm - 확인/생성 버튼 클릭 시 콜백 함수
 * @param onCancel - 취소 버튼 클릭 시 콜백 함수 (선택사항)
 * @param radioOptions - 라디오 버튼 옵션 배열 (선택사항)
 * @param radioValue - 선택된 라디오 버튼 값
 * @param onRadioChange - 라디오 버튼 선택 변경 시 콜백 함수
 */
interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  inputVisible?: boolean;
  inputValue?: string;
  onInputChange?: (text: string) => void;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputType?: 'text' | 'number';
  checkboxVisible?: boolean;
  checkboxLabel?: string;
  checkboxChecked?: boolean;
  onCheckboxToggle?: () => void;
  buttonType: 'confirm' | 'create' | 'confirmCancel';
  onConfirm: () => void;
  onCancel?: () => void;
  radioOptions?: {
  value: string;
  label: string;
  tooltip?: string;
  }[];
  radioValue?: string;
  onRadioChange?: (value: string) => void;
}

/**
 * 확인 버튼만 표시하는 렌더링 함수
 */
const renderConfirmButton = (onConfirm: () => void) => (
  <RoundedBox
    title="확인"
    onPress={onConfirm}
    isButton
    colorStyle="E"
    rounded="full"
    containerClassName="mx-1 py-3 px-8"
  />
);

/**
 * 취소/생성 버튼을 표시하는 렌더링 함수
 */
const renderCreateButtons = (
  inputValue: string | undefined,
  onCancel: (() => void) | undefined,
  onConfirm: () => void
) => (
  <>
    {/* 취소 버튼 */}
    <RoundedBox
      title="취소"
      onPress={onCancel}
      isButton
      colorStyle="C"
      rounded="full"
      containerClassName="mx-1 py-3 px-8"
    />
    {/* 생성 버튼 - 입력값이 있을 때만 활성화 */}
    <RoundedBox
      title="생성"
      onPress={() => {
        if (inputValue?.trim()) {
          onConfirm();
        }
      }}
      isButton
      colorStyle={inputValue?.trim() ? 'E' : undefined}
      rounded="full"
      containerClassName={clsx(
        'mx-1 py-3 px-8',
        !inputValue?.trim() && 'bg-lightgray' // 입력값이 없으면 회색 배경
      )}
    />
  </>
);

/**
 * 취소/확인 버튼을 표시하는 렌더링 함수
 */
const renderConfirmCancelButtons = (
  onCancel: (() => void) | undefined,
  onConfirm: () => void
) => (
  <>
    {/* 취소 버튼 */}
    <RoundedBox
      title="취소"
      onPress={onCancel}
      isButton
      colorStyle="C"
      rounded="full"
      containerClassName="mx-1 py-3 px-8"
    />
    {/* 확인 버튼 */}
    <RoundedBox
      title="확인"
      onPress={onConfirm}
      isButton
      colorStyle="E"
      rounded="full"
      containerClassName="mx-1 py-3 px-8"
    />
  </>
);

/**
 * 커스텀 모달 컴포넌트
 * 다양한 UI 요소(입력 필드, 체크박스, 라디오 버튼, 버튼)를 조합하여
 * 상황에 맞는 모달을 구성할 수 있습니다.
 * 버튼 타입에 따라 다른 동작을 제공합니다:
 * - confirm: 확인 버튼만 표시
 * - create: 취소/생성 버튼 표시 (입력값 검증 포함)
 * - confirmCancel: 취소/확인 버튼 표시
 */
const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  description,
  inputVisible,
  inputValue,
  onInputChange,
  inputLabel,
  inputPlaceholder,
  inputType = 'text',
  checkboxVisible,
  checkboxLabel,
  checkboxChecked,
  onCheckboxToggle,
  buttonType,
  onConfirm,
  onCancel,
  radioOptions,
  radioValue,
  onRadioChange,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* 모달 배경 오버레이 - 클릭 시 모달 닫기 */}
      <Pressable style={modalStyles.overlay} onPress={onClose}>
        {/* 모달 컨테이너 - 배경 클릭 이벤트 전파 방지 */}
        <Pressable style={modalStyles.container} onPress={(e) => e.stopPropagation()}>
          {/* 모달 제목 */}
          <Text style={modalStyles.title}>{title}</Text>

          {/* 모달 설명 (선택사항) - 줄바꿈 지원 */}
          {description && (
            <Text style={modalStyles.description}>
              {description.split('\n').map((line, index) => (
                <Text key={index}>
                  {line}
                  {'\n'}
                </Text>
              ))}
            </Text>
          )}

        {/* 라디오 버튼 그룹 (선택사항) */}
        {radioOptions && onRadioChange && (
          <View className="mt-4 mb-0">
            <RadioButtonGroup
              selected={radioValue ?? ''}
              onSelect={onRadioChange}
              options={radioOptions}
            />
          </View>
        )}

        {/* 입력 필드 섹션 (선택사항) */}
        {inputVisible && onInputChange && (
          <TextInputBox
            label={inputLabel || ''}
            value={inputValue || ''}
            onChangeText={onInputChange}
            placeholder={inputPlaceholder || ''}
            type={inputType}
          />
        )}

        {/* 체크박스 섹션 (선택사항) */}
        {checkboxVisible && onCheckboxToggle && (
          <CheckBox
            label={checkboxLabel || ''}
            checked={checkboxChecked || false}
            onToggle={onCheckboxToggle}
          />
        )}

        {/* 버튼 섹션 - 버튼 타입에 따라 다른 버튼 조합 표시 */}
        <View className="flex-row justify-evenly">
          {buttonType === 'confirm' && renderConfirmButton(onConfirm)}
          {buttonType === 'create' && renderCreateButtons(inputValue, onCancel, onConfirm)}
          {buttonType === 'confirmCancel' && renderConfirmCancelButtons(onCancel, onConfirm)}
        </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CustomModal;
