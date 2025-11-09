import { StyleSheet, TextStyle } from 'react-native';

/**
 * TimeDisplay 컴포넌트 전용 스타일
 */
interface TimeDisplayStyleSheet {
  dseg7Bold: TextStyle;
  colonHidden: TextStyle;
}

export const timeDisplayStyles = StyleSheet.create<TimeDisplayStyleSheet>({
  // DSEG7Classic 폰트 패밀리
  dseg7Bold: {
    fontFamily: 'DSEG7Classic-Bold',
  },
  colonHidden: {
    color: 'transparent',
  },
});

