// src/features/chat/room/stores/useChatStore.ts

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { ChatMessage, RoomMessagesState } from '../types/index';

// 전체 Store 상태
interface ChatStoreState extends RoomMessagesState {
  // 액션들
  // 메시지 관련
  addMessage: (message: ChatMessage) => void;
  removeMessage: (messageId: number) => void;
  setMessages: (messages: ChatMessage[]) => void;
  loadMoreMessages: (messages: ChatMessage[]) => void;
  setIsTranslating: (isTranslating: boolean) => void;
  mergeMessages: (newMessages: ChatMessage[]) => void;

  // 낙관적 업데이트
  addOptimisticMessage: (message: ChatMessage) => void;
  updateMessageStatus: (tempId: string, status: 'pending' | 'uploading' | 'success' | 'failed') => void;
  updateMessageError: (tempId: string, errorMessage: string) => void;
  replaceOptimisticMessage: (tempId: string, realMessage: ChatMessage) => void;
  removeOptimisticMessage: (tempId: string) => void;

  // 입력 상태
  setCurrentMessage: (text: string) => void;
  clearCurrentMessage: () => void;

  // 로딩 상태
  setLoading: (isLoading: boolean) => void;
  setFetchingMore: (isFetchingMore: boolean) => void;
  setHasMore: (hasMore: boolean) => void;

  // 유틸리티
  reset: () => void;
  setError: (error: Error | null) => void;

  // Room 초기화 헬퍼
  initialize: () => void;
}

// 초기 상태
const initialState: RoomMessagesState = {
  messages: [],
  currentMessage: '',
  isLoading: false,
  isFetchingMore: false,
  hasMore: true,
  error: null,
  isTranslating: false,
};

export const useChatStore = create<ChatStoreState>()(
  immer((set, get) => ({
    ...initialState,

    // 초기화
    initialize: () => {
      set((state) => {
        Object.assign(state, initialState);
      });
    },

    // 메시지 추가 (실시간)
    addMessage: (message: ChatMessage) => {
      set((state) => {
        state.messages = [message, ...state.messages];
      });
    },

    // 메시지 삭제
    removeMessage: (messageId: number) => {
      set((state) => {
        state.messages = state.messages.filter((m: ChatMessage) => m.id !== messageId);
      });
    },

    // 메시지 목록 설정
    setMessages: (messages: ChatMessage[]) => {
      set((state) => {
        state.messages = messages;
      });
    },

    // 이전 메시지 추가 로드 (무한 스크롤)
    loadMoreMessages: (messages: ChatMessage[]) => {
      set((state) => {
        state.messages.push(...messages);
      });
    },

    // 번역 상태 설정
    setIsTranslating: (isTranslating: boolean) => {
      set((state) => {
        state.isTranslating = isTranslating;
      });
    },

    // 현재 입력 중인 메시지 설정
    setCurrentMessage: (text: string) => {
      set((state) => {
        state.currentMessage = text;
      });
    },

    // 입력 메시지 초기화
    clearCurrentMessage: () => {
      set((state) => {
        state.currentMessage = '';
      });
    },

    // 로딩 상태 설정
    setLoading: (isLoading: boolean) => {
      set((state) => {
        state.isLoading = isLoading;
      });
    },

    // 추가 로딩 상태 설정
    setFetchingMore: (isFetchingMore: boolean) => {
      set((state) => {
        state.isFetchingMore = isFetchingMore;
      });
    },

    // hasMore 상태 설정
    setHasMore: (hasMore: boolean) => {
      set((state) => {
        state.hasMore = hasMore;
      });
    },

    // 전체 초기화
    reset: () => {
      set((state) => {
        Object.assign(state, initialState);
      });
    },

    // 에러 설정
    setError: (error: Error | null) => {
      set((state) => {
        state.error = error;
      });
    },

    // 메시지 병합
    mergeMessages: (newMessages: ChatMessage[]) =>
      set((state) => {
        const existingIds = new Set(state.messages.map((m) => m.id));
        const uniqueNew = newMessages.filter((m) => !existingIds.has(m.id));

        // id 기준으로 정렬된 상태 유지하며 병합
        const merged = [...state.messages, ...uniqueNew].sort((a, b) => b.id - a.id);

        return { messages: merged };
      }),

    // ============= 낙관적 업데이트 =============

    // 임시 메시지 추가 (업로드 시작)
    addOptimisticMessage: (message: ChatMessage) => {
      set((state) => {
        state.messages = [message, ...state.messages];
      });
    },

    // 메시지 상태 업데이트
    updateMessageStatus: (tempId: string, status: 'pending' | 'uploading' | 'success' | 'failed') => {
      set((state) => {
        const msg = state.messages.find((m) => m.tempId === tempId);
        if (msg) {
          msg.uploadStatus = status;
        }
      });
    },

    // 에러 메시지 업데이트
    updateMessageError: (tempId: string, errorMessage: string) => {
      set((state) => {
        const msg = state.messages.find((m) => m.tempId === tempId);
        if (msg) {
          msg.uploadStatus = 'failed';
          msg.errorMessage = errorMessage;
        }
      });
    },

    // 임시 메시지를 실제 메시지로 교체
    replaceOptimisticMessage: (tempId: string, realMessage: ChatMessage) => {
      set((state) => {
        const index = state.messages.findIndex((m) => m.tempId === tempId);
        if (index !== -1) {
          state.messages[index] = realMessage;
        }
      });
    },

    // 임시 메시지 제거 (에러 후 삭제 등)
    removeOptimisticMessage: (tempId: string) => {
      set((state) => {
        state.messages = state.messages.filter((m) => m.tempId !== tempId);
      });
    },
  })),
);
