import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import ColorCompleteIcon from '@assets/images/color_complete.svg';
import CircleIcon from '@components/common/CircleIcon';
import TextInputBox, { TextInputBoxRef } from '@components/common/TextInputBox';
import ColorPicker from '@components/counter/ColorPicker';
import { calculateRulePreview } from '@utils/ruleUtils';
import { numberToString } from '@utils/numberUtils';

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
  const [isEditMode, setIsEditMode] = useState(isEditable);
  const [editMessage, setEditMessage] = useState(message);
  const [editStartNumber, setEditStartNumber] = useState(numberToString(startNumber));
  const [editEndNumber, setEditEndNumber] = useState(numberToString(endNumber));
  const [editRuleNumber, setEditRuleNumber] = useState(numberToString(ruleNumber));
  const [editColor, setEditColor] = useState(color);

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
    setIsEditMode(true);
  };

  const handleConfirm = () => {
    const result = validateRule(
      editMessage.trim(),
      editStartNumber,
      editEndNumber,
      editRuleNumber
    );
    if (result.error) {
      return;
    }
    setIsEditMode(false);
    onConfirm?.({
      message: editMessage.trim(),
      startNumber: result.start,
      endNumber: result.end,
      ruleNumber: result.rule,
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

  /** 유효성 검사 + 파싱 (문자열/숫자 모두 받음) */
  const validateRule = (
    trimmedMessage: string,
    start: string | number,
    end: string | number,
    rule: string | number
  ): { error: string | null; start: number; end: number; rule: number } => {
    const parsedStart = typeof start === 'string' ? parseInt(start, 10) || 0 : start;
    const parsedEnd = typeof end === 'string' ? parseInt(end, 10) || 0 : end;
    const parsedRule = typeof rule === 'string' ? parseInt(rule, 10) || 0 : rule;
    const parsed = { start: parsedStart, end: parsedEnd, rule: parsedRule };

    if (!trimmedMessage) {
      return { ...parsed, error: '메시지를 입력해 주세요.' };
    }
    if (parsedStart === 0 && parsedEnd === 0) {
      return { ...parsed, error: '시작단 혹은 종료단을 설정해 주세요.' };
    }
    if (parsedRule === 0) {
      return { ...parsed, error: '반복 규칙을 설정해 주세요.' };
    }
    if (parsedStart > 0 && parsedEnd > 0 && parsedStart > parsedEnd) {
      return { ...parsed, error: '시작단이 종료단보다 클 수 없습니다.' };
    }
    return { ...parsed, error: null };
  };


  // 보기 모드
  if (!isEditMode) {
    return (
      <View className="mb-4 bg-white border border-lightgray rounded-xl p-4">
        <View className="flex-row items-center">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-base font-extrabold text-black">
                {message}
              </Text>
              <ColorCompleteIcon width={24} height={24} color={color ?? '#fc3e39'} />
            </View>
            <Text className="text-base text-black">
              {startNumber > 0 ? `${startNumber}단부터 ` : ''}
              {endNumber > 0 ? `${endNumber}단까지 ` : ''}
              {ruleNumber}단마다
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
              onChangeText={setEditMessage}
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
              onChangeText={setEditStartNumber}
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
              onChangeText={setEditEndNumber}
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
              onChangeText={setEditRuleNumber}
              type="number"
              containerClassName="mb-0"
              returnKeyType="done"
              onSubmitEditing={() => ruleNumberInputRef.current?.blur()}
              blurOnSubmit={true}
            />
          </View>
          <Text className="text-base text-black">단마다 반복 규칙</Text>
        </View>

        {/* 규칙 미리보기 / 에러 표시 */}
        {(() => {
          const { error: ruleError, start, end, rule } = validateRule(
            editMessage.trim(),
            editStartNumber,
            editEndNumber,
            editRuleNumber
          );
          const hasRuleInput = (start > 0 || end > 0) && rule > 0;
          const rulePreview = hasRuleInput ? calculateRulePreview(start, end, rule, 5) : [];

          if (!hasRuleInput && !ruleError) {
            return null;
          }

          const previewText =
            hasRuleInput && rulePreview.length > 0
              ? rulePreview.map((n) => `${n}단`).join(', ')
              : '';

          return (
            <View className="mt-2 flex-row items-center">
              <Text className="text-base font-extrabold text-black mr-2">적용 단 :</Text>
              <View>
                {ruleError ? (
                  <Text className="text-sm text-red-orange-500">{ruleError}</Text>
                ) : (
                  previewText && (
                    <Text className="text-sm text-darkgray">
                      {previewText}{rulePreview.length === 5 ? '...' : ''}
                    </Text>
                  )
                )}
              </View>
            </View>
          );
        })()}
      </View>

      {/* 삭제/확인 버튼 */}
      <View className="flex-row items-center justify-end mt-1">
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

