import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CircleQuestionMark, Plus } from 'lucide-react-native';

import CheckBox from '@components/common/CheckBox';
import ActivateToggle from '@components/common/ActivateToggle';
import RuleCard from '@components/counter/RuleCard';
import { screenStyles, safeAreaEdges } from '@styles/screenStyles';
import { RootStackParamList } from '@navigation/AppNavigator';
import { getStoredItems, updateItem } from '@storage/storage';
import { Counter } from '@storage/types';

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

  return (
    <SafeAreaView style={screenStyles.flex1} edges={safeAreaEdges}>
      <ScrollView contentContainerStyle={screenStyles.scrollViewContentCentered}>
        {/* 활성화 토글 */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base text-black">활성화</Text>
            <ActivateToggle
              mascotIsActive={mascotIsActive}
              onToggle={handleToggleMascotIsActive}
            />
          </View>
        </View>

        {/* 단마다 앞/뒤 방향 표시하기 체크박스 */}
        <View className="mb-6">
          <CheckBox
            label="단마다 앞/뒤 방향 표시하기"
            checked={wayIsChange}
            onToggle={() => setWayIsChange(!wayIsChange)}
          />
          <View className="absolute right-12 top-3">
            <CircleQuestionMark size={24} color="#767676" />
          </View>
        </View>

        {/* 줄임단 규칙 카드 */}
        <RuleCard
          title="줄임단"
          message=""
          startNumber={0}
          endNumber={100}
          ruleNumber={3}
          isEditable={false}
        />

        {/* 늘림단 규칙 카드 */}
        <RuleCard
          title="늘림단"
          message="늘림단"
          startNumber={16}
          endNumber={0}
          ruleNumber={3}
          exampleText="16, 19, 21, 24, 27 ..."
          isEditable={true}
        />

        {/* 규칙 추가 버튼 */}
        <View className="flex-row items-center justify-center mb-6">
          <TouchableOpacity className="bg-red-orange-100 rounded-xl px-6 py-3 flex-row items-center">
            <Plus size={22} color="#490806" />
            <Text className="text-base text-black ml-2">규칙 추가</Text>
          </TouchableOpacity>
          <View className="ml-2">
            <CircleQuestionMark size={24} color="#767676" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WaySetting;
