import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import ColorCompleteIcon from '@assets/images/color_complete.svg';
import CircleIcon from '@components/common/CircleIcon';
import TextInputBox, { TextInputBoxRef } from '@components/common/TextInputBox';
import ColorPicker from '@components/counter/ColorPicker';
import { calculateRulePreview } from '@utils/ruleUtils';

interface RuleCardProps {
  message: string;
  startNumber: number;
  endNumber: number;
  ruleNumber: number;
  color?: string; // 색상 (hex 값, 예: '#fc3e39')
  onDelete?: () => void;
  onConfirm?: (data: { message: string; startNumber: number; endNumber: number; ruleNumber: number; color?: string }) => void;
  isEditable?: boolean; // 편집 가능 여부
}

/**
 * 규칙 카드 컴포넌트
 * 줄임단/늘림단 규칙을 표시하고 편집할 수 있는 카드
 */
const RuleCard: React.FC<RuleCardProps> = ({
  message,
  startNumber,
  endNumber,
  ruleNumber,
  color,
  onDelete,
  onConfirm,
  isEditable = false,
}) => {
  // 숫자를 문자열로 변환 (0이면 빈 문자열)
  const numberToString = (num: number): string => {
    return num === 0 ? '' : num.toString();
  };

  const [isEditMode, setIsEditMode] = useState(isEditable);
  const [editMessage, setEditMessage] = useState(message);
  const [editStartNumber, setEditStartNumber] = useState(numberToString(startNumber));
  const [editEndNumber, setEditEndNumber] = useState(numberToString(endNumber));
  const [editRuleNumber, setEditRuleNumber] = useState(numberToString(ruleNumber));
  const [editColor, setEditColor] = useState(color);
  const [validationError, setValidationError] = useState('');

  // TextInputBox refs
  const messageInputRef = useRef<TextInputBoxRef>(null);
  const startNumberInputRef = useRef<TextInputBoxRef>(null);
  const endNumberInputRef = useRef<TextInputBoxRef>(null);
  const ruleNumberInputRef = useRef<TextInputBoxRef>(null);

  // props가 변경되면 내부 state도 업데이트
  useEffect(() => {
    setEditMessage(message);
    setEditStartNumber(numberToString(startNumber));
    setEditEndNumber(numberToString(endNumber));
    setEditRuleNumber(numberToString(ruleNumber));
    setEditColor(color);
  }, [message, startNumber, endNumber, ruleNumber, color]);

  const handleEditClick = () => {
    setValidationError('');
    setIsEditMode(true);
  };

  const handleConfirm = () => {
    // 유효성 검사
    const trimmedMessage = editMessage.trim();
    const parsedStartNumber = parseInt(editStartNumber, 10) || 0;
    const parsedEndNumber = parseInt(editEndNumber, 10) || 0;
    const parsedRuleNumber = parseInt(editRuleNumber, 10) || 0;

    // 1. 메시지 란은 반드시 채워져야 함
    if (!trimmedMessage) {
      setValidationError('메시지를 입력해 주세요.');
      return;
    }

    // 2. 규칙은 시작단 or 종료단 둘 중 하나는 채워져야 함
    if (parsedStartNumber === 0 && parsedEndNumber === 0) {
      setValidationError('시작단 혹은 종료단을 설정해 주세요.');
      return;
    }

    // 3. 몇단마다 반복 규칙인지 채워져야 함
    if (parsedRuleNumber === 0) {
      setValidationError('반복 규칙을 설정해 주세요.');
      return;
    }

    // 유효성 검사 통과
    setValidationError('');
    setIsEditMode(false);
    onConfirm?.({
      message: trimmedMessage,
      startNumber: parsedStartNumber,
      endNumber: parsedEndNumber,
      ruleNumber: parsedRuleNumber,
      color: editColor,
    });
  };

  const handleColorSelect = (selectedColor: string) => {
    setEditColor(selectedColor);
  };

  const handleDelete = () => {
    // 편집 모드는 유지하고 삭제 확인만 수행
    onDelete?.();
  };

  // 규칙 미리보기 계산 (시작단 포함)
  const getRulePreview = () => {
    const parsedStartNumber = parseInt(editStartNumber, 10) || 0;
    const parsedEndNumber = parseInt(editEndNumber, 10) || 0;
    const parsedRuleNumber = parseInt(editRuleNumber, 10) || 0;

    return calculateRulePreview(parsedStartNumber, parsedEndNumber, parsedRuleNumber, 5);
  };

  // 규칙 오류 체크
  const checkRuleError = (start: number, end: number, rule: number): string | null => {
    // 규칙이 입력되지 않았으면 오류 없음
    if (rule === 0) {
      return null;
    }

    // 시작단과 종료단 둘 다 있는 경우
    if (start > 0 && end > 0) {
      // 시작단이 종료단보다 큰 경우
      if (start >= end) {
        return '시작단이 종료단 이상일 수 없습니다.';
      }
    }

    return null;
  };

  // 보기 모드
  if (!isEditMode) {
    const hasError = checkRuleError(startNumber, endNumber, ruleNumber) !== null;
    return (
      <View className="mb-4 bg-white border border-lightgray rounded-xl p-4">
        <View className="flex-row items-center">
          <View className="flex-1">
            {message && (
              <View className="flex-row items-center gap-2 mb-2">
                <Text className={`text-base font-extrabold ${hasError ? 'text-red-orange-500' : 'text-black'}`}>
                  {message}
                </Text>
                <ColorCompleteIcon width={24} height={24} color={color ?? '#fc3e39'} />
              </View>
            )}
            <Text className="text-base text-black">
              {startNumber}단부터 {endNumber}단까지 {ruleNumber}단마다
            </Text>
          </View>
          <CircleIcon
            size={44}
            iconName="pencil"
            colorStyle="medium"
            isButton
            onPress={handleEditClick}
          />
        </View>
      </View>
    );
  }

  // 편집 모드 (늘림단 카드 또는 줄임단 카드 편집 상태)
  return (
    <View className="mb-4 bg-red-orange-50 border border-lightgray rounded-xl p-4">
      {/* 메시지 섹션 */}
      <View className="mb-3 flex-row items-center">
        <Text className="text-base font-extrabold text-black mr-2">메시지 :</Text>
        <View className="flex-1 flex-row items-center">
          <View className="flex-1">
            <TextInputBox
              ref={messageInputRef}
              label=""
              value={editMessage}
              onChangeText={(text) => {
                setEditMessage(text);
                setValidationError('');
              }}
              type="text"
              containerClassName="mt-1"
              returnKeyType="next"
              onSubmitEditing={() => startNumberInputRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
          <View className="ml-2">
            <ColorPicker
              selectedColor={editColor}
              onSelect={handleColorSelect}
            />
          </View>
        </View>
      </View>

      {/* 규칙 섹션 */}
      <View className="mb-0">
        {/* 시작단부터 종료단까지 */}
        <View className="flex-row items-center mb-0">
          <Text className="text-base font-extrabold text-black mr-2">규칙 :</Text>
          <View className="mr-2 w-18">
            <TextInputBox
              ref={startNumberInputRef}
              label=""
              value={editStartNumber}
              onChangeText={(text) => {
                setEditStartNumber(text);
                setValidationError('');
              }}
              type="number"
              containerClassName="mb-2"
              returnKeyType="next"
              onSubmitEditing={() => endNumberInputRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
          <Text className="text-base text-black mr-2">단부터</Text>
          <View className="mr-2 w-18">
            <TextInputBox
              ref={endNumberInputRef}
              label=""
              value={editEndNumber}
              onChangeText={(text) => {
                setEditEndNumber(text);
                setValidationError('');
              }}
              type="number"
              containerClassName="mb-2"
              returnKeyType="next"
              onSubmitEditing={() => ruleNumberInputRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
          <Text className="text-base text-black">단까지</Text>
        </View>
        {/* 단마다 반복 규칙 */}
        <View className="flex-row items-center mb-0">
          {/* 정렬을 위한 투명한 "규칙 :" 텍스트 */}
          <Text className="text-base font-extrabold text-black mr-2 opacity-0">규칙 :</Text>
          <View className="mr-2 w-18">
            <TextInputBox
              ref={ruleNumberInputRef}
              label=""
              value={editRuleNumber}
              onChangeText={(text) => {
                setEditRuleNumber(text);
                setValidationError('');
              }}
              type="number"
              containerClassName="mb-0"
              returnKeyType="done"
              onSubmitEditing={() => ruleNumberInputRef.current?.blur()}
              blurOnSubmit={true}
            />
          </View>
          <Text className="text-base text-black">단마다 반복 규칙</Text>
        </View>

        {/* 규칙 미리보기 */}
        {(() => {
          const parsedStartNumber = parseInt(editStartNumber, 10) || 0;
          const parsedEndNumber = parseInt(editEndNumber, 10) || 0;
          const parsedRuleNumber = parseInt(editRuleNumber, 10) || 0;
          const hasRuleInput = (parsedStartNumber > 0 || parsedEndNumber > 0) && parsedRuleNumber > 0;
          const rulePreview = getRulePreview();
          const ruleError = checkRuleError(parsedStartNumber, parsedEndNumber, parsedRuleNumber);

          if (!hasRuleInput) {
            return null;
          }

          const previewText = rulePreview.length > 0
            ? rulePreview.map((n) => `${n}단`).join(', ')
            : '';

          return (
            <View className="mt-2 flex-row items-center">
              <Text className="text-base font-extrabold text-black mr-2">적용 단 :</Text>
              <View>
                {previewText && (
                  <Text className={`text-sm ${ruleError ? 'text-red-orange-500' : 'text-darkgray'}`}>
                    {previewText}{rulePreview.length === 5 ? '...' : ''}
                  </Text>
                )}
                {ruleError && (
                  <Text className="text-sm text-red-orange-500 mt-1 mb-2">
                    {ruleError}
                  </Text>
                )}
              </View>
            </View>
          );
        })()}
      </View>

      {/* 삭제/확인 버튼 */}
      <View className="flex-row items-center justify-end">
        {validationError && (
          <Text className="text-sm text-red-orange-500 mr-2 flex-1">
            {validationError}
          </Text>
        )}
        <CircleIcon
          size={44}
          isButton={true}
          iconName="trash-2"
          colorStyle="medium"
          containerClassName="mr-2"
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

