// src/storage/settings.ts
import { MMKV } from 'react-native-mmkv';

// MMKV 스토리지 인스턴스 생성
export const storage = new MMKV();

// 설정 키 상수 정의
const KEY_SOUND = 'settings.sound';
const KEY_VIBRATION = 'settings.vibration';
const KEY_SCREEN_AWAKE = 'settings.screenAwake';

// 기본값 상수 정의
const DEFAULT_SOUND = true;
const DEFAULT_VIBRATION = true;
const DEFAULT_SCREEN_AWAKE = false;

/**
 * 사운드 설정을 저장합니다.
 * @param value 사운드 활성화 여부
 */
export const setSoundSetting = (value: boolean) => {
  storage.set(KEY_SOUND, JSON.stringify(value));
};

/**
 * 사운드 설정을 가져옵니다.
 * @returns 사운드 활성화 여부 (기본값: true)
 */
export const getSoundSetting = (): boolean => {
  const value = storage.getString(KEY_SOUND);
  return value ? JSON.parse(value) : DEFAULT_SOUND;
};

/**
 * 진동 설정을 저장합니다.
 * @param value 진동 활성화 여부
 */
export const setVibrationSetting = (value: boolean) => {
  storage.set(KEY_VIBRATION, JSON.stringify(value));
};

/**
 * 진동 설정을 가져옵니다.
 * @returns 진동 활성화 여부 (기본값: true)
 */
export const getVibrationSetting = (): boolean => {
  const value = storage.getString(KEY_VIBRATION);
  return value ? JSON.parse(value) : DEFAULT_VIBRATION;
};

/**
 * 화면 켜짐 설정을 저장합니다.
 * @param value 화면 켜짐 유지 여부
 */
export const setScreenAwakeSetting = (value: boolean) => {
  storage.set(KEY_SCREEN_AWAKE, JSON.stringify(value));
};

/**
 * 화면 켜짐 설정을 가져옵니다.
 * @returns 화면 켜짐 유지 여부 (기본값: false)
 */
export const getScreenAwakeSetting = (): boolean => {
  const value = storage.getString(KEY_SCREEN_AWAKE);
  return value ? JSON.parse(value) : DEFAULT_SCREEN_AWAKE;
};

/**
 * 모든 설정을 초기화합니다.
 * 저장된 설정값들을 모두 삭제하고 기본값으로 복원합니다.
 */
export const clearSettings = () => {
  storage.delete(KEY_SOUND);
  storage.delete(KEY_VIBRATION);
  storage.delete(KEY_SCREEN_AWAKE);
};
