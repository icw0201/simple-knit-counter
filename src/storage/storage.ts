// src/storage/storage.ts
import { MMKV } from 'react-native-mmkv';
import { Item, Counter, Project } from './types';

// MMKV 스토리지 인스턴스 생성
const storage = new MMKV();
const STORAGE_KEY = 'knit_items';
const MIGRATION_KEY = 'migration_active_to_auto_completed';

/**
 * 기존 'active' 상태를 'auto'로 마이그레이션합니다.
 * 배포된 앱의 기존 사용자 데이터 호환성을 위한 함수입니다.
 * @param items 마이그레이션할 아이템 배열
 * @returns 마이그레이션된 아이템 배열
 */
const migrateActiveToAuto = (items: Item[]): Item[] => {
  return items.map((item) => {
    if (item.type === 'counter' && item.activateMode === ('active' as any)) {
      return { ...item, activateMode: 'auto' as const };
    }
    return item;
  });
};

/**
 * 마이그레이션이 필요한지 확인하고 필요시 실행합니다.
 * 한 번만 실행되도록 플래그를 사용합니다.
 */
const ensureMigrationCompleted = (): void => {
  const migrationCompleted = storage.getBoolean(MIGRATION_KEY);

  if (migrationCompleted) {
    return; // 이미 마이그레이션 완료
  }

  // 마이그레이션 실행
  const json = storage.getString(STORAGE_KEY);
  if (json) {
    const items = JSON.parse(json);
    const migratedItems = migrateActiveToAuto(items);

    // 변경사항이 있으면 저장
    if (migratedItems !== items) {
      storage.set(STORAGE_KEY, JSON.stringify(migratedItems));
    }
  }

  // 마이그레이션 완료 플래그 설정
  storage.set(MIGRATION_KEY, true);
};

/**
 * 모든 항목을 불러옵니다.
 * 마이그레이션은 앱 시작 시 한 번만 실행됩니다.
 * @returns 저장된 모든 Item 배열
 */
export const getStoredItems = (): Item[] => {
  // 마이그레이션 확인 (한 번만)
  ensureMigrationCompleted();

  const json = storage.getString(STORAGE_KEY);
  const items = json ? JSON.parse(json) : [];

  // console.log('📱 [Storage] getStoredItems:', items.length, 'items loaded');
  return items;
};

/**
 * 모든 항목을 저장합니다.
 * @param items 저장할 Item 배열
 */
const setStoredItems = (items: Item[]) => {
  storage.set(STORAGE_KEY, JSON.stringify(items));
  // console.log('💾 [Storage] setStoredItems:', items.length, 'items saved');
};

/**
 * 새로운 항목을 추가합니다.
 * @param newItem 추가할 새로운 Item
 */
export const addItem = (newItem: Item) => {
  // console.log('➕ [Storage] addItem:', {
  //   id: newItem.id,
  //   type: newItem.type,
  //   title: newItem.title,
  //   ...(newItem.type === 'counter' && { parentProjectId: newItem.parentProjectId }),
  // });

  const existing = getStoredItems();
  setStoredItems([...existing, newItem]);
};

/**
 * ID로 항목을 삭제합니다.
 * @param id 삭제할 항목의 ID
 */
export const removeItem = (id: string) => {
  // console.log('🗑️ [Storage] removeItem:', id);
  const items = getStoredItems();
  const filteredItems = items.filter((item) => item.id !== id);
  setStoredItems(filteredItems);
};

/**
 * 항목을 수정합니다. ID가 일치하는 항목의 필드를 병합합니다.
 * @param id 수정할 항목의 ID
 * @param updatedFields 업데이트할 필드들
 */
export const updateItem = (id: string, updatedFields: Record<string, any>) => {
  // console.log('✏️ [Storage] updateItem:', id, 'with fields:', updatedFields);
  const items = getStoredItems();
  const updatedItems = items.map((item) =>
    item.id === id ? { ...item, ...updatedFields } : item
  );
  setStoredItems(updatedItems);
};

/**
 * 특정 프로젝트에서 카운터를 제거합니다.
 * @param projectId 프로젝트 ID
 * @param counterId 제거할 카운터 ID
 */
export const removeCounterFromProject = (projectId: string, counterId: string) => {
  // console.log('🔗 [Storage] removeCounterFromProject:', { projectId, counterId });
  const allItems = getStoredItems();

  // 프로젝트 찾기
  const project = allItems.find((item): item is Project =>
    item.id === projectId && item.type === 'project'
  );

  if (!project) {
    // console.warn('⚠️ [Storage] Project not found:', projectId);
    return;
  }

  // 프로젝트에서 카운터 ID 제거
  const updatedProject: Project = {
    ...project,
    counterIds: project.counterIds.filter((id) => id !== counterId),
  };

  // console.log('📊 [Storage] Project before:', {
  //   id: project.id,
  //   title: project.title,
  //   counterIds: project.counterIds,
  // });
  // console.log('📊 [Storage] Project after:', {
  //   id: updatedProject.id,
  //   title: updatedProject.title,
  //   counterIds: updatedProject.counterIds,
  // });

  // 카운터와 프로젝트를 제거하고 업데이트된 프로젝트 추가
  const updatedItems = allItems
    .filter(item => item.id !== counterId && item.id !== projectId)
    .concat(updatedProject);

  setStoredItems(updatedItems);
};

/**
 * 모든 프로젝트를 가져옵니다.
 * @returns Project 배열
 */
export const getAllProjects = (): Project[] => {
  const items = getStoredItems();
  const projects = items.filter((item): item is Project => item.type === 'project');
  // console.log('📁 [Storage] getAllProjects:', projects.length, 'projects');
  return projects;
};

/**
 * 독립 카운터(프로젝트에 소속되지 않은)를 가져옵니다.
 * @returns 독립적인 Counter 배열
 */
export const getIndependentCounters = (): Counter[] => {
  const items = getStoredItems();
  const counters = items.filter((item): item is Counter => item.type === 'counter');
  const independentCounters = counters.filter((counter) => !counter.parentProjectId);
  // console.log('🆓 [Storage] getIndependentCounters:', independentCounters.length, 'counters');
  return independentCounters;
};

/**
 * 모든 프로젝트 데이터를 삭제합니다.
 */
export const clearAllProjectData = () => {
  // console.log('🗑️ [Storage] clearAllProjectData: Clearing all data');
  storage.delete(STORAGE_KEY);
};
