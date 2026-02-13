import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { activateKeepAwake, deactivateKeepAwake } from '@sayem314/react-native-keep-awake';
import { getScreenAwakeSetting, subscribeScreenAwakeSettingChange } from '@storage/settings';

/**
 * 앱 전역에서 screenAwake 설정을 KeepAwake와 동기화합니다.
 * - 화면/페이지 단위로 흩뿌리지 않고 루트에 1회만 설치
 * - MMKV 리스너를 사용하여 값 변경을 자동으로 감지
 */
export function ScreenAwakeSync() {
  useEffect(() => {
    const applySetting = (enabled: boolean) => {
      if (enabled) {
        activateKeepAwake();
      } else {
        deactivateKeepAwake();
      }
    };

    const applyFromStorage = () => {
      applySetting(getScreenAwakeSetting());
    };

    // 초기값 즉시 적용
    applyFromStorage();

    // screenAwake 설정 변경 감지
    const unsubscribeSetting = subscribeScreenAwakeSettingChange(applyFromStorage);

    // 앱이 다시 active로 돌아올 때 KeepAwake가 풀리는 케이스 방지용 재적용
    const onAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        applyFromStorage();
      }
    };
    const appStateSub = AppState.addEventListener('change', onAppStateChange);

    return () => {
      // 리스너 해제 및 KeepAwake 해제
      appStateSub.remove();
      unsubscribeSetting();
      deactivateKeepAwake();
    };
  }, []);

  return null;
}

