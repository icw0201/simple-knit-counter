// src/components/common/IconBox.tsx
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import clsx from 'clsx';
import { colorStyles, ColorStyleKey } from '@styles/colorStyles';
import { getLucideIcon } from '@utils/iconUtils';

/**
 * IconBox 컴포넌트의 Props 인터페이스
 * @param onPress - 버튼 클릭 시 실행될 콜백 함수
 * @param title - 박스에 표시될 주요 텍스트
 * @param iconName - 표시할 Lucide 아이콘 이름
 * @param colorStyle - 색상 테마 스타일 키 (기본값: 'default')
 * @param containerClassName - 추가적인 컨테이너 스타일 클래스
 */
interface IconBoxProps {
  onPress: () => void;
  title: string;
  iconName: string;
  colorStyle?: ColorStyleKey;
  containerClassName?: string;
}

/**
 * 제목과 아이콘을 좌우로 배치하는 박스 컴포넌트
 * SettingsLinks에서 사용하는 전용 컴포넌트입니다.
 * rounded는 2xl로 고정되어 있고, 항상 버튼으로 동작합니다.
 */
const IconBox: React.FC<IconBoxProps> = ({
  onPress,
  title,
  iconName,
  colorStyle = 'default',
  containerClassName = '',
}) => {
  // 선택된 색상 테마에서 색상 값들을 가져오기
  const { container, text, icon } = colorStyles[colorStyle];

  // 아이콘 이름을 PascalCase로 변환하고 Lucide 아이콘으로 렌더링
  const IconComponent = getLucideIcon(iconName);

  // 박스 뷰 생성 (rounded는 2xl로 고정)
  const boxView = (
    <View className={clsx('p-4 rounded-2xl', container, containerClassName)}>
      <View className="flex-row items-center justify-between py-3">
        <Text className={clsx('text-base font-semibold', text)}>{title}</Text>
        <IconComponent size={20} color={icon} />
      </View>
    </View>
  );

  // 항상 TouchableOpacity로 감싸서 버튼으로 동작
  return (
    <TouchableOpacity onPress={onPress}>
      {boxView}
    </TouchableOpacity>
  );
};

export default IconBox;

