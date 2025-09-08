// src/screens/Settings.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Linking, ScrollView } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { activateKeepAwake, deactivateKeepAwake } from '@sayem314/react-native-keep-awake';

import RoundedBox from '@components/RoundedBox';
import CheckBox from '@components/CheckBox';
import CustomModal from '@components/CustomModal';

import { clearAllProjectData } from '@storage/storage';
import {
  setSoundSetting,
  setVibrationSetting,
  getSoundSetting,
  getVibrationSetting,
  getScreenAwakeSetting,
  setScreenAwakeSetting,
} from '@storage/settings';

/**
 * 설정 화면 컴포넌트
 * 앱의 다양한 설정을 관리하고, 리뷰/문의 링크를 제공합니다.
 */
const Settings = () => {
  // 네비게이션 객체
  const navigation = useNavigation();

  // 설정 상태 관리
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [screenAwake, setScreenAwake] = useState(true);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 앱 시작 시 저장된 설정값 불러오기
  useEffect(() => {
    setSound(getSoundSetting());
    setVibration(getVibrationSetting());
    const currentSetting = getScreenAwakeSetting();
    setScreenAwake(currentSetting);
  }, []);

  /**
   * 소리 설정 토글 처리
   */
  const handleSoundToggle = () => {
    const newValue = !sound;
    setSound(newValue);
    setSoundSetting(newValue);
  };

  /**
   * 진동 설정 토글 처리
   */
  const handleVibrationToggle = () => {
    const newValue = !vibration;
    setVibration(newValue);
    setVibrationSetting(newValue);
  };

  /**
   * 화면 켜짐 설정 토글 처리
   */
  const handleScreenAwakeToggle = () => {
    const newValue = !screenAwake;
    setScreenAwake(newValue);
    setScreenAwakeSetting(newValue);

    if (newValue) {
      activateKeepAwake();
    } else {
      deactivateKeepAwake();
    }
  };

  /**
   * 초기화 확인 모달 열기
   */
  const handleResetToggle = () => {
    setResetModalVisible(true);
  };

  /**
   * 초기화 실행 및 앱 재시작
   */
  const handleResetConfirm = () => {
    // 모든 프로젝트 데이터 삭제
    clearAllProjectData();

    // 상태 초기화
    setResetConfirm(false);
    setResetModalVisible(false);

    // 앱을 Main 화면으로 재시작
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      })
    );
  };

  /**
   * 에러 모달 표시
   */
  const showErrorModal = (message: string) => {
    setErrorMessage(message);
    setErrorModalVisible(true);
  };

  /**
   * 외부 링크 열기 (리뷰/문의)
   * @param type - 링크 타입 ('review' | 'contact')
   */
  const handlePress = (type: 'review' | 'contact') => {
    if (type === 'review') {
      // 원스토어 리뷰 링크 https://play.google.com/store/apps/details?id=com.simpleknitcounter&pcampaignid=web_share
      Linking.openURL('https://onesto.re/0001001132').catch(() => {
        showErrorModal('원스토어를 열 수 없습니다.');
      });
    } else if (type === 'contact') {
      // 문의 이메일 링크
      const subject = encodeURIComponent('어쩜! 단수 카운터 문의');
      const email = 'Gaebal0201@gmail.com';
      const url = `mailto:${email}?subject=${subject}`;

      Linking.openURL(url).catch(() => {
        showErrorModal('메일 앱을 열 수 없습니다.');
      });
    }
  };

  /**
   * 초기화 모달 닫기 및 상태 초기화
   */
  const handleResetModalClose = () => {
    setResetModalVisible(false);
    setResetConfirm(false);
  };

  return (
    <View className="flex-1">
      {/* 설정 옵션들 */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 20,
          justifyContent: 'center',
          flexGrow: 1,
        }}
        className="p-4"
      >
        <View className="mb-6 space-y-4">
          <CheckBox
            label="소리"
            checked={sound}
            onToggle={handleSoundToggle}
          />
          <CheckBox
            label="진동"
            checked={vibration}
            onToggle={handleVibrationToggle}
          />
          <CheckBox
            label="카운터 스크린 항상 켜두기"
            checked={screenAwake}
            onToggle={handleScreenAwakeToggle}
          />
          <CheckBox
            label="초기화하기"
            checked={resetConfirm}
            onToggle={handleResetToggle}
          />
        </View>

        {/* 외부 링크 버튼들 */}
        <View className="mb-8">
          <RoundedBox
            title="별점 남기기"
            layoutStyle="F"
            colorStyle="C"
            iconName="star"
            isButton
            rounded="2xl"
            containerClassName="mb-4"
            onPress={() => handlePress('review')}
          />
          <RoundedBox
            title="문의하기"
            layoutStyle="F"
            colorStyle="C"
            iconName="email"
            isButton
            rounded="2xl"
            containerClassName="mb-4"
            onPress={() => handlePress('contact')}
          />
        </View>

        {/* 앱 버전 정보 */}
        <View className="items-center mt-4">
          <Text className="text-[14px] text-gray-500">Ver 1.1.2</Text>
        </View>
      </ScrollView>

      {/* 초기화 확인 모달 */}
      <CustomModal
        visible={resetModalVisible}
        onClose={handleResetModalClose}
        title="초기화"
        description="정말 프로젝트 정보를 모두 삭제하시겠습니까?"
        buttonType="confirmCancel"
        onConfirm={handleResetConfirm}
        onCancel={handleResetModalClose}
      />

      {/* 에러 알림 모달 */}
      <CustomModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        title="오류"
        description={errorMessage}
        buttonType="confirm"
        onConfirm={() => setErrorModalVisible(false)}
      />
    </View>
  );
};

export default Settings;
