import { useStompStore } from '@/src/store/useStompStore';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef } from 'react';
import { Alert, FlatList } from 'react-native';
import { useChatStore } from '../stores/useChatStore';

interface MessageActionsHook {
  sendMessage: (roomId: string) => Promise<void>;
  deleteMessageWithConfirm: (messageId: number) => void;
}

interface MessageActionsParams {
  flatListRef?: React.RefObject<FlatList | null>;
  myUserId: string;
}

export const useMessageActions = ({ flatListRef, myUserId }: MessageActionsParams): MessageActionsHook => {
  // Store에서 필요한 액션 가져오기
  const stompConnection = useStompStore((state) => state);
  const clearCurrentMessage = useChatStore((state) => state.clearCurrentMessage);
  const getCurrentMessage = () => useChatStore.getState().currentMessage;
  const messages = useChatStore((state) => state.messages);
  const shouldScrollRef = useRef(false);

  // 내가 보낸 메시지가 추가되었을 때 스크롤
  useEffect(() => {
    if (shouldScrollRef.current && messages.length > 0) {
      const latestMessage = messages[0];
      if (latestMessage.senderId.toString() === myUserId) {
        requestAnimationFrame(() => {
          flatListRef?.current?.scrollToOffset({ offset: 0, animated: true });
        });
      }
      shouldScrollRef.current = false;
    }
  }, [messages, myUserId, flatListRef]);

  /** 메시지 전송 */
  const sendMessage = useCallback(
    async (roomId: string) => {
      const currentMessage = getCurrentMessage();

      if (!currentMessage.trim()) return;
      if (!stompConnection.connected) {
        throw new Error('STOMP 연결이 되어있지 않습니다');
      }

      try {
        const myUserId = await SecureStore.getItemAsync('MyuserId');
        if (!myUserId) {
          throw new Error('사용자 ID를 찾을 수 없습니다');
        }

        const body = {
          roomId,
          senderId: myUserId,
          content: currentMessage.trim(),
        };

        // 메시지 전송 전에 스크롤 플래그 설정
        shouldScrollRef.current = true;

        await stompConnection.publish('/app/chat.sendMessage', body);

        // 메시지 전송 성공 후 입력창 초기화
        clearCurrentMessage();
      } catch (error) {
        console.error('메시지 전송 실패', error);
        throw error;
      }
    },
    [stompConnection, clearCurrentMessage, getCurrentMessage],
  );

  /** 메시지 삭제 */
  const deleteMessage = useCallback(
    async (messageId: number) => {
      if (!stompConnection.connected) {
        throw new Error('STOMP 연결이 되어있지 않습니다');
      }

      try {
        const myUserId = await SecureStore.getItemAsync('MyuserId');
        if (!myUserId) {
          throw new Error('사용자 ID를 찾을 수 없습니다');
        }

        const deleteData = {
          messageId,
          senderId: myUserId,
        };

        await stompConnection.publish('/app/chat.deleteMessage', deleteData);
      } catch (error) {
        console.error('메시지 삭제 실패', error);
      }
    },
    [stompConnection],
  );

  /** 확인 다이얼로그와 함께 메시지 삭제 */
  const deleteMessageWithConfirm = useCallback(
    (messageId: number) => {
      Alert.alert('Message Delete', 'Do you really want to delete this message?', [
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMessage(messageId),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    },
    [deleteMessage],
  );

  return {
    sendMessage,
    deleteMessageWithConfirm,
  };
};
