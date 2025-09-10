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

interface DragState {
  isDragging: boolean;
  startY: number;
  currentY: number;
  translateY: number;
}

// ===== 상수 =====
const { width: screenWidth } = Dimensions.get('window');
const DRAG_THRESHOLD = 20; // 드래그 감지 임계값 (px)
const OPEN_THRESHOLD = 50; // 모달 열기 임계값 (px)
const CLOSE_THRESHOLD = 30; // 모달 닫기 임계값 (px)

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
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startY: 0,
    currentY: 0,
    translateY: -handleWidth, // 초기값: 핸들만 보이도록
  });

  const modalRef = useRef<View>(null);

  // ===== 터치 이벤트 핸들러 =====

  // 터치 시작 이벤트 처리
  const handleTouchStart = (e: any) => {
    const touch = e.nativeEvent.touches[0];
    setDragState((prev) => ({
      ...prev,
      startY: touch.pageX,
      currentY: touch.pageX,
      isDragging: false, // 처음에는 드래그 상태가 아님
    }));
  };

  // 터치 이동 이벤트 처리 (드래그)
  const handleTouchMove = (e: any) => {
    const touch = e.nativeEvent.touches[0];
    const deltaX = touch.pageX - dragState.startY;

    // 드래그 상태로 전환
    if (Math.abs(deltaX) > DRAG_THRESHOLD && !dragState.isDragging) {
      setDragState((prev) => ({ ...prev, isDragging: true }));
    }

    if (dragState.isDragging) {
      if (isOpen) {
        // 열려있을 때: 오른쪽으로만 드래그 가능
        if (deltaX >= 0) {
          setDragState((prev) => ({
            ...prev,
            translateY: -modalWidth + deltaX,
            currentY: touch.pageX,
          }));
        }
      } else {
        // 닫혀있을 때: 왼쪽으로만 드래그 가능
        if (deltaX <= 0) {
          setDragState((prev) => ({
            ...prev,
            translateY: -handleWidth + deltaX,
            currentY: touch.pageX,
          }));
        }
      }
    }
  };

  // 터치 종료 이벤트 처리 (드래그 완료)
  const handleTouchEnd = () => {
    if (!dragState.isDragging) {
      return;
    }

    setDragState((prev) => ({ ...prev, isDragging: false }));
    const deltaX = dragState.currentY - dragState.startY;

    if (isOpen) {
      // 열려있을 때: 오른쪽으로 충분히 드래그하면 닫힘
      if (deltaX > CLOSE_THRESHOLD) {
        setDragState((prev) => ({ ...prev, translateY: -handleWidth }));
        setIsOpen(false);
        onClose?.();
      } else {
        // 원래 열린 위치로 복귀
        setDragState((prev) => ({ ...prev, translateY: -modalWidth }));
      }
    } else {
      // 닫혀있을 때: 왼쪽으로 충분히 드래그하면 열림
      if (deltaX < -OPEN_THRESHOLD) {
        setDragState((prev) => ({ ...prev, translateY: -modalWidth }));
        setIsOpen(true);
      } else {
        // 원래 닫힌 위치로 복귀
        setDragState((prev) => ({ ...prev, translateY: -handleWidth }));
      }
    }
  };

  // 단순 터치 이벤트 처리 (드래그가 아닌 경우)
  const handlePress = () => {
    const deltaX = Math.abs(dragState.currentY - dragState.startY);
    if (deltaX > DRAG_THRESHOLD) {
      return; // 드래그로 간주
    }

    if (isOpen) {
      // 열려있을 때: 터치하면 닫기
      setDragState((prev) => ({ ...prev, translateY: -handleWidth }));
      setIsOpen(false);
      onClose?.();
    } else {
      // 닫혀있을 때: 터치하면 열기
      setDragState((prev) => ({ ...prev, translateY: -modalWidth }));
      setIsOpen(true);
    }
  };

  // 터치 종료 시 드래그/터치 구분 처리
  const handleTouchEndWithCheck = () => {
    const deltaX = Math.abs(dragState.currentY - dragState.startY);

    if (deltaX <= DRAG_THRESHOLD) {
      // 드래그가 아닌 단순 터치
      handlePress();
    } else {
      // 드래그
      handleTouchEnd();
    }
  };


  // ===== 렌더링 =====
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0" style={{ zIndex: 50 }}>
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
            { translateX: dragState.translateY },
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
        translateY={dragState.translateY}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEndWithCheck}
      />
    </View>
  );
};
