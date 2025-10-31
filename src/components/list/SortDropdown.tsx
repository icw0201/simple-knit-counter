import React, { useState } from 'react';
import { Modal, View, Text, Pressable, TouchableOpacity } from 'react-native';
import CheckBox from '@components/common/CheckBox';

interface SortDropdownProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const [selectedSortBy, setSelectedSortBy] = useState<string>('이름');
  const [selectedOrder, setSelectedOrder] = useState<string>('오름차순');
  const [hideCompleted, setHideCompleted] = useState(false);

  const sortByOptions = ['이름', '생성일', '시작일', '종료일', '진행률'];
  const orderOptions = ['오름차순', '내림차순'];

  const handleSortBySelect = (option: string) => {
    setSelectedSortBy(option);
    // TODO: 정렬 로직 구현
    onSelect(`sortBy:${option}`);
  };

  const handleOrderSelect = (option: string) => {
    setSelectedOrder(option);
    // TODO: 정렬 로직 구현
    onSelect(`order:${option}`);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1"
        onPress={onClose}
      >
        <Pressable
          className="absolute right-20 top-16 bg-white rounded-2xl w-40 p-4 shadow-lg"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-s font-bold text-black mb-2">정렬</Text>

          {/* 구분선 */}
          <View className="border-b border-lightgray -mx-4 mb-2" />

          {/* 정렬 기준 옵션들 */}
          <View>
            {sortByOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleSortBySelect(option)}
              >
                {selectedSortBy === option ? (
                  <View className="bg-red-orange-50 -mx-2 py-2 rounded">
                    <Text className="text-xs text-black px-2">
                      {option}
                    </Text>
                  </View>
                ) : (
                  <View className="py-2">
                    <Text className="text-xs text-black">
                      {option}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* 구분선 */}
          <View className="border-b border-lightgray -mx-4 my-2" />

          {/* 정렬 순서 옵션들 */}
          <View>
            {orderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleOrderSelect(option)}
              >
                {selectedOrder === option ? (
                  <View className="bg-red-orange-50 -mx-2 py-2 rounded">
                    <Text className="text-xs text-black px-2">
                      {option}
                    </Text>
                  </View>
                ) : (
                  <View className="py-2">
                    <Text className="text-xs text-black">
                      {option}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* 구분선 */}
          <View className="border-b border-lightgray -mx-4 my-2" />

          {/* 체크박스 */}
          <View className="-mx-3">
            <CheckBox
                label="완성 편물 아래로"
                checked={hideCompleted}
                onToggle={() => setHideCompleted(!hideCompleted)}
                size="xs"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SortDropdown;
