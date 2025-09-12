import React, { useState } from 'react';
import { View, DimensionValue } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// ===== 타입 정의 =====
interface ModalHandleProps {
  isOpen: boolean;
  height: number;
  handleWidth: number;
  modalWidth: number;
  translateY: number;
  top: DimensionValue;
  onOpen: () => void;
  onClose: () => void;
  onDragUpdate: (translateY: number) => void;
}

interface DragState {
  isDragging: boolean;
  startY: number;
  currentY: number;
}

// ===== 상수 =====
const DRAG_THRESHOLD = 20; // 드래그 감지 임계값 (px)
const OPEN_THRESHOLD = 50; // 모달 열기 임계값 (px)
const CLOSE_THRESHOLD = 30; // 모달 닫기 임계값 (px)

// ===== 핸들 컴포넌트 =====
export const ModalHandle: React.FC<ModalHandleProps> = ({
  isOpen,
  height,
  handleWidth,
  modalWidth,
  translateY,
  top,
  onOpen,
  onClose,
  onDragUpdate,
}) => {
  // ===== 드래그 상태 관리 =====
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startY: 0,
    currentY: 0,
  });

  // ===== 터치 이벤트 핸들러 =====

  // 터치 시작 이벤트 처리
  const handleTouchStart = (e: any) => {
    const touch = e.nativeEvent.touches[0];
    setDragState({
      isDragging: false,
      startY: touch.pageX,
      currentY: touch.pageX,
    });
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
          const newTranslateY = -modalWidth + deltaX;
          onDragUpdate(newTranslateY);
          setDragState((prev) => ({ ...prev, currentY: touch.pageX }));
        }
      } else {
        // 닫혀있을 때: 왼쪽으로만 드래그 가능
        if (deltaX <= 0) {
          const newTranslateY = -handleWidth + deltaX;
          onDragUpdate(newTranslateY);
          setDragState((prev) => ({ ...prev, currentY: touch.pageX }));
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
        onClose();
      } else {
        // 원래 열린 위치로 복귀
        onDragUpdate(-modalWidth);
      }
    } else {
      // 닫혀있을 때: 왼쪽으로 충분히 드래그하면 열림
      if (deltaX < -OPEN_THRESHOLD) {
        onOpen();
      } else {
        // 원래 닫힌 위치로 복귀
        onDragUpdate(-handleWidth);
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
      onClose();
    } else {
      onOpen();
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
  return (
    <View
      className="absolute bg-transparent"
      style={{
        top: top,
        right: -handleWidth,
        width: handleWidth,
        height: height,
        zIndex: 2,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        transform: [
          { translateX: translateY },
          { translateY: -height / 2 },
        ],
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEndWithCheck}
    >
      {isOpen ? (
        // 열려있을 때: 투명한 핸들 + 흰색 바
        <View className="w-full h-full items-center justify-center">
          <View
            className="w-1 bg-white rounded-sm"
            style={{ height: height * 0.4 }}
          />
        </View>
      ) : (
        // 닫혀있을 때: 그라데이션 핸들만 (바 없음)
        <View
          className="flex-1 border-t-2 border-l-2 border-white overflow-hidden"
          style={{
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          }}
        >
          <LinearGradient
            colors={['#ff6b67', '#ffc7c6']} // 400, 200
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="flex-1"
          />
        </View>
      )}
    </View>
  );
};

