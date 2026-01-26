import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useCallback, useEffect, useState } from 'react';
import { getAppVersion } from '@/src/shared/api/getAppVersion';
import { showUpdateAlert, showUpdateErrorAlert } from '@/src/shared/utils/showUpdateAlert';
import { current } from 'immer';

export function useCheckAppVersion() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // NOTE: 강제 업데이트(Force)만 앱 진입을 막고, 그 외(권장/에러)는 앱 진입을 허용합니다.
  const [isAppUpToDate, setIsAppUpToDate] = useState<boolean>(true);

  const currentVersion = Constants.expoConfig?.version;
  const platform = Platform.OS;

  // 앱 버전 확인 및 업데이트 Alert 표시
  const checkAppVersion = useCallback(async () => {
    try {
      if (!currentVersion) {
        throw new Error('APP_VERSION_NOT_FOUND'); // 앱 버전 정보를 찾을 수 없는 경우 error 처리
      }
      //const { status, title, message, storeUrl } = await getAppVersion(platform, currentVersion);
      const { status, title, message, storeUrl } = await getAppVersion(platform, '1.2.8');
      switch (status) {
        // 강제 업데이트 Alert
        case 'FORCE_UPDATE':
          showUpdateAlert(title, message, storeUrl, true);
          setIsAppUpToDate(false);
          return;

        // 권장 업데이트 Alert
        case 'RECOMMEND_UPDATE':
          showUpdateAlert(title, message, storeUrl, false);
          // 권장 업데이트는 앱 사용을 허용
          setIsAppUpToDate(true);
          return;

        // 업데이트 필요 없음
        case 'PASS':
          setIsAppUpToDate(true);
          return;

        default:
          throw new Error('UNKNOWN_STATUS'); // 알 수 없는 status인 경우 error 처리
      }
    } catch (error: unknown) {
      showUpdateErrorAlert(error); // 에러 Alert 표시
      // 버전 체크 실패 시에도 앱이 스플래시에서 멈추지 않도록 진입 허용
      setIsAppUpToDate(true);
    } finally {
      setIsLoading(false);
    }
  }, [currentVersion, platform]);

  useEffect(() => {
    // 앱 버전 확인
    checkAppVersion();
  }, [checkAppVersion]);

  return { isLoading, isAppUpToDate };
}
