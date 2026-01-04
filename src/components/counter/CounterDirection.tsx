// src/components/counter/CounterDirection.tsx
import React from 'react';
import { View, Image, Pressable, Text } from 'react-native';
import { Way, RepeatRule } from '@storage/types';
import { Images } from '@assets/images';
import { ScreenSize, getGapClass } from '@constants/screenSizeConfig';
import { isRuleApplied } from '@utils/ruleUtils';

interface CounterDirectionProps {
  mascotIsActive: boolean;
  wayIsChange: boolean;
  way: Way;
  currentCount: number;
  repeatRules: RepeatRule[];
  imageWidth: number;
  imageHeight: number;
  screenSize: ScreenSize;
  onToggleWay: () => void;
}

/**
 * 카운터 방향 표시 컴포넌트
 * mascotIsActive가 true일 때만 표시되고, wayIsChange가 true일 때만 클릭으로 방향 토글 가능합니다.
 * 규칙이 적용되는 단에서는 emphasis 이미지를 표시합니다.
 */
const CounterDirection: React.FC<CounterDirectionProps> = ({
  mascotIsActive,
  wayIsChange,
  way,
  currentCount,
  repeatRules,
  imageWidth,
  imageHeight,
  screenSize,
  onToggleWay,
}) => {
  if (!mascotIsActive) {
    return null;
  }

  // 현재 단수에 적용되는 규칙 찾기
  const appliedRule = repeatRules.find(rule => isRuleApplied(currentCount, rule));
  const isRuleAppliedToCurrentCount = !!appliedRule;

  // 이미지 선택 로직
  let imageSource;
  if (isRuleAppliedToCurrentCount) {
    // 규칙이 적용되는 단: emphasis 이미지 사용
    if (wayIsChange) {
      imageSource = way === 'front' ? Images.emphasis_front : Images.emphasis_back;
    } else {
      imageSource = Images.emphasis_plain;
    }
  } else {
    // 규칙이 적용되지 않는 단: 기존 이미지 사용
    if (wayIsChange) {
      imageSource = way === 'front' ? Images.way_front : Images.way_back;
    } else {
      imageSource = Images.way_plain;
    }
  }

  return (
    <View className={getGapClass(screenSize)} style={{ height: imageHeight }}>
      <Pressable onPress={wayIsChange ? onToggleWay : undefined}>
        <View className="relative" style={{ width: imageWidth, height: imageHeight }}>
          {/* 규칙이 적용되는 경우: bubble 이미지 (way 이미지 아래, y축으로 위에 위치) */}
          {isRuleAppliedToCurrentCount && appliedRule && (
            <>
              <Image
                source={Images.emphasis_bubble}
                style={{
                  position: 'absolute',
                  width: imageWidth,
                  height: imageHeight,
                  resizeMode: 'contain',
                  top: -imageHeight * 0.8, // way 이미지 위에 위치
                  left: imageWidth * 0.05,
                  zIndex: 0, // way 이미지보다 아래
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: -imageHeight * 0.8,
                  left: imageWidth * 0.2,
                  width: imageWidth * 0.6,
                  height: imageHeight,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1, // 버블 이미지 위에 텍스트
                }}
              >
                <Text
                  className="font-bold text-center"
                  style={{ fontSize: imageHeight * 0.25 }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {appliedRule.message}
                </Text>
              </View>
            </>
          )}
          {/* 방향 이미지 (위에 표시) */}
          <Image
            source={imageSource}
            style={{
              width: imageWidth,
              height: imageHeight,
              resizeMode: 'contain',
              zIndex: 2, // 버블 이미지보다 위
            }}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default CounterDirection;
