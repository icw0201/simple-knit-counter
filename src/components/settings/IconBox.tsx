import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import clsx from 'clsx';
import { colorStyles } from '@styles/colorStyles';
import { getLucideIcon } from '@utils/iconUtils';

interface IconBoxProps {
  onPress: () => void;
  title: string;
  iconName: string;
}

const IconBox: React.FC<IconBoxProps> = ({ onPress, title, iconName }) => {
  const { container, text, icon } = colorStyles.light;
  const IconComponent = getLucideIcon(iconName);

  return (
    <TouchableOpacity onPress={onPress}>
      <View className={clsx('p-4 rounded-2xl mb-4', container)}>
        <View className="flex-row items-center justify-between py-3">
          <Text className={clsx('text-base font-semibold', text)}>{title}</Text>
          <IconComponent size={20} color={icon} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default IconBox;

