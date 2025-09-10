// src/navigation/HeaderOptions.tsx

import React from 'react';
import { ChevronLeft, Settings, Trash2, Info } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './AppNavigator';

import { View, Image, TouchableOpacity } from 'react-native';
import { activateIcons } from '@assets/images';
import { ActivateMode } from '@storage/types';

export const getDefaultHeaderLeft = (
  navigation: any
) => ({
  headerLeft: () => (
    <View className="mr-2 items-center">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ChevronLeft size={28} color="black" />
      </TouchableOpacity>
    </View>
  ),
});

//setting only (Info 페이지)
export const getDefaultHeaderRight = (
  navigation: NativeStackNavigationProp<RootStackParamList>
) => ({
  headerRight: () => (
    <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
      <Settings size={24} color="black" />
    </TouchableOpacity>
  ),
});

//지우기, 세팅 (Main페이지)
export const getHeaderRightWithEditAndSettings = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
  onEditPress: () => void
): React.JSX.Element => {
  return (
    <View className="flex-row">
      <TouchableOpacity onPress={onEditPress} style={{ marginRight: 12 }}>
        <Trash2 size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
        <Settings size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

//인포, 지우기, 세팅 (프로젝트 Detail 페이지)
export const getHeaderRightWithInfoEditAndSettings = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
  onInfoPress: () => void,
  onEditPress: () => void
): React.JSX.Element => {
  return (
    <View className="flex-row">
      <TouchableOpacity onPress={onInfoPress} style={{ marginRight: 16 }}>
        <Info size={26} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onEditPress} style={{ marginRight: 12 }}>
        <Trash2 size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
        <Settings size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

//활성이, 인포, 세팅 (CounterDetail전용)
export const getHeaderRightWithActivateInfoSettings = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
  currentActivateMode: ActivateMode,
  onActivatePress: () => void,
  onInfoPress?: () => void
): React.JSX.Element => {
  return (
    <View className="flex-row items-center">
      {/* 활성 아이콘 */}
      <TouchableOpacity onPress={onActivatePress}>
        <Image
          source={activateIcons[currentActivateMode]}
          style={{ width: 23, height: 23, marginRight: 13 }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Info 버튼 (선택적) */}
      {onInfoPress && (
        <TouchableOpacity onPress={onInfoPress} style={{ marginRight: 12 }}>
          <Info size={26} color="black" />
        </TouchableOpacity>
      )}

      {/* 설정 */}
      <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
        <Settings size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export const getDefaultTitle = (title: string) => ({
  title,
});
