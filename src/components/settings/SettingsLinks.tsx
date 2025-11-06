// src/components/settings/SettingsLinks.tsx
import React from 'react';
import { View, Linking } from 'react-native';
import IconBox from '@components/common/IconBox';

interface SettingsLinksProps {}

/**
 * 설정 화면의 외부 링크 버튼들을 묶은 컴포넌트
 */
const SettingsLinks: React.FC<SettingsLinksProps> = () => {
  /**
   * 외부 링크 열기 (리뷰/문의)
   * @param type - 링크 타입 ('review' | 'contact')
   */
  const handlePress = (type: 'review' | 'contact') => {
    if (type === 'review') {
      // 원스토어 리뷰 링크 https://play.google.com/store/apps/details?id=com.simpleknitcounter&pcampaignid=web_share
      Linking.openURL('https://onesto.re/0001001132').catch(() => {
        // 에러 처리 (필요시 추가)
      });
    } else if (type === 'contact') {
      // 문의 이메일 링크
      const subject = encodeURIComponent('어쩜! 단수 카운터 문의');
      const email = 'Gaebal0201@gmail.com';
      const url = `mailto:${email}?subject=${subject}`;

      Linking.openURL(url).catch(() => {
        // 에러 처리 (필요시 추가)
      });
    }
  };
  return (
    <View className="mb-8">
      <IconBox
        title="별점 남기기"
        colorStyle="light"
        iconName="star"
        containerClassName="mb-4"
        onPress={() => handlePress('review')}
      />
      <IconBox
        title="문의하기"
        colorStyle="light"
        iconName="mail"
        containerClassName="mb-4"
        onPress={() => handlePress('contact')}
      />
    </View>
  );
};

export default SettingsLinks;
