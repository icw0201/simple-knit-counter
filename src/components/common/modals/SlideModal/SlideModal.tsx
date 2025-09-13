import React, { useState, useRef, useEffect } from 'react';
import { View, Dimensions, DimensionValue, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ModalHandle } from './ModalHandle';

// ===== 타입 정의 =====
interface SlideModalProps {
  children: React.ReactNode;
  isOpen?: boolean; // 모달 열림 상태 (기본값: false)
  onToggle?: () => void; // 토글 콜백 (선택사항)
  height?: number; // 모달의 세로 길이 (기본값: 300)
  width?: number; // 모달의 가로 길이 (기본값: screenWidth)
  handleWidth?: number; // 핸들의 가로 길이 (기본값: 40)
  backgroundColor?: string; // 배경색 (기본값: white)
  padding?: number; // 모달 내부 패딩 (기본값: 20)
  top?: DimensionValue; // 모달의 상단 위치 (기본값: '50%')
  onClose?: () => void; // 닫기 콜백 (선택사항)
}


// ===== 상수 =====
const { width: screenWidth } = Dimensions.get('window');

// ===== 메인 컴포넌트 =====
export const SlideModal: React.FC<SlideModalProps> = ({
  children,
  isOpen = false,
  onToggle,
  height = 300,
  width = screenWidth,
  handleWidth = 40,
  backgroundColor = 'white',
  padding = 20,
  top = '50%',
  onClose,
}) => {
  // ===== 상태 관리 =====
  const translateYAnim = useRef(new Animated.Value(isOpen ? -width : -handleWidth)).current;
  const modalRef = useRef<View>(null);

  // isOpen props가 변경될 때 애니메이션으로 translateY 업데이트
  useEffect(() => {
    const targetValue = isOpen ? -width : -handleWidth;
    Animated.timing(translateYAnim, {
      toValue: targetValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, width, handleWidth, translateYAnim]);

  // ===== 핸들러 함수들 =====

  // 모달 열기
  const handleOpen = () => {
    Animated.timing(translateYAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
    onToggle?.();
  };

  // 모달 닫기
  const handleClose = () => {
    Animated.timing(translateYAnim, {
      toValue: -handleWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
    onToggle?.();
    onClose?.();
  };

  // 드래그 위치 업데이트
  const handleDragUpdate = (newTranslateY: number) => {
    translateYAnim.setValue(newTranslateY);
  };


  // ===== 렌더링 =====
  return (
    <View
      className="absolute top-0 left-0 right-0 bottom-0"
      style={{ zIndex: 50 }}
      pointerEvents="box-none"
    >
      {/* 모달 내용 - 항상 보임, 드래그에 따라 위치 변경 */}
      <Animated.View
        ref={modalRef}
        className="absolute border-t-2 border-l-2 border-white"
        style={{
          top: top,
          right: -width,
          width: width,
          height: height,
          backgroundColor,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          // iOS용 그림자 (위쪽 그림자 제거)
          shadowColor: '#000',
          shadowOffset: { width: -2, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          // Android용 그림자
          elevation: 3,
          transform: [
            { translateX: translateYAnim },
            { translateY: -height / 2 },
          ],
        }}
      >
        <LinearGradient
          colors={['#ffc7c6', '#ffe1e0', '#ffffff']} // red-orange-200, red-orange-100, white
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          locations={[0, 0.2, 0.6]} // 그라데이션 비율
          className="flex-1"
          style={{
            padding: padding,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          }}
        >
          {children}
        </LinearGradient>
      </Animated.View>

      {/* 핸들 - 터치/드래그 로직은 ModalHandle에서 처리 */}
      <ModalHandle
        isOpen={isOpen}
        height={height}
        handleWidth={handleWidth}
        modalWidth={width}
        translateYAnim={translateYAnim}
        top={top}
        onOpen={handleOpen}
        onClose={handleClose}
        onToggle={onToggle}
        onDragUpdate={handleDragUpdate}
      />
    </View>
  );
};
