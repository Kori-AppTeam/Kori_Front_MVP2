import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import {
  getNotificationsSettingStatus,
  initNotificationsSettingStatus,
  putOSPushAgreement,
} from '@/src/features/notification/api/notifications';
import queryClient from '@/api/queryClient';
import { updateFcmToken } from '@/src/features/notification/lib/updateFcmToken';
import { useAppState } from '@/src/shared/hooks/useAppState';

const useNotificationPermission = () => {
  const appState = useAppState();
  const isCheckingPermissions = useRef(false);

  const [permissionSetupRequired, setPermissionSetupRequired] = useState<boolean>(false);

  /* ------------- OS 권한 요청 ------------- */
  const requestOSPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync(); // OS 권한 요청
      const granted = status === 'granted';
      await putOSPushAgreement(granted); // 서버에 OS 권한 상태 업데이트

      setPermissionSetupRequired(false);

      if (!granted) {
        Alert.alert('Notifications are turned off', 'You can enable notifications for Kori in Settings.');
        return;
      }

      await initNotificationsSettingStatus(true); // 서버 알림 상세 설정 true로 초기화
    } catch (error) {
      console.error('[ERROR] Notification permission or sync failed:', error);
    }
  };

  /* ------------- OS 권한 확인 및 서버 동기화 ------------- */
  const syncOSPermission = async () => {
    try {
      isCheckingPermissions.current = true;

      await updateFcmToken();

      const { status } = await Notifications.getPermissionsAsync();

      if (status === 'undetermined') {
        setPermissionSetupRequired(true);
        return;
      }

      if (status === 'denied') {
        await initNotificationsSettingStatus(false);
      } else {
        const serverStatus = await getNotificationsSettingStatus();
        if (serverStatus === 'NEEDS_SETUP') {
          await putOSPushAgreement(true);
          await initNotificationsSettingStatus(true);
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['notificationSettings'] }); // 알림 설정 query update
    } finally {
      isCheckingPermissions.current = false;
    }
  };

  useEffect(() => {
    if (appState === 'active' && !isCheckingPermissions.current) {
      syncOSPermission(); // 앱 초기화 시 OS 권한 동기화
    }
  }, [appState]);

  return { permissionSetupRequired, setPermissionSetupRequired, requestOSPermission };
};

export default useNotificationPermission;
