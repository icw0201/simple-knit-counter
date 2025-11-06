// src/screens/InfoScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/AppNavigator';

import TextInputBox from '@components/common/TextInputBox';
import RoundedButton from '@components/common/RoundedButton';

import { getStoredItems, updateItem } from '@storage/storage';

/**
 * 정보 화면 컴포넌트
 * 프로젝트나 카운터의 상세 정보(시작일, 종료일, 게이지, 실, 바늘, 기타 메모)를
 * 편집하고 저장할 수 있는 화면입니다.
 */
const InfoScreen = () => {
  // 네비게이션 및 라우트 객체
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { itemId } = route.params as { itemId: string };

  // 폼 상태 관리
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [gauge, setGauge] = useState('');
  const [yarn, setYarn] = useState('');
  const [needle, setNeedle] = useState('');
  const [notes, setNotes] = useState('');

  /**
   * 저장된 아이템 정보를 불러와서 폼 상태를 초기화합니다.
   * 네비게이션 타이틀도 아이템 제목으로 설정합니다.
   */
  const loadItemInfo = useCallback(() => {
    const allItems = getStoredItems();
    const item = allItems.find((i) => i.id === itemId);

    if (!item) {
      return;
    }

    // 네비게이션 타이틀 설정
    navigation.setOptions({ title: `"${item.title}" 정보` });

    // 제목 설정
    setTitle(item.title);

    // 정보 필드 초기화 (기본값: 빈 문자열)
    const info = item.info ?? {};
    setStartDate(info.startDate ?? '');
    setEndDate(info.endDate ?? '');
    setGauge(info.gauge ?? '');
    setYarn(info.yarn ?? '');
    setNeedle(info.needle ?? '');
    setNotes(info.notes ?? '');
  }, [itemId, navigation]);

  // 컴포넌트 마운트 시 아이템 정보 로드
  useEffect(() => {
    loadItemInfo();
  }, [loadItemInfo]);

  /**
   * 폼 데이터를 저장하고 이전 화면으로 돌아갑니다.
   * 제목이 비어있으면 저장하지 않습니다.
   */
  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    // 아이템 정보 업데이트
    updateItem(itemId, {
      title: title.trim(),
      info: {
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        gauge: gauge.trim(),
        yarn: yarn.trim(),
        needle: needle.trim(),
        notes: notes.trim(),
      },
    });

    // 이전 화면으로 이동
    navigation.goBack();
  };

  /**
   * 저장 버튼의 활성화 상태를 결정합니다.
   * 제목이 비어있으면 비활성화됩니다.
   */
  const isSaveButtonActive = title.trim().length > 0;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80} // 헤더 높이 조정
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} className="p-4">
          {/* 제목 입력 필드 */}
          <TextInputBox
            label="이름"
            value={title}
            onChangeText={setTitle}
            placeholder="프로젝트명 혹은 카운터명"
            type="text"
          />

          {/* 날짜 입력 필드들 (좌우 배치) */}
          <View className="flex-row justify-between">
            <View className="flex-1 mr-2">
              <TextInputBox
                label="시작일"
                value={startDate}
                onChangeText={setStartDate}
                placeholder="yyyy.mm.dd"
                type="date"
              />
            </View>
            <View className="flex-1 ml-2">
              <TextInputBox
                label="종료일"
                value={endDate}
                onChangeText={setEndDate}
                placeholder="yyyy.mm.dd"
                type="date"
              />
            </View>
          </View>

          {/* 게이지 입력 필드 */}
          <TextInputBox
            label="게이지"
            value={gauge}
            onChangeText={setGauge}
            placeholder="게이지"
            type="longText"
          />

          {/* 실 정보 입력 필드 */}
          <TextInputBox
            label="실"
            value={yarn}
            onChangeText={setYarn}
            placeholder="사용한 실"
            type="longText"
          />

          {/* 바늘 정보 입력 필드 */}
          <TextInputBox
            label="바늘"
            value={needle}
            onChangeText={setNeedle}
            placeholder="사용한 바늘"
            type="longText"
          />

          {/* 기타 메모 입력 필드 */}
          <TextInputBox
            label="기타"
            value={notes}
            onChangeText={setNotes}
            placeholder="기타 정보"
            type="longText"
          />

          {/* 하단 액션 버튼들 */}
          <View className="flex-row justify-evenly mt-2">
            {/* 취소 버튼 */}
            <RoundedButton
              title="취소"
              onPress={() => navigation.goBack()}
              colorStyle="light"
            />

            {/* 저장 버튼 */}
            <RoundedButton
              title="저장"
              onPress={handleSave}
              colorStyle={isSaveButtonActive ? 'vivid' : undefined}
              containerClassName={!isSaveButtonActive ? 'bg-lightgray' : undefined}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InfoScreen;
