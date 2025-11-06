// src/screens/InfoScreen.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/AppNavigator';

import TextInputBox from '@components/common/TextInputBox';
import RoundedButton from '@components/common/RoundedButton';
import { ConfirmModal } from '@components/common/modals';

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

  // 초기값 저장 (변경사항 비교용)
  const initialValuesRef = useRef({
    title: '',
    startDate: '',
    endDate: '',
    gauge: '',
    yarn: '',
    needle: '',
    notes: '',
  });

  // 저장 확인 모달 상태
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  // 저장하지 않고 뒤로가기 허용 플래그
  const shouldAllowBackWithoutSaveRef = useRef(false);

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
    const titleValue = item.title;
    setTitle(titleValue);

    // 정보 필드 초기화 (기본값: 빈 문자열)
    const info = item.info ?? {};
    const startDateValue = info.startDate ?? '';
    const endDateValue = info.endDate ?? '';
    const gaugeValue = info.gauge ?? '';
    const yarnValue = info.yarn ?? '';
    const needleValue = info.needle ?? '';
    const notesValue = info.notes ?? '';

    setStartDate(startDateValue);
    setEndDate(endDateValue);
    setGauge(gaugeValue);
    setYarn(yarnValue);
    setNeedle(needleValue);
    setNotes(notesValue);

    // 초기값 저장
    initialValuesRef.current = {
      title: titleValue,
      startDate: startDateValue,
      endDate: endDateValue,
      gauge: gaugeValue,
      yarn: yarnValue,
      needle: needleValue,
      notes: notesValue,
    };
  }, [itemId, navigation]);

  // 컴포넌트 마운트 시 아이템 정보 로드
  useEffect(() => {
    loadItemInfo();
  }, [loadItemInfo]);

  /**
   * 현재 값과 초기값을 비교하여 변경사항이 있는지 확인
   */
  const hasChanges = useCallback(() => {
    const current = {
      title: title.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      gauge: gauge.trim(),
      yarn: yarn.trim(),
      needle: needle.trim(),
      notes: notes.trim(),
    };

    const initial = initialValuesRef.current;

    return (
      current.title !== initial.title ||
      current.startDate !== initial.startDate ||
      current.endDate !== initial.endDate ||
      current.gauge !== initial.gauge ||
      current.yarn !== initial.yarn ||
      current.needle !== initial.needle ||
      current.notes !== initial.notes
    );
  }, [title, startDate, endDate, gauge, yarn, needle, notes]);

  /**
   * 뒤로가기 이벤트 처리
   * 변경사항이 있으면 확인 모달을 표시하고, 없으면 바로 뒤로가기
   */
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // 뒤로가기 허용 플래그가 설정되어 있으면 그대로 진행하고 플래그 리셋
      if (shouldAllowBackWithoutSaveRef.current) {
        shouldAllowBackWithoutSaveRef.current = false;
        return;
      }

      // 변경사항이 없으면 그대로 진행
      if (!hasChanges()) {
        return;
      }

      // 기본 동작 방지
      e.preventDefault();

      // 확인 모달 표시
      setShowSaveConfirmModal(true);
    });

    return unsubscribe;
  }, [navigation, hasChanges]);

  /**
   * 폼 데이터를 저장합니다.
   * 제목이 비어있으면 저장하지 않습니다.
   */
  const saveData = useCallback(() => {
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

    // 초기값 업데이트
    initialValuesRef.current = {
      title: title.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      gauge: gauge.trim(),
      yarn: yarn.trim(),
      needle: needle.trim(),
      notes: notes.trim(),
    };
  }, [title, startDate, endDate, gauge, yarn, needle, notes, itemId]);

  /**
   * 폼 데이터를 저장하고 이전 화면으로 돌아갑니다.
   * 제목이 비어있으면 저장하지 않습니다.
   */
  const handleSave = useCallback(() => {
    saveData();
    // 이전 화면으로 이동
    navigation.goBack();
  }, [saveData, navigation]);

  /**
   * 저장 확인 모달에서 확인 버튼 클릭 시
   */
  const handleSaveConfirm = () => {
    saveData();
    shouldAllowBackWithoutSaveRef.current = true;
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
            required
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
              onPress={() => {
                if (hasChanges()) {
                  setShowSaveConfirmModal(true);
                } else {
                  navigation.goBack();
                }
              }}
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

      {/* 저장 확인 모달 */}
      <ConfirmModal
        visible={showSaveConfirmModal}
        onClose={() => {
          setShowSaveConfirmModal(false);
          // 취소 버튼 클릭 시: 저장하지 않고 뒤로가기 허용 플래그 설정
          shouldAllowBackWithoutSaveRef.current = true;
          // 모달이 완전히 닫힌 후 뒤로가기 실행
          setTimeout(() => {
            navigation.goBack();
          }, 200);
        }}
        title="저장하기"
        description="저장하지 않은 내용이 있습니다. 저장하시겠습니까?"
        onConfirm={handleSaveConfirm}
        confirmText="확인"
        cancelText="취소"
      />
    </SafeAreaView>
  );
};

export default InfoScreen;
