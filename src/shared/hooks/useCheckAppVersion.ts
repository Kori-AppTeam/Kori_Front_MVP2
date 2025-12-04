import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useCallback, useEffect, useState } from 'react';
import { getAppVersion } from '@/src/shared/api/getAppVersion';
import { showUpdateAlert, showUpdateErrorAlert } from '@/src/shared/utils/showUpdateAlert';

export function useCheckAppVersion() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAppUpToDate, setIsAppUpToDate] = useState<boolean>(false);

  const currentVersion = Constants.expoConfig?.version;
  const platform = Platform.OS;

  // 앱 버전 확인 및 업데이트 Alert 표시
  const checkAppVersion = useCallback(async () => {
    try {
      if (!currentVersion) {
        throw new Error('APP_VERSION_NOT_FOUND'); // 앱 버전 정보를 찾을 수 없는 경우 error 처리
      }
      const { status, title, message, storeUrl } = await getAppVersion(platform, currentVersion);
      switch (status) {
        // 강제 업데이트 Alert
        case 'FORCE_UPDATE':
          showUpdateAlert(title, message, storeUrl, true);
          setIsAppUpToDate(false);
          return;

        // 권장 업데이트 Alert
        case 'RECOMMEND_UPDATE':
          showUpdateAlert(title, message, storeUrl, false);
          setIsAppUpToDate(false);
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 앱 버전 확인
    checkAppVersion();
  }, []);

  return { isLoading, isAppUpToDate };
}
