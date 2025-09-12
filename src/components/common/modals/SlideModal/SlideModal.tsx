import React, { useState, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ModalHandle } from './ModalHandle';

// ===== 타입 정의 =====
interface SlideModalProps {
  children: React.ReactNode;
  height?: number; // 모달의 세로 길이 (기본값: 300)
  handleWidth?: number; // 핸들의 가로 길이 (기본값: 40)
  backgroundColor?: string; // 배경색 (기본값: white)
  padding?: number; // 모달 내부 패딩 (기본값: 20)
  onClose?: () => void; // 닫기 콜백 (선택사항)
}


// ===== 상수 =====
const { width: screenWidth } = Dimensions.get('window');

// ===== 메인 컴포넌트 =====
export const SlideModal: React.FC<SlideModalProps> = ({
  children,
  height = 300,
  handleWidth = 40,
  backgroundColor = 'white',
  padding = 20,
  onClose,
}) => {
  // ===== 상태 관리 =====
  const modalWidth = screenWidth * 0.9; // 화면의 90%
  const [isOpen, setIsOpen] = useState(false);
  const [translateY, setTranslateY] = useState(-handleWidth); // 초기값: 핸들만 보이도록

  const modalRef = useRef<View>(null);

  // ===== 핸들러 함수들 =====

  // 모달 열기
  const handleOpen = () => {
    setTranslateY(-modalWidth);
    setIsOpen(true);
  };

  // 모달 닫기
  const handleClose = () => {
    setTranslateY(-handleWidth);
    setIsOpen(false);
    onClose?.();
  };

  // 드래그 위치 업데이트
  const handleDragUpdate = (newTranslateY: number) => {
    setTranslateY(newTranslateY);
  };


  // ===== 렌더링 =====
  return (
    <View
      className="absolute top-0 left-0 right-0 bottom-0"
      style={{ zIndex: 50 }}
      pointerEvents={isOpen ? 'auto' : 'box-none'}
    >
      {/* 모달 내용 - 항상 보임, 드래그에 따라 위치 변경 */}
      <View
        ref={modalRef}
        className="absolute border-t-2 border-l-2 border-white"
        style={{
          top: '50%',
          right: -modalWidth,
          width: modalWidth,
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
            { translateX: translateY },
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
      </View>

      {/* 핸들 - 터치/드래그 로직은 ModalHandle에서 처리 */}
      <ModalHandle
        isOpen={isOpen}
        height={height}
        handleWidth={handleWidth}
        modalWidth={modalWidth}
        translateY={translateY}
        onOpen={handleOpen}
        onClose={handleClose}
        onDragUpdate={handleDragUpdate}
      />
    </View>
  );
};
