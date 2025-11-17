// src/features/chat/room/hooks/useMessageSearch.ts
import { useCallback, useRef } from 'react';
import { FlatList } from 'react-native';
import { searchMessagesAPI } from '../api/messages';
import { useSearchStore } from '../stores/useSearchStore';
import { ChatMessage } from '../types/chat.types';

interface MessageSearchHook {
  state: {
    isActive: boolean;
    isSearching: boolean;
    searchText: string;
    searchResults: ChatMessage[];
    currentIndex: number;
    totalCount: number;
    error: Error | null;
  };
  flatListRef: React.RefObject<FlatList | null>;
  toggleSearch: () => void;
  setSearchText: (text: string) => void;
  performSearch: () => Promise<void>;
  navigateToUp: () => void;
  navigateToDown: () => void;
  clearSearch: () => void;
  isCurrentMessage: (messageId: number) => boolean;
  getSearchResultText: () => string;
}

export const useMessageSearch = (roomId: string, messages: ChatMessage[]): MessageSearchHook => {
  // Store에서 상태와 액션 가져오기
  const {
    isActive,
    isSearching,
    searchText,
    searchResults,
    currentIndex,
    totalCount,
    error,
    toggleSearch,
    setSearchText,
    setSearchResults,
    incrementIndex,
    decrementIndex,
    setError,
    clearSearch,
  } = useSearchStore();

  const flatListRef = useRef<FlatList>(null);

  /** 
   * 메시지로 스크롤하는 내부 함수
   * @param messageId 스크롤할 메시지 ID
   */
  const scrollToMessage = useCallback((messageId: number) => {
    const index = messages.findIndex(msg => msg.id === messageId);
    if (flatListRef.current && index !== -1) {
      try {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      } catch (error) {
        console.warn('스크롤 실패:', error);
      }
    }
  }, [messages]);

  /** 검색 수행 후 첫 번째 결과로 스크롤 */
  const performSearch = useCallback(async () => {
    if (!searchText.trim()) return;

    try {
      const results = await searchMessagesAPI(roomId, searchText);
      setSearchResults(results); // Store 액션 호출

      // 첫 번째 검색 결과로 스크롤
      if (results.length > 0) {
        scrollToMessage(results[0].id);
      }
    } catch (error) {
      console.error('검색 실패:', error);
      setError(error as Error); // Store 액션 호출
    }
  }, [searchText, roomId, scrollToMessage, setSearchResults, setError]);

  /** 다음 검색 결과(상단) 이동 */
  const navigateToUp = useCallback(() => {
    if (!isSearching || searchResults.length === 0) return;
    if (currentIndex + 1 >= searchResults.length) return;

    incrementIndex(); // Store 액션 호출
    const messageId = searchResults[currentIndex + 1].id;
    scrollToMessage(messageId);
  }, [isSearching, searchResults, currentIndex, incrementIndex, scrollToMessage]);

  /** 이전 검색 결과(하단) 이동 */
  const navigateToDown = useCallback(() => {
    if (!isSearching || searchResults.length === 0) return;
    if (currentIndex - 1 < 0) return;

    decrementIndex(); // Store 액션 호출
    const messageId = searchResults[currentIndex - 1].id;
    scrollToMessage(messageId);
  }, [isSearching, searchResults, currentIndex, decrementIndex, scrollToMessage]);

  /** 현재 메시지가 검색 결과인지 확인
   * @param messageId 메시지 ID
   */
  const isCurrentMessage = useCallback((messageId: number) => {
    if (!isSearching || searchResults.length === 0) return false;
    return searchResults[currentIndex]?.id === messageId;
  }, [isSearching, searchResults, currentIndex]);

  /** 검색 결과 텍스트 반환
   * @return 검색 결과 텍스트 (예: "2/5")
   */
  const getSearchResultText = useCallback(() => {
    if (!isSearching || totalCount === 0) return '';
    return `${currentIndex + 1}/${totalCount}`;
  }, [isSearching, totalCount, currentIndex]);

  return {
    state: {
      isActive,
      isSearching,
      searchText,
      searchResults,
      currentIndex,
      totalCount,
      error,
    },
    flatListRef,
    toggleSearch,
    setSearchText,
    performSearch,
    navigateToUp,
    navigateToDown,
    clearSearch,
    isCurrentMessage,
    getSearchResultText,
  };
};