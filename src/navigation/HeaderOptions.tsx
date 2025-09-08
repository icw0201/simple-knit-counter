// src/navigation/HeaderOptions.tsx

import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './AppNavigator';
import { View } from 'react-native';

import { Image, TouchableOpacity } from 'react-native';
import { activateIcons } from '@assets/images';
import { ActivateMode } from '@storage/types';

export const getDefaultHeaderLeft = (
  navigation: any
) => ({
  headerLeft: () => (
    <View className="mr-2 items-center">
      <MaterialIcons
        name="chevron-left"
        size={28}
        color="black"
        onPress={() => navigation.goBack()}
      />
    </View>
  ),
});

//setting only (Info 페이지)
export const getDefaultHeaderRight = (
  navigation: NativeStackNavigationProp<RootStackParamList>
) => ({
  headerRight: () => (
    <MaterialIcons
      name="settings"
      size={24}
      color="black"
      onPress={() => navigation.navigate('Setting')}
    />
  ),
});

//지우기, 세팅 (Main페이지)
export const getHeaderRightWithEditAndSettings = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
  onEditPress: () => void
): React.JSX.Element => {
  return (
    <View className="flex-row">
      <MaterialIcons
        name="delete-sweep"
        size={24}
        color="black"
        style={{ marginRight: 12 }}
        onPress={onEditPress}
      />
      <MaterialIcons
        name="settings"
        size={24}
        color="black"
        onPress={() => navigation.navigate('Setting')}
      />
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
      <MaterialIcons
        name="info-outline"
        size={26}
        color="black"
        style={{ marginRight: 16 }}
        onPress={onInfoPress}
      />
      <MaterialIcons
        name="delete-sweep"
        size={24}
        color="black"
        style={{ marginRight: 12 }}
        onPress={onEditPress}
      />
      <MaterialIcons
        name="settings"
        size={24}
        color="black"
        onPress={() => navigation.navigate('Setting')}
      />
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
        <MaterialIcons
          name="info-outline"
          size={26}
          color="black"
          style={{ marginRight: 12 }}
          onPress={onInfoPress}
        />
      )}

      {/* 설정 */}
      <MaterialIcons
        name="settings"
        size={24}
        color="black"
        onPress={() => navigation.navigate('Setting')}
      />
    </View>
  );
};

export const getDefaultTitle = (title: string) => ({
  title,
});
