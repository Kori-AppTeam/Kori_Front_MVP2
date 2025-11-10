import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef, useState } from 'react';
import { loadMessagesAPI } from '../api/messages';
import { ChatMessage, ChatMessagesState } from '../types/chat.types';

interface ChatMessagesHook {
  state: ChatMessagesState;
  handleMessageChange: (text: string) => void;
  addMessage: (message: ChatMessage) => void;
  removeMessage: (messageId: number) => void;
  updateMessageList: () => void;
  loadMessages: () => Promise<void>;
  clearMessages: () => void;
}

export const useChatMessages = (
  roomId: string,
  stompConnection: any
): ChatMessagesHook => {
  const [state, setState] = useState<ChatMessagesState>({
    message: '',
    messages: [],
    isLoading: false,
    isFetchingMore: false,
    hasMore: true,
    error: null,
  });

  const myUserIdRef = useRef<string>('');

  /** 메시지 로드(+무한 스크롤) */
  const loadMessages = useCallback(async () => {
    if (!state.hasMore || state.isFetchingMore) return;

    setState(prev => ({ ...prev, isFetchingMore: true }));

    try {
      const lastMessageId = state.messages.length > 0 ? state.messages[state.messages.length - 1].id : '';

      const olderMessages: ChatMessage[] = await loadMessagesAPI(roomId, lastMessageId);

      if (olderMessages.length === 0) {
        setState(prev => ({
          ...prev,
          hasMore: false,
          isFetchingMore: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, ...olderMessages],
          isFetchingMore: false,
        }));
      }
    } catch (error) {
      console.error('이전 메시지 불러오기 실패', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isFetchingMore: false,
      }));
    }
  }, [roomId, state.messages, state.hasMore, state.isFetchingMore]);

  /** 메시지 입력 후 상태 업데이트 
   * @param text 입력된 메시지 텍스트
  */
  const handleMessageChange = useCallback((text: string) => {
    setState(prev => ({
      ...prev,
      message: text,
    }));
  }, []);

  /** 
   * 메시지 추가(실시간) 
   * @param message 추가할 메시지
   */
  const addMessage = useCallback((message: ChatMessage) => {
    setState(prev => ({
      ...prev,
      messages: [message, ...prev.messages],
    }));
  }, []);

  /** 
   * 메시지 제거(실시간) 
   * @param messageId 제거할 메시지 ID
   */
  const removeMessage = useCallback((messageId: number) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.filter(m => m.id !== messageId),
    }));
  }, []);

  /**
   * 메시지 목록 업데이트 (초기화 후 재로딩)
   */
  const updateMessageList = useCallback(() => {
    clearMessages();
    loadMessages();
  }, []);

  /** 메시지 목록 초기화 */
  const clearMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
      hasMore: true,
    }));
  }, []);

  // STOMP 연결 시 실시간 메시지 구독
  useEffect(() => {
    if (!stompConnection.state.connected) return;

    const getUserId = async () => {
      const myId = await SecureStore.getItemAsync('MyuserId');
      if (myId) {
        myUserIdRef.current = myId;

        // 실시간 메시지 구독
        stompConnection.subscribe(
          `/topic/user/${myId}/${roomId}/messages`,
          (message: ChatMessage) => {
            addMessage(message);
          }
        );

        // 메시지 삭제 구독
        stompConnection.subscribe(
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
  }, [stompConnection.state.connected, roomId, addMessage, removeMessage]);

  return {
    state,
    handleMessageChange,
    addMessage,
    removeMessage,
    updateMessageList,
    loadMessages,
    clearMessages,
  };
};