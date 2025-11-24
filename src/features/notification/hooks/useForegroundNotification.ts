import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { handleNotificationPress, messageHandler } from '@/src/features/notification/lib/messageHandler';

/* ---------------- Foreground 메시지 수신 및 클릭 핸들링 ---------------- */
export const useForegroundNotification = (isLoggedIn: boolean, pathname?: string) => {
  useEffect(() => {
    if (!isLoggedIn || !pathname) return;

    const unsubscribeOnMessage = messaging().onMessage(messageHandler);
    const unsubscribeNotifee = handleNotificationPress(pathname);

    return () => {
      unsubscribeOnMessage();
      unsubscribeNotifee();
    };
  }, [isLoggedIn, pathname]);
};
