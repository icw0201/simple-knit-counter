// src/storage/migration.ts
import { MMKV } from 'react-native-mmkv';
import { Item } from './types';

// MMKV 스토리지 인스턴스
const storage = new MMKV();
const STORAGE_KEY = 'knit_items';
const DATA_VERSION_KEY = 'data_version';

// 데이터 버전 관리
export const CURRENT_DATA_VERSION = 3; // 새 프로퍼티 추가 마이그레이션

/**
 * 버전 1: 기존 'active' 상태를 'auto'로 마이그레이션
 * @param items 마이그레이션할 아이템 배열
 * @returns 마이그레이션된 아이템 배열
 */
const migrateV1_ActiveToAuto = (items: Item[]): Item[] => {
  return items.map((item) => {
    if (item.type === 'counter' && (item as any).activateMode === 'active') {
      return { ...item, activateMode: 'auto' as const };
    }
    return item;
  });
};

/**
 * 버전 2: activateMode를 wayIsChange와 mascotIsActive로 마이그레이션
 * inactive → wayIsChange: false, mascotIsActive: false
 * auto → wayIsChange: true, mascotIsActive: true
 * @param items 마이그레이션할 아이템 배열
 * @returns 마이그레이션된 아이템 배열
 */
const migrateV2_ActivateModeToWayIsChangeAndMascotIsActive = (items: Item[]): Item[] => {
  return items.map((item) => {
    if (item.type === 'counter' && (item as any).activateMode !== undefined) {
      const { activateMode, ...rest } = item as any;

      // activateMode에 따른 매핑
      const wayIsChange = activateMode === 'auto';
      const mascotIsActive = activateMode === 'auto';

      return { ...rest, wayIsChange, mascotIsActive };
    }
    return item;
  });
};

/**
 * 버전 3: 새로 추가된 프로퍼티들에 기본값 설정
 * - targetCount: 0 (목표 없음)
 * - elapsedTime: 0 (초 단위, 0 ~ 359999)
 * - timerIsActive: false
 * - subCount, subRule, subRuleIsActive, subModalIsOpen (보조 카운터 필드)
 * - repeatRuleIsActive, repeatRuleNumber, repeatRuleStartNumber, repeatRuleEndNumber (반복 규칙 필드)
 * - sectionRecords, sectionModalIsOpen (구간 기록 필드)
 * @param items 마이그레이션할 아이템 배열
 * @returns 마이그레이션된 아이템 배열
 */
const migrateV3_AddNewProperties = (items: Item[]): Item[] => {
  return items.map((item) => {
    if (item.type === 'counter') {
      const counter = item as any;

      // 새로 추가된 프로퍼티들의 기본값 설정
      return {
        ...counter,
        // 타이머 및 목표 관련 프로퍼티
        targetCount: counter.targetCount ?? 0,
        elapsedTime: counter.elapsedTime ?? 0,
        timerIsActive: counter.timerIsActive ?? false,

        // 보조 카운터 필드들 (필수 프로퍼티)
        subCount: counter.subCount ?? 0,
        subRule: counter.subRule ?? 0,
        subRuleIsActive: counter.subRuleIsActive ?? false,
        subModalIsOpen: counter.subModalIsOpen ?? false,

        // 마스코트 반복 규칙 필드들 (필수 프로퍼티)
        repeatRuleIsActive: counter.repeatRuleIsActive ?? false,
        repeatRuleNumber: counter.repeatRuleNumber ?? 0,
        repeatRuleStartNumber: counter.repeatRuleStartNumber ?? 0,
        repeatRuleEndNumber: counter.repeatRuleEndNumber ?? 0,

        // 구간 기록 필드들 (필수 프로퍼티)
        sectionRecords: counter.sectionRecords ?? [],
        sectionModalIsOpen: counter.sectionModalIsOpen ?? false,
      };
    }
    return item;
  });
};

/**
 * 마이그레이션 실행
 * @param items 마이그레이션할 아이템 배열
 * @param fromVersion 시작 버전
 * @param toVersion 목표 버전
 * @returns 마이그레이션된 아이템 배열
 */
const runMigrations = (items: Item[], fromVersion: number, toVersion: number): Item[] => {
  let migratedItems = items;

  // 버전별 마이그레이션 실행
  if (fromVersion < 1 && toVersion >= 1) {
    migratedItems = migrateV1_ActiveToAuto(migratedItems);
  }

  if (fromVersion < 2 && toVersion >= 2) {
    migratedItems = migrateV2_ActivateModeToWayIsChangeAndMascotIsActive(migratedItems);
  }

  if (fromVersion < 3 && toVersion >= 3) {
    migratedItems = migrateV3_AddNewProperties(migratedItems);
  }

  return migratedItems;
};

/**
 * 데이터 버전 확인 및 마이그레이션 실행
 * 앱 시작 시 한 번만 실행되도록 최적화
 */
export const ensureDataMigration = (): void => {
  const currentVersion = storage.getNumber(DATA_VERSION_KEY) || 0;

  if (currentVersion >= CURRENT_DATA_VERSION) {
    return; // 이미 최신 버전
  }

  // 마이그레이션 실행
  const json = storage.getString(STORAGE_KEY);
  if (json) {
    const items = JSON.parse(json);
    const migratedItems = runMigrations(items, currentVersion, CURRENT_DATA_VERSION);

    // 변경사항이 있으면 저장
    if (JSON.stringify(migratedItems) !== JSON.stringify(items)) {
      storage.set(STORAGE_KEY, JSON.stringify(migratedItems));
    }
  }

  // 버전 업데이트
  storage.set(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
};

