import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// ===== 타입 정의 =====
interface ModalHandleProps {
  isOpen: boolean;
  height: number;
  handleWidth: number;
  translateY: number;
  onTouchStart: (e: any) => void;
  onTouchMove: (e: any) => void;
  onTouchEnd: () => void;
}

// ===== 핸들 컴포넌트 =====
export const ModalHandle: React.FC<ModalHandleProps> = ({
  isOpen,
  height,
  handleWidth,
  translateY,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  return (
    <View
      style={[
        styles.handle,
        {
          right: -handleWidth,
          width: handleWidth,
          height: height,
          transform: [
            { translateX: translateY },
            { translateY: -height / 2 },
          ],
        },
      ]}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
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
          style={{
            flex: 1,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderLeftWidth: 2,
            borderTopWidth: 2,
            borderLeftColor: '#ffffff',
            borderTopColor: '#ffffff',
            overflow: 'hidden', // 그라데이션이 둥근 모서리를 따라가도록
          }}
        >
          <LinearGradient
            colors={['#ff6b67', '#ffc7c6']} // 400, 200
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </View>
      )}
    </View>
  );
};

// ===== 스타일 =====
const styles = StyleSheet.create({
  handle: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'transparent',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    zIndex: 2,
  },
});
