// src/utils/iconUtils.ts
import * as LucideIcons from 'lucide-react-native';

/**
 * kebab-case 아이콘 이름을 PascalCase로 변환하고 Lucide 아이콘 컴포넌트를 반환합니다.
 * @param iconName - kebab-case 형태의 아이콘 이름 (예: 'trash-2', 'edit-3')
 * @returns Lucide 아이콘 컴포넌트 또는 기본 Star 아이콘
 */
export const getLucideIcon = (iconName: string) => {
  // 아이콘 이름을 PascalCase로 변환
  const pascalCaseName = iconName
    .replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
    .replace(/^[a-z]/, (letter) => letter.toUpperCase());
  
  // Lucide 아이콘 컴포넌트 반환 (없으면 Star 아이콘을 기본값으로)
  return LucideIcons[pascalCaseName] || LucideIcons.Star;
};
