// src/components/common/modals/SubCounterRuleModal/SubCounterRuleModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import BaseModal from '../common/modals/BaseModal/BaseModal';
import RoundedBox from '@components/common/RoundedBox';
import TextInputBox from '@components/common/TextInputBox';
import CheckBox from '@components/common/CheckBox';

interface SubCounterRuleModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (rule: number, isRuleActive: boolean) => void;
  initialRule?: number;
  initialIsRuleActive?: boolean;
}

/**
 * 서브 카운터 규칙 설정 모달
 * 서브 카운터의 규칙 번호와 활성화 상태를 설정할 수 있습니다.
 */
const SubCounterRuleModal: React.FC<SubCounterRuleModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialRule = 0,
  initialIsRuleActive = false,
}) => {
  const [rule, setRule] = useState(initialRule.toString());
  const [isRuleActive, setIsRuleActive] = useState(initialIsRuleActive);

  // 모달이 열릴 때마다 초기값으로 리셋
  useEffect(() => {
    if (visible) {
      setRule(initialRule.toString());
      setIsRuleActive(initialIsRuleActive);
    }
  }, [visible, initialRule, initialIsRuleActive]);

  const handleConfirm = () => {
    onConfirm(parseInt(rule, 10) || 0, isRuleActive);
    onClose();
  };

  return (
    <BaseModal visible={visible} onClose={onClose} title="설정">
      <View className="px-6 py-4">
        {/* 보조 카운터 규칙 설정 */}
        <View className="flex-row items-center justify-between">
          <Text className="text-base text-black">보조 카운터</Text>
          <View className="flex-row items-center">
            <View className="w-20">
              <TextInputBox
                label=""
                value={rule}
                onChangeText={setRule}
                type="number"
                className="mb-0"
                placeholder="0"
              />
            </View>
            <Text className="text-base text-black ml-2">코마다</Text>
          </View>
        </View>

        {/* 본 카운터 1단 증가 체크박스 */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-base text-black">본 카운터 1단 증가</Text>
            <CheckBox
              checked={isRuleActive}
              onToggle={() => setIsRuleActive(!isRuleActive)}
            />
          </View>
        </View>

        {/* 버튼 영역 */}
        <View className="flex-row justify-evenly">
          <RoundedBox
            title="취소"
            onPress={onClose}
            isButton
            colorStyle="C"
            rounded="full"
            containerClassName="mx-1 py-3 px-8"
          />
          <RoundedBox
            title="확인"
            onPress={handleConfirm}
            isButton
            colorStyle="E"
            rounded="full"
            containerClassName="mx-1 py-3 px-8"
          />
        </View>
      </View>
    </BaseModal>
  );
};

export default SubCounterRuleModal;
