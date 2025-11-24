import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import * as Linking from 'expo-linking';
import { getNotificationDeeplink } from '@/src/features/notification/lib/getNotificationDeeplink';

/* ------------ Background 또는 Quit 메시지 수신 및 클릭 핸들링 ------------ */
export const useBackgroundNotification = (isLoggedIn: boolean, checkingToken: boolean) => {
  useEffect(() => {
    if (!isLoggedIn || checkingToken) return;

    messaging()
      .getInitialNotification()
      .then((message) => {
        if (message) {
          const url = getNotificationDeeplink(message.data!) ?? '/';
          Linking.openURL(url);
        }
      })
      .catch((error) => {
        console.error('[ERROR] 앱 종료 시 알림 클릭 후 이동 실패:', error);
      });

    const unsubscribe = messaging().onNotificationOpenedApp((message) => {
      if (message) {
        const url = getNotificationDeeplink(message.data!) ?? '/';
        Linking.openURL(url);
      }
    });

    return unsubscribe;
  }, [isLoggedIn, checkingToken]);
};
