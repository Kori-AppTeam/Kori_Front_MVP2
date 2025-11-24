// src/features/chat/room/hooks/useChatMessages.ts
import { useStompStore } from '@/src/store/useStompStore';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef } from 'react';
import { loadMessagesAPI } from '../api/messages';
import { updateTranslateStateAPI } from '../api/translation';
import { useChatStore } from '../stores/useChatStore';
import { ChatMessage } from '../types/index';

interface ChatMessagesHook {
  loadMessages: () => Promise<void>;
}

export const useChatMessages = (
  roomId: string,
): ChatMessagesHook => {
  const myUserIdRef = useRef<string>('');

  const stompConnection = useStompStore((state) => state);

  // Chat Store에서 필요한 상태와 액션 가져오기
  const state = useChatStore((state) => state);
  const initialize = useChatStore((state) => state.initialize);
  const addMessageToStore = useChatStore((state) => state.addMessage);
  const removeMessageFromStore = useChatStore((state) => state.removeMessage);
  const loadMoreMessagesToStore = useChatStore((state) => state.loadMoreMessages);
  const setCurrentMessage = useChatStore((state) => state.setCurrentMessage);
  const setFetchingMore = useChatStore((state) => state.setFetchingMore);
  const setHasMore = useChatStore((state) => state.setHasMore);
  const setError = useChatStore((state) => state.setError);
  const clearMessagesInStore = useChatStore((state) => state.clearMessages);

  // Room 초기화 (컴포넌트 마운트 시)
  useEffect(() => {
    const init = async () => {
      initialize();

      // 번역 상태 설정
      await updateTranslateStateAPI(roomId, true);
    };

    init();

    return () => {
      useChatStore.getState().reset();
    };
  }, [roomId, initialize]);



  /** 메시지 로드(+무한 스크롤) */
  const loadMessages = useCallback(async () => {
    if (!state.hasMore || state.isFetchingMore) return;

    setFetchingMore(true);

    try {
      const lastMessageId = state.messages.length > 0
        ? state.messages[state.messages.length - 1].id
        : '';
      const olderMessages: ChatMessage[] = await loadMessagesAPI(roomId, lastMessageId);
      if (olderMessages.length === 0) {
        setHasMore(false);
      } else {
        loadMoreMessagesToStore(olderMessages);
      }

      setFetchingMore(false);
    } catch (error) {
      console.error('이전 메시지 불러오기 실패', error);
      setError(error as Error);
      setFetchingMore(false);
    }
  }, [roomId, state.messages, state.hasMore, state.isFetchingMore, setFetchingMore, setHasMore, loadMoreMessagesToStore, setError]);

  /** 
   * 메시지 입력 후 상태 업데이트 
   * @param text 입력된 메시지 텍스트
   */
  const handleMessageChange = useCallback((text: string) => {
    setCurrentMessage(text);
  }, [setCurrentMessage]);


  /** 
   * 메시지 제거(실시간) 
   * @param messageId 제거할 메시지 ID
   */
  const removeMessage = useCallback((messageId: number) => {
    removeMessageFromStore(messageId);
  }, [removeMessageFromStore]);

  /** 메시지 목록 초기화 */
  const clearMessages = useCallback(() => {
    clearMessagesInStore();
  }, [clearMessagesInStore]);

  // STOMP 연결 시 실시간 메시지 구독
  useEffect(() => {
    if (!stompConnection.connected) return;

    let unsubscribeMessages: (() => void) | undefined;
    let unsubscribeDeletes: (() => void) | undefined;

    const getUserId = async () => {
      const myId = await SecureStore.getItemAsync('MyuserId');
      if (myId) {
        myUserIdRef.current = myId;

        // 실시간 메시지 구독
        unsubscribeMessages = stompConnection.subscribe(
          `/topic/user/${myId}/${roomId}/messages`,
          (message) => {
            addMessageToStore(message);
          }
        );

        // 메시지 삭제 구독
        unsubscribeDeletes = stompConnection.subscribe(
          `/topic/rooms/${roomId}`,
          (data: any) => {
            if (data.type === 'delete') {
              removeMessage(Number(data.id));
            }
          }
        );
      }
    };

    getUserId();

    return () => {
      unsubscribeMessages?.();
      unsubscribeDeletes?.();
    };
  }, [stompConnection.connected, roomId, removeMessage]);

  return {
    loadMessages,
  };
};