// src/features/chat/room/hooks/useMessageActions.ts
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useChatStore } from '../stores/useChatStore';

interface MessageActionsState {
  isSending: boolean;
  isDeleting: boolean;
  error: Error | null;
}

interface MessageActionsHook {
  state: MessageActionsState;
  sendMessage: (roomId: string) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  deleteMessageWithConfirm: (messageId: number) => void;
  markAsRead: (roomId: string) => Promise<void>;
}

export const useMessageActions = (stompConnection: any): MessageActionsHook => {
  const [state, setState] = useState<MessageActionsState>({
    isSending: false,
    isDeleting: false,
    error: null,
  });

  // Store에서 필요한 액션 가져오기
  const clearCurrentMessage = useChatStore((state) => state.clearCurrentMessage);
  const getCurrentMessage = (roomId: string) =>
    useChatStore.getState().rooms[roomId]?.currentMessage || '';

  /** 메시지 전송 */
  const sendMessage = useCallback(async (roomId: string) => {
    const currentMessage = getCurrentMessage(roomId);

    if (!currentMessage.trim()) return;
    if (!stompConnection.state.connected) {
      throw new Error('STOMP 연결이 되어있지 않습니다');
    }

    setState(prev => ({ ...prev, isSending: true, error: null }));

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

      await stompConnection.publish('/app/chat.sendMessage', body);

      // 메시지 전송 성공 후 입력창 초기화
      clearCurrentMessage(roomId);

      setState(prev => ({ ...prev, isSending: false }));
    } catch (error) {
      console.error('메시지 전송 실패', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isSending: false,
      }));
      throw error;
    }
  }, [stompConnection, clearCurrentMessage, getCurrentMessage]);

  /** 메시지 삭제 */
  const deleteMessage = useCallback(async (messageId: number) => {
    if (!stompConnection.state.connected) {
      throw new Error('STOMP 연결이 되어있지 않습니다');
    }

    setState(prev => ({ ...prev, isDeleting: true, error: null }));

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

      setState(prev => ({ ...prev, isDeleting: false }));
    } catch (error) {
      console.error('메시지 삭제 실패', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isDeleting: false,
      }));
      throw error;
    }
  }, [stompConnection]);

  /** 확인 다이얼로그와 함께 메시지 삭제 */
  const deleteMessageWithConfirm = useCallback((messageId: number) => {
    Alert.alert(
      'Message Delete',
      'Do you really want to delete this message?',
      [
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMessage(messageId),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [deleteMessage]);

  /** 채팅방 읽음 처리 */
  const markAsRead = useCallback(async (roomId: string) => {
    try {
      const api = (await import('@/api/axiosInstance')).default;
      await api.post(`/api/v1/chat/rooms/${roomId}/read-all`);
    } catch (error) {
      console.error('읽음 처리 실패', error);
      // 읽음 처리 실패는 사용자에게 보여주지 않음
    }
  }, []);

  return {
    state,
    sendMessage,
    deleteMessage,
    deleteMessageWithConfirm,
    markAsRead,
  };
};