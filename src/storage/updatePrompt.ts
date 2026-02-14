// src/storage/updatePrompt.ts
import { storage } from './settings';

/**
 * 업데이트 권장 모달에서 "나중에"를 누른 경우,
 * 동일한 스토어 버전에 대해 반복 노출되지 않도록 저장합니다.
 */
const KEY_DISMISSED_STORE_VERSION = 'updatePrompt.dismissedStoreVersion';
const KEY_DISMISSED_ONESTORE_AT = 'updatePrompt.dismissedOnestoreAt';
const KEY_DISMISSED_ONESTORE_APP_VERSION = 'updatePrompt.dismissedOnestoreAppVersion';

export const getDismissedStoreVersion = (): string | undefined => {
  return storage.getString(KEY_DISMISSED_STORE_VERSION) ?? undefined;
};

export const setDismissedStoreVersion = (storeVersion: string) => {
  storage.set(KEY_DISMISSED_STORE_VERSION, storeVersion);
};

export const clearDismissedStoreVersion = () => {
  storage.delete(KEY_DISMISSED_STORE_VERSION);
};

/**
 * 원스토어 설치 유저는 스토어 버전 조회가 보장되지 않아
 * 일정 기간 동안 "업데이트 확인" 모달 재노출을 방지합니다.
 */
export const getDismissedOnestoreAt = (): number | undefined => {
  const value = storage.getNumber(KEY_DISMISSED_ONESTORE_AT);
  return typeof value === 'number' && value > 0 ? value : undefined;
};

export const setDismissedOnestoreAt = (timestampMs: number) => {
  storage.set(KEY_DISMISSED_ONESTORE_AT, timestampMs);
};

export const getDismissedOnestoreAppVersion = (): string | undefined => {
  return storage.getString(KEY_DISMISSED_ONESTORE_APP_VERSION) ?? undefined;
};

export const setDismissedOnestoreAppVersion = (appVersion: string) => {
  storage.set(KEY_DISMISSED_ONESTORE_APP_VERSION, appVersion);
};

