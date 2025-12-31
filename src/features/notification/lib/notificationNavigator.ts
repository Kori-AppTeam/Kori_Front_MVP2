import { CHAT_ROUTE } from '@/src/shared/constants/route';
import { router } from 'expo-router';

type RouterLike = any;

/**
 * Handle chat-specific navigation for notifications.
 * Returns true if the data was handled as a chat notification.
 */
export function handleChatNotificationNavigation(opts: {
  pathname: string | null | undefined;
  data: { [key: string]: string | number | object } | undefined;
  pushDelay?: number;
  dismissDelay?: number;
}): boolean {
  const { pathname, data, pushDelay = 500, dismissDelay = 300 } = opts;
  if (!data) return false;
  if (String(data.type) !== 'chat') return false;

  const roomId = String((data as any).roomId);
  const roomName = String((data as any).roomName ?? '');

  const isChatRoomPath = /^\/chat\/[^\/]+$/.test(pathname ?? '');
  const isChatMembersPath = /^\/chat\/[^\/]+\/members$/.test(pathname ?? '');

  if (isChatRoomPath) {
    // 같은 채팅방 화면이면 replace
    router.replace({ pathname: CHAT_ROUTE(roomId), params: { roomName } });
    return true;
  }

  if (isChatMembersPath) {
    // 멤버 목록 화면이면 dismiss 후 replace
    if (router.canDismiss()) router.dismiss(1);
    setTimeout(() => {
      router.replace({ pathname: CHAT_ROUTE(roomId), params: { roomName } });
    }, dismissDelay);
    return true;
  }

  // 그 외는 push (navigate 또는 push)
  setTimeout(() => {
    router.navigate({ pathname: CHAT_ROUTE(roomId), params: { roomName } });
  }, pushDelay);

  return true;
}
