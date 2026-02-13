import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { activateKeepAwake, deactivateKeepAwake } from '@sayem314/react-native-keep-awake';
import { getScreenAwakeSetting, subscribeScreenAwakeSettingChange } from '@storage/settings';

/**
 * 앱 전역에서 screenAwake 설정을 KeepAwake와 동기화합니다.
 * - 루트(App)에서 1회 호출
 */
export function useScreenAwakeSync() {
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
      appStateSub.remove();
      unsubscribeSetting();
      deactivateKeepAwake();
    };
  }, []);
}

