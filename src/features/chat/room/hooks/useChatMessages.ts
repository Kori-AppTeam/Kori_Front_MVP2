// src/features/chat/room/hooks/useChatMessages.ts
import { useStompStore } from '@/src/store/useStompStore';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef } from 'react';
import { loadMessagesAPI } from '../api/messages';
import { useChatStore } from '../stores/useChatStore';
import { ChatMessage, RoomMessagesState } from '../types/index';

interface ChatMessagesHook {
  state: RoomMessagesState;
  handleMessageChange: (text: string) => void;
  removeMessage: (messageId: number) => void;
  updateMessageList: () => void;
  loadMessages: () => Promise<void>;
  clearMessages: () => void;
}

export const useChatMessages = (
  roomId: string,
): ChatMessagesHook => {
  const myUserIdRef = useRef<string>('');

  const stompConnection = useStompStore((state) => state);

  // Chat Store에서 필요한 상태와 액션 가져오기
  const roomState = useChatStore((state) => state.rooms[roomId]);
  const initializeRoom = useChatStore((state) => state.initializeRoom);
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
    initializeRoom(roomId);
  }, [roomId, initializeRoom]);

  // 기본값 설정 (room이 아직 초기화되지 않은 경우)
  const state: RoomMessagesState = roomState || {
    currentMessage: '',
    messages: [],
    isLoading: false,
    isFetchingMore: false,
    hasMore: true,
    error: null,
  };


  /** 메시지 로드(+무한 스크롤) */
  const loadMessages = useCallback(async () => {
    if (!state.hasMore || state.isFetchingMore) return;

    setFetchingMore(roomId, true);

    try {
      const lastMessageId = state.messages.length > 0
        ? state.messages[state.messages.length - 1].id
        : '';

      const olderMessages: ChatMessage[] = await loadMessagesAPI(roomId, lastMessageId);

      if (olderMessages.length === 0) {
        setHasMore(roomId, false);
      } else {
        loadMoreMessagesToStore(roomId, olderMessages);
      }

      setFetchingMore(roomId, false);
    } catch (error) {
      console.error('이전 메시지 불러오기 실패', error);
      setError(roomId, error as Error);
      setFetchingMore(roomId, false);
    }
  }, [roomId, state.messages, state.hasMore, state.isFetchingMore, setFetchingMore, setHasMore, loadMoreMessagesToStore, setError]);

  /** 
   * 메시지 입력 후 상태 업데이트 
   * @param text 입력된 메시지 텍스트
   */
  const handleMessageChange = useCallback((text: string) => {
    setCurrentMessage(roomId, text);
  }, [roomId, setCurrentMessage]);


  /** 
   * 메시지 제거(실시간) 
   * @param messageId 제거할 메시지 ID
   */
  const removeMessage = useCallback((messageId: number) => {
    removeMessageFromStore(roomId, messageId);
  }, [roomId, removeMessageFromStore]);

  /**
   * 메시지 목록 업데이트 (초기화 후 재로딩)
   */
  const updateMessageList = useCallback(() => {
    clearMessages();
    loadMessages();
  }, [loadMessages]);

  /** 메시지 목록 초기화 */
  const clearMessages = useCallback(() => {
    clearMessagesInStore(roomId);
  }, [roomId, clearMessagesInStore]);

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
            addMessageToStore(roomId, message);
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
    state,
    handleMessageChange,
    removeMessage,
    updateMessageList,
    loadMessages,
    clearMessages,
  };
};