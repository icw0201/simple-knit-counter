import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Linking, Platform, type AppStateStatus } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import SpInAppUpdates, { type NeedsUpdateResponse } from 'sp-react-native-in-app-updates';
import { ConfirmModal } from '@components/common/modals';
import { getDismissedStoreVersion, setDismissedStoreVersion } from '@storage/updatePrompt';

type UpdateState = {
  shouldShow: boolean;
  mode?: 'play' | 'onestore';
  storeVersion?: string;
};

const ONE_STORE_URL = 'https://onesto.re/0001001132';
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.simpleknitcounter&pcampaignid=web_share';

/**
 * 스토어 업데이트 권장 프롬프트 (Android)
 * - 최신 버전 확인(조회)만 수행
 * - 사용자가 "업데이트"를 누르면 각 스토어 링크로 이동
 *
 * 주의: Play In-App Updates는 디버그 빌드에서 정상 동작하지 않습니다.
 *       그래서 __DEV__ 환경에서는 체크/노출을 생략합니다.
 */
export default function StoreUpdatePrompt() {
  const inAppUpdates = useMemo(() => new SpInAppUpdates(__DEV__), []);
  const [update, setUpdate] = useState<UpdateState>({ shouldShow: false });
  const [installerPackage, setInstallerPackage] = useState<string | null | undefined>(undefined);

  const lastCheckedAtRef = useRef<number>(0);

  const isAndroid = Platform.OS === 'android';

  const isOnestoreInstaller = (pkg: string | null | undefined) => {
    return pkg === 'com.skt.skaf.A000Z00040';
  };

  const getUpdateMode = (): 'play' | 'onestore' | undefined => {
    if (!isAndroid) {
      return undefined;
    }
    // 설치 출처를 아직 못 가져온 상태면 판단 보류
    if (installerPackage === undefined) {
      return undefined;
    }
    if (isOnestoreInstaller(installerPackage)) {
      return 'onestore';
    }
    // installer 를 알 수 없더라도(unknown/null) 대부분 Play 환경이므로 기본은 play로 둠
    return 'play';
  };

  const checkForUpdate = async () => {
    if (!isAndroid) {
      return;
    }
    if (__DEV__) {
      return;
    }

    const mode = getUpdateMode();
    if (!mode) {
      return;
    }

    // 과도한 호출 방지: 포그라운드 복귀 시에도 최소 6시간에 1번만 체크
    const now = Date.now();
    const SIX_HOURS = 6 * 60 * 60 * 1000;
    if (now - lastCheckedAtRef.current < SIX_HOURS) {
      return;
    }
    lastCheckedAtRef.current = now;

    try {
      const curVersion = DeviceInfo.getVersion(); // "x.x.x"
      const result: NeedsUpdateResponse = await inAppUpdates.checkNeedsUpdate({ curVersion });

      if (!result.shouldUpdate) {
        return;
      }

      const storeVersion = result.storeVersion;
      const dismissed = getDismissedStoreVersion();

      // 같은 storeVersion에 대해서는 "나중에" 이후 재노출 방지
      if (storeVersion && dismissed === storeVersion) {
        return;
      }

      setUpdate({ shouldShow: true, mode, storeVersion });
    } catch {
      // 체크 실패 시에는 아무것도 노출하지 않음 (사용자 번거로움 방지)
    }
  };

  useEffect(() => {
    if (!isAndroid) {
      return;
    }
    if (__DEV__) {
      return;
    }

    // 설치 출처(Play/원스토어 등) 확인
    DeviceInfo.getInstallerPackageName()
      .then((pkg) => setInstallerPackage(pkg))
      .catch(() => setInstallerPackage(null));
  }, [isAndroid]);

  useEffect(() => {
    checkForUpdate();

    const onAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        checkForUpdate();
      }
    };

    const sub = AppState.addEventListener('change', onAppStateChange);
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installerPackage]);

  const handleClose = () => {
    if (update.storeVersion) {
      setDismissedStoreVersion(update.storeVersion);
    }
    setUpdate({ shouldShow: false });
  };

  const handleStartUpdate = async () => {
    setUpdate({ shouldShow: false, storeVersion: update.storeVersion });

    try {
      const isOnestore = update.mode === 'onestore' || isOnestoreInstaller(installerPackage);
      await Linking.openURL(isOnestore ? ONE_STORE_URL : PLAY_STORE_URL);
    } catch {
      // 시작 실패 시 조용히 무시
    }
  };

  if (!isAndroid) {
    return null;
  }

  const storeVersionText = update.storeVersion ? ` (최신: v${update.storeVersion})` : '';
  const description =
    update.mode === 'onestore'
      ? `새 버전이 출시됐어요${storeVersionText}.\n지금 원스토어로 이동할까요?`
      : `새 버전이 출시됐어요${storeVersionText}.\n지금 플레이스토어로 이동할까요?`;

  return (
    <>
      <ConfirmModal
        visible={update.shouldShow}
        onClose={handleClose}
        title="업데이트 안내"
        description={description}
        cancelText="나중에"
        confirmText="업데이트"
        onConfirm={handleStartUpdate}
      />
    </>
  );
}

