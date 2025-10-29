// src/components/RoundedBox.tsx
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import clsx from 'clsx';
import { colorStyles, ColorStyleKey } from '@styles/colorStyles';
import { getLucideIcon } from '@utils/iconUtils';

/**
 * RoundedBox 컴포넌트의 Props 인터페이스
 * @param isButton - 터치 가능한 버튼으로 동작할지 여부 (기본값: false)
 * @param onPress - 버튼 클릭 시 실행될 콜백 함수 (isButton이 true일 때만 사용)
 * @param onLongPress - 버튼 길게 누르기 시 실행될 콜백 함수 (isButton이 true일 때만 사용)
 * @param title - 박스에 표시될 주요 텍스트
 * @param subtitle - title 아래에 표시될 부제목 (선택사항)
 * @param number - 숫자 값 (선택사항)
 * @param iconName - 표시할 Lucide 아이콘 이름 (기본값: 'star')
 * @param rounded - 모서리 둥글기 스타일 (기본값: 'xl')
 * @param colorStyle - 색상 테마 스타일 키 (기본값: 'A')
 * @param layoutStyle - 레이아웃 스타일 ('Icon' - 제목과 아이콘 좌우 배치, 미지정 시 기본 레이아웃)
 * @param containerClassName - 추가적인 컨테이너 스타일 클래스
 */
interface RoundedBoxProps {
  isButton?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  title?: string;
  subtitle?: string;
  number?: number;
  iconName?: string;
  rounded?: string;
  colorStyle?: ColorStyleKey;
  layoutStyle?: 'Icon';
  containerClassName?: string;
}

/**
 * rounded 속성에 따른 CSS 클래스명을 반환하는 헬퍼 함수
 * @param rounded - 모서리 둥글기 값
 * @returns Tailwind CSS 클래스명
 */
const getRoundedClass = (rounded?: string) => {
  if (!rounded) {
    return 'rounded-xl'; // 기본값: xl 크기의 둥근 모서리
  }
  return rounded.startsWith('[') ? `rounded-${rounded}` : `rounded-${rounded}`; // 커스텀 값 지원
};

/**
 * 레이아웃 스타일 Icon: 제목과 아이콘을 좌우로 배치
 */
const renderLayoutIcon = (title: string, iconName: string, textColor: string, iconColor: string) => {
    // 아이콘 이름을 PascalCase로 변환하고 Lucide 아이콘으로 렌더링
    const IconComponent = getLucideIcon(iconName);

  return (
    <View className="flex-row items-center justify-between py-3">
      <Text className={clsx('text-base font-semibold', textColor)}>{title}</Text>
      <IconComponent size={20} color={iconColor} />
    </View>
  );
};

/**
 * 기본 레이아웃: 중앙 정렬된 제목 표시
 */
const renderDefaultLayout = (title: string | undefined, textColor: string) => (
  <View className="items-center justify-center min-h-16">
    {title && <Text className={clsx('text-base font-semibold', textColor)}>{title}</Text>}
  </View>
);

/**
 * 둥근 모서리를 가진 박스 컴포넌트
 * 다양한 레이아웃 스타일과 색상 테마를 지원하며,
 * isButton이 true일 경우 터치 가능한 버튼으로 동작합니다.
 */
const RoundedBox: React.FC<RoundedBoxProps> = ({
  isButton = false,
  onPress,
  onLongPress,
  title,
  subtitle: _subtitle,
  number: _number,
  iconName = 'star',
  rounded = 'xl',
  colorStyle = 'A',
  layoutStyle,
  containerClassName = '',
}) => {
  // 선택된 색상 테마에서 색상 값들을 가져오기
  const { container, text, icon } = colorStyles[colorStyle];

  // 모서리 둥글기 클래스와 박스 전체 클래스 조합
  const roundedClass = getRoundedClass(rounded);

  // 레이아웃 스타일에 따라 다른 내용 구성
  const renderContent = () => {
    if (layoutStyle === 'Icon') {
      return renderLayoutIcon(title || '', iconName, text, icon);
    }
    return renderDefaultLayout(title, text);
  };

  // 박스 뷰 생성
  const boxView = (
    <View className={clsx('p-4', container, roundedClass, containerClassName)}>
      {renderContent()}
    </View>
  );

  // isButton이 true면 TouchableOpacity로 감싸서 터치 가능하게, false면 단순 뷰 반환
  return isButton ? (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      {boxView}
    </TouchableOpacity>
  ) : (
    boxView
  );
};

export default RoundedBox;
