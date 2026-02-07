import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';

import CheckBox from '@components/common/CheckBox';
import ActivateToggle from '@components/common/ActivateToggle';
import QuestionMarkTooltip from '@components/counter/QuestionMarkTooltip';
import RuleCard from '@components/counter/RuleCard';
import { ConfirmModal } from '@components/common/modals';
import { screenStyles, safeAreaEdges } from '@styles/screenStyles';
import { colorStyles } from '@styles/colorStyles';
import { RootStackParamList } from '@navigation/AppNavigator';
import { getStoredItems, updateItem } from '@storage/storage';
import { Counter, RepeatRule } from '@storage/types';

/**
 * Way 설정 화면 컴포넌트
 */
const WaySetting = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { counterId } = (route.params as { counterId?: string }) ?? {};

  // 카운터 정보 로드 및 헤더 타이틀 설정
  useLayoutEffect(() => {
    if (!counterId) {
      return;
    }

    const allItems = getStoredItems();
    const counter = allItems.find((item) => item.id === counterId && item.type === 'counter');

    if (counter) {
      navigation.setOptions({ title: `"${counter.title}" 어쩌미 옵션 설정` });
    }
  }, [counterId, navigation]);

  // 상태 관리
  const [mascotIsActive, setMascotIsActive] = useState(false);
  const [wayIsChange, setWayIsChange] = useState(false);
  const [repeatRules, setRepeatRules] = useState<RepeatRule[]>([]);
  const [isAddingNewRule, setIsAddingNewRule] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRuleIndex, setDeleteRuleIndex] = useState<number | null>(null);
  const [deleteRuleMessage, setDeleteRuleMessage] = useState<string>('');

  // 카운터 데이터 로드
  useEffect(() => {
    if (!counterId) {
      return;
    }

    const allItems = getStoredItems();
    const counter = allItems.find(
      (item): item is Counter => item.id === counterId && item.type === 'counter'
    );

    if (counter) {
      setMascotIsActive(counter.mascotIsActive ?? false);
      setWayIsChange(counter.wayIsChange ?? false);
      setRepeatRules(counter.repeatRules ?? []);
    }
  }, [counterId]);

  // 마스코트 활성화 토글
  const handleToggleMascotIsActive = () => {
    if (!counterId) {
      return;
    }

    const newMascotIsActive = !mascotIsActive;
    setMascotIsActive(newMascotIsActive);

    const allItems = getStoredItems();
    const counter = allItems.find(
      (item): item is Counter => item.id === counterId && item.type === 'counter'
    );

    if (counter) {
      updateItem(counter.id, {
        mascotIsActive: newMascotIsActive,
      });
    }
  };

  // 규칙 추가 버튼 클릭
  const handleAddRule = () => {
    setIsAddingNewRule(true);
  };

  // 규칙 확인 (추가 또는 수정)
  const handleRuleConfirm = (index: number | null, data: { message: string; startNumber: number; endNumber: number; ruleNumber: number; color?: string }) => {
    if (!counterId) {
      return;
    }

    const allItems = getStoredItems();
    const counter = allItems.find(
      (item): item is Counter => item.id === counterId && item.type === 'counter'
    );

    if (!counter) {
      return;
    }

    const newRule: RepeatRule = {
      message: data.message,
      startNumber: data.startNumber,
      endNumber: data.endNumber,
      ruleNumber: data.ruleNumber,
      color: data.color,
    };

    let updatedRules: RepeatRule[];
    if (index === null) {
      // 새 규칙 추가
      updatedRules = [...(counter.repeatRules ?? []), newRule];
      setIsAddingNewRule(false);
    } else {
      // 기존 규칙 수정
      updatedRules = [...(counter.repeatRules ?? [])];
      updatedRules[index] = newRule;
    }

    setRepeatRules(updatedRules);
    updateItem(counter.id, {
      repeatRules: updatedRules,
    });
  };

  // 규칙 삭제 확인 모달 열기
  const handleRuleDeleteClick = (index: number) => {
    const rule = repeatRules[index];
    setDeleteRuleIndex(index);
    setDeleteRuleMessage(rule.message || '');
    setShowDeleteModal(true);
  };

  // 규칙 삭제 실행
  const handleRuleDeleteConfirm = () => {
    if (!counterId || deleteRuleIndex === null) {
      return;
    }

    const allItems = getStoredItems();
    const counter = allItems.find(
      (item): item is Counter => item.id === counterId && item.type === 'counter'
    );

    if (!counter) {
      return;
    }

    const updatedRules = [...(counter.repeatRules ?? [])];
    updatedRules.splice(deleteRuleIndex, 1);

    setRepeatRules(updatedRules);
    updateItem(counter.id, {
      repeatRules: updatedRules,
    });

    setShowDeleteModal(false);
    setDeleteRuleIndex(null);
    setDeleteRuleMessage('');
  };

  return (
    <SafeAreaView style={screenStyles.flex1} edges={safeAreaEdges}>
      <KeyboardAvoidingView
        style={screenStyles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={screenStyles.scrollViewContentCentered}
          keyboardShouldPersistTaps="handled"
        >
        {/* 활성화 토글 */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-base text-black">활성화</Text>
          <ActivateToggle
            mascotIsActive={mascotIsActive}
            onToggle={handleToggleMascotIsActive}
          />
        </View>

        {/* 단마다 앞/뒤 방향 표시하기 체크박스 */}
        <View className="mb-6">
          <CheckBox
            label="단마다 앞/뒤 방향 표시하기"
            checked={wayIsChange}
            onToggle={() => {
              if (!counterId) {
                return;
              }
              const newWayIsChange = !wayIsChange;
              setWayIsChange(newWayIsChange);
              const allItems = getStoredItems();
              const counter = allItems.find(
                (item): item is Counter => item.id === counterId && item.type === 'counter'
              );
              if (counter) {
                updateItem(counter.id, {
                  wayIsChange: newWayIsChange,
                });
              }
            }}
          />
          <View className="absolute right-12 top-2">
            <QuestionMarkTooltip tooltipText="어쩌미가 단마다 앞/뒤, 도안 읽는 방향을 표시해줍니다." />
          </View>
        </View>

        {/* 규칙 카드들 */}
        {repeatRules.map((rule, index) => (
          <RuleCard
            key={index}
            message={rule.message}
            startNumber={rule.startNumber}
            endNumber={rule.endNumber}
            ruleNumber={rule.ruleNumber}
            color={rule.color}
            isEditable={false}
            onConfirm={(data) => handleRuleConfirm(index, data)}
            onDelete={() => handleRuleDeleteClick(index)}
          />
        ))}

        {/* 새 규칙 추가 카드 */}
        {isAddingNewRule && (
          <RuleCard
            message=""
            startNumber={0}
            endNumber={0}
            ruleNumber={0}
            isEditable={true}
            onConfirm={(data) => handleRuleConfirm(null, data)}
            onDelete={() => setIsAddingNewRule(false)}
          />
        )}

        {/* 규칙 추가 버튼 */}
        {!isAddingNewRule && (
          <View className="w-full items-center mb-6">
            <View className="relative">
              <TouchableOpacity
                className={`${colorStyles.lightest.container} rounded-xl pl-5 pr-4 py-2 flex-row items-center`}
                onPress={handleAddRule}
              >
                <Text className={`text-base ${colorStyles.lightest.icon} mr-2`}>규칙 추가</Text>
                <Plus size={22} color={colorStyles.lightest.icon} strokeWidth={2.5} />
              </TouchableOpacity>
              <View className="absolute -right-8 top-4 -mt-3">
                <QuestionMarkTooltip tooltipText="몇 단마다 규칙(꽈배기나 늘림 등)이 있을 때 이 기능을 활용해 보세요!" />
              </View>
            </View>
          </View>
        )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 규칙 삭제 확인 모달 */}
      <ConfirmModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteRuleIndex(null);
          setDeleteRuleMessage('');
        }}
        title="규칙 삭제"
        description={`"${deleteRuleMessage}" 규칙을 정말 삭제하시겠습니까?`}
        onConfirm={handleRuleDeleteConfirm}
        confirmText="삭제"
        cancelText="취소"
      />
    </SafeAreaView>
  );
};

export default WaySetting;
