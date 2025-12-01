import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useCallback } from 'react';
import { getAppVersion } from '@/src/shared/api/getAppVersion';
import { showUpdateAlert } from '@/src/shared/utils/showUpdateAlert';

export function useAppVersion() {
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
          console.log('force update');
          showUpdateAlert(title, message, storeUrl, true);
          return;

        // 권장 업데이트 Alert
        case 'RECOMMEND_UPDATE':
          console.log('recommend update');
          showUpdateAlert(title, message, storeUrl, false);
          return;

        // 업데이트 필요 없음
        case 'PASS':
          console.log('✨✨✨✨✨✨✨✨✨✨✨✨✨pass');
          return;

        default:
          throw new Error('UNKNOWN_STATUS'); // 알 수 없는 status인 경우 error 처리
      }
    } catch (error) {
      throw error;
    }
  }, []);

  return { checkAppVersion };
}
