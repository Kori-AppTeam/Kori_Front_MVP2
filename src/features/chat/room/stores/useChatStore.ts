// src/features/chat/room/stores/useChatStore.ts

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ChatMessage, RoomMessagesState } from '../types/chat.types';

// 전체 Store 상태
interface ChatStoreState {
  // roomId를 key로 하는 상태 관리
  rooms: Record<string, RoomMessagesState>;

  // 액션들
  // 메시지 관련
  addMessage: (roomId: string, message: ChatMessage) => void;
  removeMessage: (roomId: string, messageId: number) => void;
  setMessages: (roomId: string, messages: ChatMessage[]) => void;
  loadMoreMessages: (roomId: string, messages: ChatMessage[]) => void;

  // 입력 상태
  setCurrentMessage: (roomId: string, text: string) => void;
  clearCurrentMessage: (roomId: string) => void;

  // 로딩 상태
  setLoading: (roomId: string, isLoading: boolean) => void;
  setFetchingMore: (roomId: string, isFetchingMore: boolean) => void;
  setHasMore: (roomId: string, hasMore: boolean) => void;

  // 유틸리티
  clearMessages: (roomId: string) => void;
  resetRoom: (roomId: string) => void;
  setError: (roomId: string, error: Error | null) => void;

  // Room 초기화 헬퍼
  initializeRoom: (roomId: string) => void;
}

// Room 초기 상태
const initialRoomState: RoomMessagesState = {
  messages: [],
  currentMessage: '',
  isLoading: false,
  isFetchingMore: false,
  hasMore: true,
  error: null,
};

export const useChatStore = create<ChatStoreState>()(
  immer((set, get) => ({
    rooms: {},

    // Room 초기화
    initializeRoom: (roomId: string) => {
      set((state) => {
        if (!state.rooms[roomId]) {
          state.rooms[roomId] = { ...initialRoomState };
        }
      });
    },

    // 메시지 추가 (실시간)
    addMessage: (roomId: string, message: ChatMessage) => {
      set((state) => {
        if (!state.rooms[roomId]) {
          state.rooms[roomId] = { ...initialRoomState };
        }
        state.rooms[roomId].messages.unshift(message);
      });
    },

    // 메시지 삭제
    removeMessage: (roomId: string, messageId: number) => {
      set((state) => {
        if (state.rooms[roomId]) {
          state.rooms[roomId].messages = state.rooms[roomId].messages.filter(
            (m: ChatMessage) => m.id !== messageId
          );
        }
      });
    },

    // 메시지 목록 설정
    setMessages: (roomId: string, messages: ChatMessage[]) => {
      set((state) => {
        if (!state.rooms[roomId]) {
          state.rooms[roomId] = { ...initialRoomState };
        }
        state.rooms[roomId].messages = messages;
      });
    },

    // 이전 메시지 추가 로드 (무한 스크롤)
    loadMoreMessages: (roomId: string, messages: ChatMessage[]) => {
      set((state) => {
        if (state.rooms[roomId]) {
          state.rooms[roomId].messages.push(...messages);
        }
      });
    },

    // 현재 입력 중인 메시지 설정
    setCurrentMessage: (roomId: string, text: string) => {
      set((state) => {
        if (!state.rooms[roomId]) {
          state.rooms[roomId] = { ...initialRoomState };
        }
        state.rooms[roomId].currentMessage = text;
      });
    },

    // 입력 메시지 초기화
    clearCurrentMessage: (roomId: string) => {
      set((state) => {
        if (state.rooms[roomId]) {
          state.rooms[roomId].currentMessage = '';
        }
      });
    },

    // 로딩 상태 설정
    setLoading: (roomId: string, isLoading: boolean) => {
      set((state) => {
        if (state.rooms[roomId]) {
          state.rooms[roomId].isLoading = isLoading;
        }
      });
    },

    // 추가 로딩 상태 설정
    setFetchingMore: (roomId: string, isFetchingMore: boolean) => {
      set((state) => {
        if (state.rooms[roomId]) {
          state.rooms[roomId].isFetchingMore = isFetchingMore;
        }
      });
    },

    // hasMore 상태 설정
    setHasMore: (roomId: string, hasMore: boolean) => {
      set((state) => {
        if (state.rooms[roomId]) {
          state.rooms[roomId].hasMore = hasMore;
        }
      });
    },

    // 메시지 목록 초기화
    clearMessages: (roomId: string) => {
      set((state) => {
        if (state.rooms[roomId]) {
          state.rooms[roomId].messages = [];
          state.rooms[roomId].hasMore = true;
        }
      });
    },

    // Room 전체 초기화
    resetRoom: (roomId: string) => {
      set((state) => {
        state.rooms[roomId] = { ...initialRoomState };
      });
    },

    // 에러 설정
    setError: (roomId: string, error: Error | null) => {
      set((state) => {
        if (state.rooms[roomId]) {
          state.rooms[roomId].error = error;
        }
      });
    },
  }))
);