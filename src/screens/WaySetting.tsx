import React, { useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CircleQuestionMark, Pencil, Trash2, Check, Plus } from 'lucide-react-native';

import CheckBox from '@components/common/CheckBox';
import { screenStyles } from '@styles/screenStyles';
import { RootStackParamList } from '@navigation/AppNavigator';
import { getStoredItems } from '@storage/storage';

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
  const [_mascotIsActive, _setMascotIsActive] = useState(false);
  const [wayIsChange, setWayIsChange] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={screenStyles.scrollViewContent}>
        {/* 활성화 체크박스 */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base text-black">활성화</Text>
            <View className="w-8 h-8 bg-red-orange-200 rounded-full" />
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
        <View className="mb-4 bg-red-orange-50 border border-lightgray rounded-xl p-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-extrabold text-black">줄임단</Text>
            <TouchableOpacity className="w-12 h-12 bg-red-orange-200 rounded-full items-center justify-center">
              <Pencil size={15} color="black" />
            </TouchableOpacity>
          </View>
          <Text className="text-base text-black">0단부터 100단까지 3단마다</Text>
        </View>

        {/* 늘림단 규칙 카드 */}
        <View className="mb-4 bg-red-orange-50 border border-lightgray rounded-xl p-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-extrabold text-black">늘림단</Text>
          </View>

          {/* 메시지 섹션 */}
          <View className="mb-3">
            <Text className="text-base font-extrabold text-black mb-2">메시지 :</Text>
            <View className="bg-white border border-lightgray rounded-xl px-3 py-2">
              <Text className="text-base text-black">늘림단</Text>
            </View>
          </View>

          {/* 규칙 섹션 */}
          <View className="mb-3">
            <Text className="text-base font-extrabold text-black mb-2">규칙 :</Text>
            <View className="flex-row items-center mb-2">
              <View className="bg-white border border-lightgray rounded-xl w-9 h-11 items-center justify-center mr-2">
                <Text className="text-base text-black">16</Text>
              </View>
              <Text className="text-base text-black mr-2">단부터</Text>
              <View className="bg-white border border-lightgray rounded-xl w-9 h-11 items-center justify-center mr-2" />
              <Text className="text-base text-black">단까지</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <View className="bg-white border border-lightgray rounded-xl w-9 h-11 items-center justify-center mr-2">
                <Text className="text-base text-black">3</Text>
              </View>
              <Text className="text-base text-black">단마다 반복 규칙</Text>
            </View>
            <Text className="text-sm text-darkgray">16, 19, 21, 24, 27 ...</Text>
          </View>

          {/* 삭제/확인 버튼 */}
          <View className="flex-row justify-end gap-2">
            <TouchableOpacity className="w-11 h-11 bg-red-orange-200 rounded-full items-center justify-center">
              <Trash2 size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="w-11 h-11 bg-red-orange-200 rounded-full items-center justify-center">
              <Check size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

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
    </View>
  );
};

export default WaySetting;
