import { getNotificationDeeplink } from '@/src/features/notification/lib/getNotificationDeeplink';
import { CHAT_ROUTE } from '@/src/shared/constants/route';
import messaging from '@react-native-firebase/messaging';
import * as Linking from 'expo-linking';
import { usePathname, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

const PENDING_KEY = 'PENDING_NOTIFICATION_URL';

/* ------------ Background 또는 Quit 메시지 수신 및 클릭 핸들링 ------------ */
export const useBackgroundNotification = (isLoggedIn: boolean, checkingToken: boolean) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 항상 초기/열림 알림 확인 및 리스너 등록
    let unsub: (() => void) | undefined;

    const navigateOrStore = async (data: { [key: string]: string | number | object } | undefined) => {
      if (!data) return;
      const deeplink = getNotificationDeeplink(data) ?? '/';
      // 인증 전이면 임시 저장
      if (!isLoggedIn || checkingToken) {
        await SecureStore.setItemAsync(PENDING_KEY, JSON.stringify({ deeplink, data }));
        return;
      }

      // 현재 경로에 따라 replace / dismiss+replace / push 결정 (chat 전용 사례)
      if (String(data.type) === 'chat') {
        const roomId = String((data as any).roomId);
        const roomName = String((data as any).roomName ?? '');
        const isChatRoomPath = /^\/chat\/[^\/]+$/.test(pathname ?? '');
        const isChatMembersPath = /^\/chat\/[^\/]+\/members$/.test(pathname ?? '');

        if (isChatRoomPath) {
          router.replace({ pathname: CHAT_ROUTE(roomId), params: { roomName } });
          return;
        }
        if (isChatMembersPath) {
          router.dismiss(1);
          setTimeout(() => router.replace({ pathname: CHAT_ROUTE(roomId), params: { roomName } }), 300);
          return;
        }
        router.push({ pathname: CHAT_ROUTE(roomId), params: { roomName } });
        return;
      }

      // chat 이외는 deeplink 열기(기존 행동 유지)
      Linking.openURL(deeplink).catch(() => {});
    };

    messaging()
      .getInitialNotification()
      .then((message) => {
        if (message) {
          console.info('[INFO] 앱 종료 상태에서 알림 클릭으로 앱 실행됨:', message);
          navigateOrStore(message.data);
        } else {
          // no initial notification
        }
      })
      .catch((error) => {
        console.error('[ERROR] 앱 종료 시 알림 클릭 후 이동 실패:', error);
      });

    unsub = messaging().onNotificationOpenedApp((message) => {
      if (message) {
        navigateOrStore(message.data);
      }
    });

    return () => {
      if (unsub) unsub();
    };
  }, [isLoggedIn, checkingToken, router, pathname]);

  // 인증 완료 시(또는 checkingToken -> false, isLoggedIn true) 보관된 알림 처리
  useEffect(() => {
    const processPending = async () => {
      if (!isLoggedIn || checkingToken) return;
      const raw = await SecureStore.getItemAsync(PENDING_KEY);
      if (!raw) return;
      try {
        const { data } = JSON.parse(raw);
        await SecureStore.deleteItemAsync(PENDING_KEY);
        // 저장된 data로 네비게이트
        const deeplink = getNotificationDeeplink(data) ?? '/';
        // chat 전용 로직은 위와 동일하게 처리하면 됨; 간단하게 Linking으로 열어도 무방
        Linking.openURL(deeplink).catch(() => {});
      } catch (e) {
        await SecureStore.deleteItemAsync(PENDING_KEY);
      }
    };
    processPending();
  }, [isLoggedIn, checkingToken]);
};
